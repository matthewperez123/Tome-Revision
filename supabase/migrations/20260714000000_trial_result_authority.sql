-- ─────────────────────────────────────────────
-- Trial result authority — close the leaderboard cheat surface
-- ─────────────────────────────────────────────
-- Before this migration a signed-in reader could INSERT arbitrary rows into
-- public.quiz_results (RLS only checked user_id = auth.uid()), and the reader
-- posted a CLIENT-computed wisdom_earned. Since classroom_wisdom_leaderboard and
-- group_trials_leaderboard both sum quiz_results.wisdom_earned, any account could
-- mint unlimited Wisdom and poison every classroom leaderboard.
--
-- Fix: make the trial write a SINGLE server-authoritative path. record_trial_result
-- computes wisdom_earned itself (tier rate × correct answers — the client can no
-- longer name the number), inserts the quiz_results row as the definer, AND awards
-- the same Wisdom/coins to user_stats through the existing economy internals so the
-- two never diverge. Direct client INSERT on quiz_results is then revoked, so the
-- RPC is the only write path.

-- Tier reward rates mirror src/lib/quiz-engine.ts WISDOM_PER_CORRECT
-- (Apprentice 5, Scholar 10, Master 15) and COIN_REWARDS.quiz_correct (1).
create or replace function public.record_trial_result(
  p_book_id       text,
  p_chapter_index int,
  p_difficulty    text,
  p_correct       int,
  p_total         int
)
returns public.user_stats
language plpgsql
security definer
set search_path to ''
as $function$
declare
  s         public.user_stats;
  v_total   int;
  v_correct int;
  v_chapter int;
  v_rate    int;
  v_wisdom  int;
  v_coins   int;
  v_score   int;
  v_passed  boolean;
begin
  if auth.uid() is null then
    raise exception 'NOT_AUTHENTICATED';
  end if;

  -- Clamp every input server-side; never trust the caller's magnitudes.
  v_total   := least(greatest(coalesce(p_total, 0), 0), 500);
  v_correct := least(greatest(coalesce(p_correct, 0), 0), v_total);
  v_chapter := greatest(coalesce(p_chapter_index, 0), 0);

  v_rate := case lower(coalesce(p_difficulty, ''))
              when 'scholar' then 10
              when 'master'  then 15
              else 5
            end;

  v_wisdom := v_correct * v_rate;
  v_coins  := v_correct;  -- COIN_REWARDS.quiz_correct = 1
  v_score  := case when v_total > 0
                   then round((v_correct::numeric / v_total) * 100)::int
                   else 0 end;
  v_passed := v_score >= 60;  -- TRIAL_PASS_THRESHOLD

  insert into public.quiz_results (
    user_id, book_id, chapter_index, difficulty,
    score, total_questions, wisdom_earned, passed
  ) values (
    auth.uid(), p_book_id, v_chapter, p_difficulty,
    v_score, v_total, v_wisdom, v_passed
  );

  -- Award the same, server-computed Wisdom/coins to the authoritative store.
  -- Counts as daily activity (advances the streak) exactly like economy_award.
  s := public._economy_load();
  s.xp_total := s.xp_total + v_wisdom;
  s.coins    := s.coins + v_coins;
  s := public._economy_touch(s);
  perform public._economy_save(s);
  return s;
end;
$function$;

-- The RPC is the only write path now. Clients can read their own rows but can
-- no longer forge them; the SECURITY DEFINER function bypasses this revoke.
revoke insert on public.quiz_results from authenticated;
revoke insert on public.quiz_results from anon;
drop policy if exists "Users can insert own quiz results" on public.quiz_results;

grant execute on function public.record_trial_result(text, int, text, int, int) to authenticated;
