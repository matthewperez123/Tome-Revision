-- ─────────────────────────────────────────────────────────────────────────────
-- user_stats = the SINGLE source of truth for gamification (Wisdom / streak /
-- hearts / coins / daily goal / streak-freeze).
--
-- Before this migration gamification lived in THREE disconnected stores:
--   1. localStorage `tome-user-stats` (economy-provider) — per-browser, spoofable
--   2. profiles.total_xp / profiles.current_streak — written only by the quiz API
--   3. user_stats — read by the dashboard but never written → empty for everyone
-- so a real account saw "0 Wisdom / 5 Hearts" (client defaults) on the dashboard
-- while localStorage showed different numbers.
--
-- This migration makes user_stats canonical:
--   • the signup trigger now seeds a user_stats row (+ backfill for existing users)
--   • all mutations go through SECURITY DEFINER economy_* RPCs that recompute
--     hearts-regen and streak server-side, so the client cannot spoof them
--     (direct INSERT/UPDATE/DELETE on user_stats is revoked from clients)
--   • profiles.total_xp / profiles.current_streak are kept only as a CACHED MIRROR
--     (the weekly-digest cron + family/parent views still read them via a join);
--     they are written by the RPCs, never read as truth. Safe to drop later once
--     those readers are repointed at user_stats.
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Per-day progress bucket so the streak/daily-goal logic can reset cleanly at
--    the calendar boundary without conflating "today's minutes" with the streak.
alter table public.user_stats
  add column if not exists daily_progress_date date not null default current_date;

-- 2. Signup trigger: seed a user_stats row alongside the profile.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path to ''
as $function$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', null)
  )
  on conflict (id) do nothing;

  insert into public.notification_preferences (profile_id)
  values (new.id)
  on conflict do nothing;

  insert into public.user_stats (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$function$;

-- 3. Backfill: every existing auth user gets a user_stats row at defaults.
insert into public.user_stats (user_id)
select u.id
from auth.users u
left join public.user_stats s on s.user_id = u.id
where s.user_id is null;

-- 4. Anti-spoof: clients may READ their own row but never write it directly.
--    The economy_* RPCs (SECURITY DEFINER, owner-run) are the only write path.
revoke insert, update, delete on public.user_stats from authenticated;
revoke insert, update, delete on public.user_stats from anon;

-- 5. Pure compute: apply hearts-regen + daily reset + streak decay to a row.
--    No table access — just normalizes a composite against the wall clock.
create or replace function public._economy_normalize(s public.user_stats)
returns public.user_stats
language plpgsql
volatile
as $function$
declare
  elapsed_hours int;
  gap int;
begin
  -- Hearts regenerate 1 per hour up to a cap of 5.
  if s.hearts < 5 then
    elapsed_hours := floor(extract(epoch from (now() - coalesce(s.hearts_last_regen, now()))) / 3600);
    if elapsed_hours > 0 then
      s.hearts := least(5, s.hearts + elapsed_hours);
      if s.hearts >= 5 then
        s.hearts_last_regen := now();
      else
        s.hearts_last_regen := coalesce(s.hearts_last_regen, now()) + make_interval(hours => elapsed_hours);
      end if;
    end if;
  else
    s.hearts_last_regen := now();
  end if;

  -- Today's reading minutes reset at the calendar boundary.
  if s.daily_progress_date is distinct from current_date then
    s.daily_progress_minutes := 0;
    s.daily_progress_date := current_date;
  end if;

  -- Streak decays only when a whole day is missed. A single missed day is
  -- forgiven by a streak freeze (consumed), otherwise the streak resets.
  gap := current_date - coalesce(s.last_active_date, current_date);
  if gap = 2 and s.streak_freeze_available and s.current_streak > 0 then
    s.streak_freeze_available := false;
    s.last_active_date := current_date - 1; -- preserved; still must act today to advance
  elsif gap >= 2 and s.current_streak > 0 then
    s.current_streak := 0;
  end if;

  return s;
end;
$function$;

-- 6. Persist a normalized/mutated row AND refresh the profiles mirror.
create or replace function public._economy_save(s public.user_stats)
returns void
language sql
security definer
set search_path to ''
as $function$
  update public.user_stats set
    xp_total = s.xp_total,
    coins = s.coins,
    hearts = s.hearts,
    hearts_last_regen = s.hearts_last_regen,
    current_streak = s.current_streak,
    longest_streak = s.longest_streak,
    last_active_date = s.last_active_date,
    daily_goal_minutes = s.daily_goal_minutes,
    daily_progress_minutes = s.daily_progress_minutes,
    daily_progress_date = s.daily_progress_date,
    streak_freeze_available = s.streak_freeze_available
  where user_id = s.user_id;

  update public.profiles set
    total_xp = s.xp_total,
    current_streak = s.current_streak
  where id = s.user_id;
$function$;

-- 7. Load (and lazily create) the caller's row, locked for update.
create or replace function public._economy_load()
returns public.user_stats
language plpgsql
security definer
set search_path to ''
as $function$
declare
  s public.user_stats;
begin
  if auth.uid() is null then
    raise exception 'NOT_AUTHENTICATED';
  end if;
  insert into public.user_stats (user_id) values (auth.uid()) on conflict (user_id) do nothing;
  select * into s from public.user_stats where user_id = auth.uid() for update;
  return public._economy_normalize(s);
end;
$function$;

-- 8. Mark the caller active today, advancing the streak at most once per day.
create or replace function public._economy_touch(s public.user_stats)
returns public.user_stats
language plpgsql
volatile
as $function$
begin
  if s.last_active_date is distinct from current_date then
    if current_date - coalesce(s.last_active_date, current_date - 2) = 1 then
      s.current_streak := s.current_streak + 1;
    else
      s.current_streak := 1;
    end if;
    s.last_active_date := current_date;
    s.longest_streak := greatest(s.longest_streak, s.current_streak);
  elsif s.current_streak = 0 then
    -- First-ever activity on the same calendar day the row was seeded
    -- (last_active_date defaults to today). Start the streak at 1.
    s.current_streak := 1;
    s.longest_streak := greatest(s.longest_streak, 1);
  end if;
  return s;
end;
$function$;

-- ── Public RPCs (the only client write path) ────────────────────────────────

-- Pull the authoritative, time-normalized row (hearts regen, streak decay).
create or replace function public.economy_sync()
returns public.user_stats
language plpgsql
security definer
set search_path to ''
as $function$
declare s public.user_stats;
begin
  s := public._economy_load();
  perform public._economy_save(s);
  return s;
end;
$function$;

-- Award Wisdom/coins (quiz pass, chapter/book complete, seal). Counts as
-- daily activity → advances the streak.
create or replace function public.economy_award(p_xp int default 0, p_coins int default 0)
returns public.user_stats
language plpgsql
security definer
set search_path to ''
as $function$
declare s public.user_stats;
begin
  if coalesce(p_xp, 0) < 0 or coalesce(p_coins, 0) < 0 then
    raise exception 'INVALID_AMOUNT';
  end if;
  s := public._economy_load();
  s.xp_total := s.xp_total + coalesce(p_xp, 0);
  s.coins := s.coins + coalesce(p_coins, 0);
  s := public._economy_touch(s);
  perform public._economy_save(s);
  return s;
end;
$function$;

-- Lose a heart (failed Trial answer).
create or replace function public.economy_lose_heart()
returns public.user_stats
language plpgsql
security definer
set search_path to ''
as $function$
declare s public.user_stats;
begin
  s := public._economy_load();
  if s.hearts > 0 then
    if s.hearts >= 5 then
      s.hearts_last_regen := now();
    end if;
    s.hearts := s.hearts - 1;
  end if;
  perform public._economy_save(s);
  return s;
end;
$function$;

-- Log reading minutes; meeting the daily goal advances the streak.
create or replace function public.economy_add_minutes(p_minutes int)
returns public.user_stats
language plpgsql
security definer
set search_path to ''
as $function$
declare s public.user_stats;
begin
  s := public._economy_load();
  s.daily_progress_minutes := s.daily_progress_minutes + greatest(0, coalesce(p_minutes, 0));
  if s.daily_progress_minutes >= s.daily_goal_minutes then
    s := public._economy_touch(s);
  end if;
  perform public._economy_save(s);
  return s;
end;
$function$;

-- Purchase a streak freeze for 10 coins.
create or replace function public.economy_buy_streak_freeze()
returns public.user_stats
language plpgsql
security definer
set search_path to ''
as $function$
declare s public.user_stats;
begin
  s := public._economy_load();
  if not s.streak_freeze_available and s.coins >= 10 then
    s.coins := s.coins - 10;
    s.streak_freeze_available := true;
  end if;
  perform public._economy_save(s);
  return s;
end;
$function$;

-- Consume a held streak freeze.
create or replace function public.economy_use_streak_freeze()
returns public.user_stats
language plpgsql
security definer
set search_path to ''
as $function$
declare s public.user_stats;
begin
  s := public._economy_load();
  if s.streak_freeze_available then
    s.streak_freeze_available := false;
  end if;
  perform public._economy_save(s);
  return s;
end;
$function$;

-- Refill hearts to full for 15 coins.
create or replace function public.economy_refill_hearts()
returns public.user_stats
language plpgsql
security definer
set search_path to ''
as $function$
declare s public.user_stats;
begin
  s := public._economy_load();
  if s.hearts < 5 and s.coins >= 15 then
    s.coins := s.coins - 15;
    s.hearts := 5;
    s.hearts_last_regen := now();
  end if;
  perform public._economy_save(s);
  return s;
end;
$function$;

-- Set the daily reading goal (minutes).
create or replace function public.economy_set_daily_goal(p_minutes int)
returns public.user_stats
language plpgsql
security definer
set search_path to ''
as $function$
declare s public.user_stats;
begin
  s := public._economy_load();
  s.daily_goal_minutes := greatest(1, coalesce(p_minutes, s.daily_goal_minutes));
  perform public._economy_save(s);
  return s;
end;
$function$;

grant execute on function public.economy_sync() to authenticated;
grant execute on function public.economy_award(int, int) to authenticated;
grant execute on function public.economy_lose_heart() to authenticated;
grant execute on function public.economy_add_minutes(int) to authenticated;
grant execute on function public.economy_buy_streak_freeze() to authenticated;
grant execute on function public.economy_use_streak_freeze() to authenticated;
grant execute on function public.economy_refill_hearts() to authenticated;
grant execute on function public.economy_set_daily_goal(int) to authenticated;
