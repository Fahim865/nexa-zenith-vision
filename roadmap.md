# NEXA — completion & polish roadmap

- [x] Resume Lovable Cloud backend (was paused)
- [x] Verify schema, RLS policies and credit RPCs (spend_credits / finish_run / refund_run) are live
- [ ] Verify email/password auth end-to-end: signup → 50 credits → sign in → sign out → session persistence
- [ ] Verify /api/ai-tool + /api/chat stream real AI, deduct 2 credits, save output, refund on failure
- [ ] Verify chat threads: save, restore, titles, message history
- [ ] Favorites / Quick Pin system (homepage top row + Dashboard card + pin buttons)
- [ ] Privacy-first trust badge on client-side tools; server badge on AI tools
- [ ] Request a Tool / Feedback modal (anon-safe `tool_requests` table)
- [ ] /privacy + /terms routes, linked in footer
- [ ] NEXA-styled 404 + empty states
- [ ] Full route/tool/auth audit with zero console errors
- [ ] (Final phase, excluded now) Paddle payments + Google OAuth verification
