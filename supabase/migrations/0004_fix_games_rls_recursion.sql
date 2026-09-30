-- ---------------------------------------------------------------------------
-- Fix infinite recursion in games / game_rsvps RLS policies
-- ---------------------------------------------------------------------------
-- The original policies referenced each other directly:
--   * "Open games are viewable by everyone" (on games) subqueries
--     game_rsvps to check if the current user has RSVP'd.
--   * "RSVPs are viewable by game host and participants" (on game_rsvps)
--     subqueries games to check if the current user hosts that game.
--
-- Each subquery re-triggers RLS evaluation on the *other* table, which
-- re-triggers the original table's policy again, and so on. Postgres detects
-- this and raises `infinite recursion detected in policy for relation
-- "games"` (or "game_rsvps"), which surfaced in the app as the generic
-- "Unable to load games" error whenever a games query executed under RLS
-- (i.e. essentially always, since `select * from games` always evaluates
-- the select policy).
--
-- Fix: move the cross-table checks into `security definer` helper functions.
-- A security definer function owned by the migration role bypasses RLS on
-- the table it queries (Postgres table owners bypass RLS unless
-- `FORCE ROW LEVEL SECURITY` is set, which we do not use), so the lookup no
-- longer re-enters the caller's RLS policy and the recursion is broken. The
-- functions only ever return a boolean/aggregate, never raw rows, so no
-- additional data is exposed beyond what the original subqueries already
-- checked for.

drop policy if exists "Open games are viewable by everyone" on public.games;
drop policy if exists "RSVPs are viewable by game host and participants" on public.game_rsvps;

create or replace function public.is_game_host(_game_id uuid, _user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.games g
    where g.id = _game_id and g.host_id = _user_id
  );
$$;

create or replace function public.has_game_rsvp(_game_id uuid, _user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.game_rsvps r
    where r.game_id = _game_id and r.user_id = _user_id
  );
$$;

revoke all on function public.is_game_host(uuid, uuid) from public;
revoke all on function public.has_game_rsvp(uuid, uuid) from public;
grant execute on function public.is_game_host(uuid, uuid) to anon, authenticated;
grant execute on function public.has_game_rsvp(uuid, uuid) to anon, authenticated;

create policy "Open games are viewable by everyone"
  on public.games for select
  using (
    deleted_at is null
    and (
      visibility = 'open'
      or host_id = auth.uid()
      or public.has_game_rsvp(games.id, auth.uid())
    )
  );

create policy "RSVPs are viewable by game host and participants"
  on public.game_rsvps for select
  using (
    user_id = auth.uid()
    or public.is_game_host(game_rsvps.game_id, auth.uid())
  );

-- ---------------------------------------------------------------------------
-- Aggregate RSVP counts without a service-role key
-- ---------------------------------------------------------------------------
-- The games list only needs a "going" count per game, not the identity of
-- who RSVP'd. Because "RSVPs are viewable by game host and participants"
-- intentionally hides other participants' RSVPs from ordinary attendees, a
-- plain RLS-scoped select on game_rsvps under-counts "going" attendees for
-- games the caller doesn't host. Rather than reach for the service-role key
-- (which must never be required just to render a dashboard list), expose a
-- narrow security definer function that returns only aggregate counts.

create or replace function public.game_rsvp_counts(_game_ids uuid[])
returns table (game_id uuid, going_count bigint)
language sql
stable
security definer
set search_path = public
as $$
  select r.game_id, count(*) as going_count
  from public.game_rsvps r
  where r.game_id = any(_game_ids) and r.status = 'going'
  group by r.game_id;
$$;

revoke all on function public.game_rsvp_counts(uuid[]) from public;
grant execute on function public.game_rsvp_counts(uuid[]) to anon, authenticated;
