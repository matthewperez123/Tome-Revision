-- Harden EXECUTE grants on SECURITY DEFINER functions.
--
-- Default Supabase grants EXECUTE to PUBLIC + anon + authenticated on every
-- function. For SECURITY DEFINER functions that elevates the blast radius of
-- any one being callable by an unauthenticated (anon) session, since the body
-- runs with the definer's privileges. We scope each function to the smallest
-- role that actually invokes it. This clears the Supabase linter
-- 0028_anon_security_definer_function_executable warnings; the remaining
-- 0029_authenticated warnings on the RLS helpers + start_conversation are
-- expected and intentional (see below).

-- Trigger functions: fired by the trigger owner, never called directly by a
-- client. No client role needs EXECUTE.
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.bump_conversation() FROM PUBLIC, anon, authenticated;

-- Service-role-only RPC: invoked exclusively by the admin (service_role)
-- client from src/lib/email/new-message.ts. No client role needs EXECUTE.
REVOKE EXECUTE ON FUNCTION public.claim_email_slot(uuid, uuid, integer) FROM PUBLIC, anon, authenticated;

-- Authenticated-client RPC: invoked by the user-scoped client from
-- src/lib/actions/messages.ts. anon never calls it, but authenticated must
-- retain EXECUTE.
REVOKE EXECUTE ON FUNCTION public.start_conversation(uuid, uuid[], text, text) FROM PUBLIC, anon;

-- RLS helper functions: evaluated inside RLS policies, so the AUTHENTICATED
-- role must retain EXECUTE (policy evaluation runs as the calling role).
-- anon sessions never hit the policies that use them, so drop anon + PUBLIC.
-- These keep a 0029_authenticated warning by design — revoking authenticated
-- would break RLS policy evaluation.
REVOKE EXECUTE ON FUNCTION public.can_access_classroom(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_conversation_participant(uuid, uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.shares_classroom(uuid, uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.user_has_classroom_role(uuid, uuid, text[]) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.can_recommend_to(uuid, uuid) FROM PUBLIC, anon;
