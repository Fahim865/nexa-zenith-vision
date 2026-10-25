CREATE TABLE public.tool_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_name text NOT NULL,
  details text,
  email text,
  user_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.tool_requests TO anon, authenticated;
GRANT ALL ON public.tool_requests TO service_role;
ALTER TABLE public.tool_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can suggest a tool" ON public.tool_requests FOR INSERT TO anon, authenticated WITH CHECK (true);