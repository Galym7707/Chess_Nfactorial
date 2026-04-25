create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Code Gambit Player',
  city text not null default 'Алматы',
  preferred_theme text not null default 'system' check (preferred_theme in ('system', 'light', 'dark')),
  board_theme text not null default 'midnight' check (board_theme in ('classic', 'midnight', 'neon', 'paper')),
  is_pro boolean not null default false,
  rating integer not null default 1200,
  wins integer not null default 0,
  losses integer not null default 0,
  draws integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.games (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  mode text not null check (mode in ('local', 'ai', 'friend')),
  result text not null default '*' check (result in ('1-0', '0-1', '1/2-1/2', '*')),
  pgn text not null,
  fen text not null,
  moves jsonb not null default '[]'::jsonb,
  opponent text not null default 'Unknown',
  summary text not null default '',
  duration_seconds integer not null default 0,
  completed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.game_moves (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.games(id) on delete cascade,
  ply integer not null,
  san text not null,
  fen_after text not null,
  created_at timestamptz not null default now(),
  unique (game_id, ply)
);

create table if not exists public.rooms (
  id uuid primary key default gen_random_uuid(),
  host_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'waiting' check (status in ('waiting', 'active', 'finished', 'abandoned')),
  current_fen text not null,
  pgn text not null default '',
  moves jsonb not null default '[]'::jsonb,
  version integer not null default 0,
  white_player_id uuid references public.profiles(id) on delete set null,
  black_player_id uuid references public.profiles(id) on delete set null,
  result text not null default '*' check (result in ('1-0', '0-1', '1/2-1/2', '*')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.room_players (
  room_id uuid not null references public.rooms(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  color text not null check (color in ('white', 'black', 'spectator')),
  online_at timestamptz not null default now(),
  joined_at timestamptz not null default now(),
  primary key (room_id, user_id)
);

create table if not exists public.coach_reports (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.games(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  quality_score integer not null check (quality_score between 1 and 100),
  summary text not null,
  issues jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  unique (game_id, user_id)
);

create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text,
  status text not null,
  product text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.user_inventory (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  item_key text not null,
  item_type text not null,
  granted_at timestamptz not null default now(),
  unique (user_id, item_key)
);

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at before update on public.profiles for each row execute function public.touch_updated_at();

drop trigger if exists rooms_touch_updated_at on public.rooms;
create trigger rooms_touch_updated_at before update on public.rooms for each row execute function public.touch_updated_at();

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name, city)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1), 'Code Gambit Player'), 'Алматы')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.games enable row level security;
alter table public.game_moves enable row level security;
alter table public.rooms enable row level security;
alter table public.room_players enable row level security;
alter table public.coach_reports enable row level security;
alter table public.purchases enable row level security;
alter table public.user_inventory enable row level security;

create policy "profiles public leaderboard read" on public.profiles for select using (true);
create policy "profiles insert own" on public.profiles for insert with check ((select auth.uid()) = id);
create policy "profiles update own" on public.profiles for update using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

create policy "games read own" on public.games for select using ((select auth.uid()) = user_id);
create policy "games insert own" on public.games for insert with check ((select auth.uid()) = user_id);
create policy "games update own" on public.games for update using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create policy "game_moves read own games" on public.game_moves for select using (exists (select 1 from public.games g where g.id = game_id and g.user_id = (select auth.uid())));
create policy "game_moves insert own games" on public.game_moves for insert with check (exists (select 1 from public.games g where g.id = game_id and g.user_id = (select auth.uid())));

create policy "rooms authenticated read by invite" on public.rooms for select using ((select auth.uid()) is not null);
create policy "rooms insert own" on public.rooms for insert with check ((select auth.uid()) = host_id and (white_player_id is null or white_player_id = (select auth.uid())));
create policy "rooms update players" on public.rooms for update using ((select auth.uid()) in (host_id, white_player_id, black_player_id)) with check ((select auth.uid()) in (host_id, white_player_id, black_player_id));

create policy "room_players read authenticated" on public.room_players for select using ((select auth.uid()) is not null);
create policy "room_players insert self" on public.room_players for insert with check ((select auth.uid()) = user_id);
create policy "room_players update self" on public.room_players for update using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create policy "coach reports read own" on public.coach_reports for select using ((select auth.uid()) = user_id);
create policy "coach reports insert own" on public.coach_reports for insert with check ((select auth.uid()) = user_id);
create policy "coach reports update own" on public.coach_reports for update using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create policy "purchases read own" on public.purchases for select using ((select auth.uid()) = user_id);
create policy "inventory read own" on public.user_inventory for select using ((select auth.uid()) = user_id);

create index if not exists games_user_completed_idx on public.games(user_id, completed_at desc);
create index if not exists rooms_status_idx on public.rooms(status, updated_at desc);
create index if not exists profiles_city_rating_idx on public.profiles(city, rating desc);

-- Realtime for multiplayer rooms. Supabase projects normally include this publication.
do $$
begin
  alter publication supabase_realtime add table public.rooms;
exception when duplicate_object then null;
exception when undefined_object then null;
end $$;