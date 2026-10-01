CREATE TABLE public.profiles (
  id uuid PRIMARY KEY,
  display_name text,
  credits integer NOT NULL DEFAULT 50,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile read" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE TABLE public.conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL DEFAULT 'New chat',
  messages jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.conversations TO authenticated;
GRANT ALL ON public.conversations TO service_role;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own conversations" ON public.conversations FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.ai_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  tool_slug text NOT NULL,
  kind text NOT NULL DEFAULT 'generation',
  input text,
  output text,
  credits integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, DELETE ON public.ai_runs TO authenticated;
GRANT ALL ON public.ai_runs TO service_role;
ALTER TABLE public.ai_runs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own runs read" ON public.ai_runs FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own runs delete" ON public.ai_runs FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Atomically spend credits for the calling user and log the run. Raises when balance is too low.
CREATE OR REPLACE FUNCTION public.spend_credits(_amount integer, _tool text, _kind text, _input text)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _uid uuid := auth.uid(); _run uuid;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'not_authenticated'; END IF;
  IF _amount < 0 OR _amount > 20 THEN RAISE EXCEPTION 'invalid_amount'; END IF;
  INSERT INTO public.profiles (id) VALUES (_uid) ON CONFLICT (id) DO NOTHING;
  UPDATE public.profiles SET credits = credits - _amount WHERE id = _uid AND credits >= _amount;
  IF NOT FOUND THEN RAISE EXCEPTION 'insufficient_credits'; END IF;
  INSERT INTO public.ai_runs (user_id, tool_slug, kind, input, credits)
  VALUES (_uid, _tool, _kind, left(_input, 4000), _amount) RETURNING id INTO _run;
  RETURN _run;
END $$;

CREATE OR REPLACE FUNCTION public.finish_run(_run uuid, _output text)
RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  UPDATE public.ai_runs SET output = left(_output, 20000) WHERE id = _run AND user_id = auth.uid();
$$;

-- Refund when the AI call fails before producing a result.
CREATE OR REPLACE FUNCTION public.refund_run(_run uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _c integer;
BEGIN
  DELETE FROM public.ai_runs WHERE id = _run AND user_id = auth.uid() AND output IS NULL RETURNING credits INTO _c;
  IF _c IS NOT NULL THEN UPDATE public.profiles SET credits = credits + _c WHERE id = auth.uid(); END IF;
END $$;

REVOKE EXECUTE ON FUNCTION public.spend_credits(integer, text, text, text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.finish_run(uuid, text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.refund_run(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.spend_credits(integer, text, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.finish_run(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.refund_run(uuid) TO authenticated;