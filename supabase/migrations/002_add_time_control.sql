-- Add time control fields to games table
alter table public.games
  add column if not exists time_control text,
  add column if not exists initial_time_seconds integer,
  add column if not exists increment_seconds integer;

-- Add time control fields to rooms table
alter table public.rooms
  add column if not exists time_control text,
  add column if not exists initial_time_seconds integer,
  add column if not exists increment_seconds integer,
  add column if not exists white_time_remaining_ms integer,
  add column if not exists black_time_remaining_ms integer,
  add column if not exists last_move_at timestamptz;

-- Add comment
comment on column public.games.time_control is 'Time control format like "3+0", "10+5", etc.';
comment on column public.rooms.time_control is 'Time control format like "3+0", "10+5", etc.';
