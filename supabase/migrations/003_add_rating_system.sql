-- Add rating fields to games table
alter table public.games
  add column if not exists is_rated boolean default false,
  add column if not exists rating_change integer,
  add column if not exists opponent_rating integer;

-- Add rating fields to rooms table
alter table public.rooms
  add column if not exists is_rated boolean default false,
  add column if not exists white_rating integer,
  add column if not exists black_rating integer;

-- Add games_played field to profiles for K-factor calculation
alter table public.profiles
  add column if not exists games_played integer not null default 0;

-- Add comments
comment on column public.games.is_rated is 'Whether this game affects player rating';
comment on column public.games.rating_change is 'Rating change for the player (+/-)';
comment on column public.games.opponent_rating is 'Opponent rating at the time of the game';
comment on column public.rooms.is_rated is 'Whether this game affects player ratings';
comment on column public.profiles.games_played is 'Total number of rated games played (for K-factor)';
