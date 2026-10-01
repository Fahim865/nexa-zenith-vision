DROP FUNCTION public.spend_credits(integer, text, text, text);
DROP FUNCTION public.finish_run(uuid, text);
DROP FUNCTION public.refund_run(uuid);

CREATE OR REPLACE FUNCTION public.spend_credits(_uid uuid, _amount integer, _tool text, _kind text, _input text)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _run uuid;
BEGIN
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
  UPDATE public.ai_runs SET output = left(_output, 20000) WHERE id = _run;
$$;

CREATE OR REPLACE FUNCTION public.refund_run(_run uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _c integer; _u uuid;
BEGIN
  DELETE FROM public.ai_runs WHERE id = _run AND output IS NULL RETURNING credits, user_id INTO _c, _u;
  IF _c IS NOT NULL THEN UPDATE public.profiles SET credits = credits + _c WHERE id = _u; END IF;
END $$;

REVOKE EXECUTE ON FUNCTION public.spend_credits(uuid, integer, text, text, text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.finish_run(uuid, text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.refund_run(uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.spend_credits(uuid, integer, text, text, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.finish_run(uuid, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.refund_run(uuid) TO service_role;