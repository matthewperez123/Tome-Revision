-- ─────────────────────────────────────────────
-- In-app notifications for new direct messages
-- ─────────────────────────────────────────────
-- The notification_type enum already carries 'message', but nothing ever
-- emitted it: the on_message_insert trigger only bumped conversations.
-- last_message_at, and both write paths (start_conversation's first message
-- and the sendMessage insert) only fanned out *emails*. So a recipient never
-- saw an in-app notification — a silent breaker.
--
-- Fix: one AFTER INSERT trigger on public.messages notifies every OTHER
-- participant through the existing SECURITY DEFINER create_notification helper.
-- Because start_conversation's opening message is itself a messages insert,
-- this single trigger covers both new threads and replies.

create or replace function public.notify_message_recipients()
returns trigger
language plpgsql
security definer
set search_path to ''
as $function$
declare
  _sender_name text;
  _rid uuid;
begin
  select coalesce(nullif(trim(display_name), ''), 'Someone')
    into _sender_name
    from public.profiles
   where id = new.sender_id;

  for _rid in
    select profile_id
      from public.conversation_participants
     where conversation_id = new.conversation_id
       and profile_id <> new.sender_id
  loop
    perform public.create_notification(
      _rid,
      'message'::public.notification_type,
      new.sender_id,
      'conversation',
      new.conversation_id::text,
      jsonb_build_object(
        'title', 'New message from ' || coalesce(_sender_name, 'Someone'),
        'body',  left(new.body, 200),
        'action_url', '/messages'
      )
    );
  end loop;

  return new;
end;
$function$;

drop trigger if exists on_message_notify on public.messages;
create trigger on_message_notify
  after insert on public.messages
  for each row execute function public.notify_message_recipients();
