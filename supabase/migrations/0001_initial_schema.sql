-- Run-It initial schema
-- Community pickup basketball platform: courts, games, live scoring, stats.
--
-- Conventions:
--   * UUID primary keys (gen_random_uuid()).
--   * created_at / updated_at timestamps on every table.
--   * Soft deletes via deleted_at where rows may need to be recoverable.
--   * Row Level Security (RLS) enabled on every table with explicit policies.
--   * score_events is APPEND-ONLY — never update/delete rows, only insert.

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
create extension if not exists "pgcrypto";
create extension if not exists "postgis";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
create type skill_level as enum ('beginner', 'intermediate', 'advanced', 'pro');
create type court_surface as enum ('asphalt', 'concrete', 'wood', 'rubber', 'other');
create type media_type as enum ('photo', 'video');
create type game_visibility as enum ('open', 'invite_only');
create type game_status as enum ('scheduled', 'active', 'completed', 'cancelled');
create type rsvp_status as enum ('going', 'maybe', 'not_going');
create type live_game_status as enum ('active', 'completed', 'cancelled');
create type score_event_type as enum ('point', 'undo', 'foul', 'timeout', 'note');

-- ---------------------------------------------------------------------------
-- profiles (extends auth.users)
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  avatar_url text,
  position text,
  skill_rating skill_level not null default 'beginner',
  home_court_id uuid,
  looking_to_play boolean not null default false,
  looking_to_play_times jsonb,
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'Public profile data for each authenticated user.';

-- ---------------------------------------------------------------------------
-- courts
-- ---------------------------------------------------------------------------
create table public.courts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  location geography(point, 4326) not null,
  address text,
  surface court_surface,
  hoop_count smallint,
  lighting boolean not null default false,
  indoor boolean not null default false,
  description text,
  source text not null default 'user_added' check (source in ('user_added', 'google_place_id')),
  external_place_id text,
  created_by uuid references public.profiles (id) on delete set null,
  verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

alter table public.profiles
  add constraint profiles_home_court_id_fkey
  foreign key (home_court_id) references public.courts (id) on delete set null;

create index courts_location_idx on public.courts using gist (location);
create index courts_created_by_idx on public.courts (created_by);

comment on table public.courts is 'Crowdsourced and imported basketball courts.';

-- ---------------------------------------------------------------------------
-- court_media
-- ---------------------------------------------------------------------------
create table public.court_media (
  id uuid primary key default gen_random_uuid(),
  court_id uuid not null references public.courts (id) on delete cascade,
  user_id uuid references public.profiles (id) on delete set null,
  url text not null,
  type media_type not null default 'photo',
  caption text,
  created_at timestamptz not null default now()
);

create index court_media_court_id_idx on public.court_media (court_id);

-- ---------------------------------------------------------------------------
-- court_reviews
-- ---------------------------------------------------------------------------
create table public.court_reviews (
  id uuid primary key default gen_random_uuid(),
  court_id uuid not null references public.courts (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  tags text[] not null default '{}',
  comment text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (court_id, user_id)
);

create index court_reviews_court_id_idx on public.court_reviews (court_id);

-- ---------------------------------------------------------------------------
-- games
-- ---------------------------------------------------------------------------
create table public.games (
  id uuid primary key default gen_random_uuid(),
  court_id uuid not null references public.courts (id) on delete cascade,
  host_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  start_time timestamptz not null,
  end_time timestamptz,
  visibility game_visibility not null default 'open',
  skill_level skill_level,
  max_players smallint not null default 10 check (max_players > 0),
  status game_status not null default 'scheduled',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index games_court_id_idx on public.games (court_id);
create index games_start_time_idx on public.games (start_time);
create index games_host_id_idx on public.games (host_id);

-- ---------------------------------------------------------------------------
-- game_rsvps
-- ---------------------------------------------------------------------------
create table public.game_rsvps (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.games (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  status rsvp_status not null default 'going',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (game_id, user_id)
);

create index game_rsvps_game_id_idx on public.game_rsvps (game_id);
create index game_rsvps_user_id_idx on public.game_rsvps (user_id);

-- ---------------------------------------------------------------------------
-- live_games
-- ---------------------------------------------------------------------------
create table public.live_games (
  id uuid primary key default gen_random_uuid(),
  court_id uuid not null references public.courts (id) on delete cascade,
  game_id uuid references public.games (id) on delete set null,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  status live_game_status not null default 'active',
  created_by uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index live_games_court_id_idx on public.live_games (court_id);
create index live_games_game_id_idx on public.live_games (game_id);

-- ---------------------------------------------------------------------------
-- live_game_teams
-- ---------------------------------------------------------------------------
create table public.live_game_teams (
  id uuid primary key default gen_random_uuid(),
  live_game_id uuid not null references public.live_games (id) on delete cascade,
  name text not null,
  color text,
  score integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index live_game_teams_live_game_id_idx on public.live_game_teams (live_game_id);

-- ---------------------------------------------------------------------------
-- live_game_team_players
-- ---------------------------------------------------------------------------
create table public.live_game_team_players (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.live_game_teams (id) on delete cascade,
  user_id uuid references public.profiles (id) on delete set null,
  guest_name text,
  jersey_number smallint,
  created_at timestamptz not null default now(),
  constraint live_game_team_players_player_source_chk
    check (user_id is not null or guest_name is not null)
);

create index live_game_team_players_team_id_idx on public.live_game_team_players (team_id);
create index live_game_team_players_user_id_idx on public.live_game_team_players (user_id);

-- ---------------------------------------------------------------------------
-- score_events (append-only)
-- ---------------------------------------------------------------------------
create table public.score_events (
  id uuid primary key default gen_random_uuid(),
  live_game_id uuid not null references public.live_games (id) on delete cascade,
  team_id uuid not null references public.live_game_teams (id) on delete cascade,
  player_id uuid references public.live_game_team_players (id) on delete set null,
  points smallint not null default 0,
  event_type score_event_type not null default 'point',
  created_by uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now()
);

create index score_events_live_game_id_idx on public.score_events (live_game_id, created_at);
create index score_events_team_id_idx on public.score_events (team_id);

comment on table public.score_events is
  'Append-only event log. Never UPDATE or DELETE rows; scores are derived by replaying events.';

-- Prevent mutation of the append-only score_events log at the database level.
create or replace function public.reject_score_event_mutation()
returns trigger
language plpgsql
as $$
begin
  raise exception 'score_events is append-only: % is not allowed', tg_op;
end;
$$;

create trigger score_events_no_update
  before update on public.score_events
  for each row execute function public.reject_score_event_mutation();

create trigger score_events_no_delete
  before delete on public.score_events
  for each row execute function public.reject_score_event_mutation();

-- ---------------------------------------------------------------------------
-- updated_at trigger helper
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.courts
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.court_reviews
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.games
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.game_rsvps
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.live_games
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.live_game_teams
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.courts enable row level security;
alter table public.court_media enable row level security;
alter table public.court_reviews enable row level security;
alter table public.games enable row level security;
alter table public.game_rsvps enable row level security;
alter table public.live_games enable row level security;
alter table public.live_game_teams enable row level security;
alter table public.live_game_team_players enable row level security;
alter table public.score_events enable row level security;

-- profiles: publicly readable, self-writable
create policy "Profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- courts: publicly readable, authenticated users can add, owners can edit
create policy "Courts are viewable by everyone"
  on public.courts for select
  using (deleted_at is null);

create policy "Authenticated users can add courts"
  on public.courts for insert
  to authenticated
  with check (auth.uid() = created_by);

create policy "Court creators can update their courts"
  on public.courts for update
  to authenticated
  using (auth.uid() = created_by)
  with check (auth.uid() = created_by);

-- court_media: publicly readable, authenticated users manage their own uploads
create policy "Court media is viewable by everyone"
  on public.court_media for select
  using (true);

create policy "Authenticated users can upload court media"
  on public.court_media for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can delete their own court media"
  on public.court_media for delete
  to authenticated
  using (auth.uid() = user_id);

-- court_reviews: publicly readable, authenticated users manage their own review
create policy "Court reviews are viewable by everyone"
  on public.court_reviews for select
  using (true);

create policy "Authenticated users can add a review"
  on public.court_reviews for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own review"
  on public.court_reviews for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own review"
  on public.court_reviews for delete
  to authenticated
  using (auth.uid() = user_id);

-- games: open games are public, invite-only games visible to host/invitees only
create policy "Open games are viewable by everyone"
  on public.games for select
  using (
    deleted_at is null
    and (
      visibility = 'open'
      or host_id = auth.uid()
      or exists (
        select 1 from public.game_rsvps r
        where r.game_id = games.id and r.user_id = auth.uid()
      )
    )
  );

create policy "Authenticated users can host a game"
  on public.games for insert
  to authenticated
  with check (auth.uid() = host_id);

create policy "Hosts can update their games"
  on public.games for update
  to authenticated
  using (auth.uid() = host_id)
  with check (auth.uid() = host_id);

-- game_rsvps: viewable by game host and participants, self-writable
create policy "RSVPs are viewable by game host and participants"
  on public.game_rsvps for select
  using (
    user_id = auth.uid()
    or exists (
      select 1 from public.games g
      where g.id = game_rsvps.game_id and g.host_id = auth.uid()
    )
  );

create policy "Authenticated users can RSVP"
  on public.game_rsvps for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own RSVP"
  on public.game_rsvps for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can cancel their own RSVP"
  on public.game_rsvps for delete
  to authenticated
  using (auth.uid() = user_id);

-- live_games / teams / players / score_events: publicly viewable (spectator
-- links), writable only by the live game's creator.
create policy "Live games are viewable by everyone"
  on public.live_games for select
  using (true);

create policy "Authenticated users can start a live game"
  on public.live_games for insert
  to authenticated
  with check (auth.uid() = created_by);

create policy "Live game creators can update their live game"
  on public.live_games for update
  to authenticated
  using (auth.uid() = created_by)
  with check (auth.uid() = created_by);

create policy "Live game teams are viewable by everyone"
  on public.live_game_teams for select
  using (true);

create policy "Live game creators can manage teams"
  on public.live_game_teams for insert
  to authenticated
  with check (
    exists (
      select 1 from public.live_games lg
      where lg.id = live_game_teams.live_game_id and lg.created_by = auth.uid()
    )
  );

create policy "Live game creators can update teams"
  on public.live_game_teams for update
  to authenticated
  using (
    exists (
      select 1 from public.live_games lg
      where lg.id = live_game_teams.live_game_id and lg.created_by = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.live_games lg
      where lg.id = live_game_teams.live_game_id and lg.created_by = auth.uid()
    )
  );

create policy "Live game creators can delete teams"
  on public.live_game_teams for delete
  to authenticated
  using (
    exists (
      select 1 from public.live_games lg
      where lg.id = live_game_teams.live_game_id and lg.created_by = auth.uid()
    )
  );

create policy "Live game team players are viewable by everyone"
  on public.live_game_team_players for select
  using (true);

create policy "Live game creators can manage team players"
  on public.live_game_team_players for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.live_game_teams t
      join public.live_games lg on lg.id = t.live_game_id
      where t.id = live_game_team_players.team_id and lg.created_by = auth.uid()
    )
  );

create policy "Live game creators can remove team players"
  on public.live_game_team_players for delete
  to authenticated
  using (
    exists (
      select 1
      from public.live_game_teams t
      join public.live_games lg on lg.id = t.live_game_id
      where t.id = live_game_team_players.team_id and lg.created_by = auth.uid()
    )
  );

create policy "Score events are viewable by everyone"
  on public.score_events for select
  using (true);

create policy "Live game creators can record score events"
  on public.score_events for insert
  to authenticated
  with check (
    auth.uid() = created_by
    and exists (
      select 1 from public.live_games lg
      where lg.id = score_events.live_game_id and lg.created_by = auth.uid()
    )
  );
