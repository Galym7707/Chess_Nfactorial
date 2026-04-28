-- ============================================
-- ПОЛНАЯ МИГРАЦИЯ ДЛЯ SUPABASE
-- Выполни этот файл в Supabase Dashboard → SQL Editor
-- ============================================

-- Миграция 002: Добавить поля контроля времени
ALTER TABLE public.rooms
  ADD COLUMN IF NOT EXISTS time_control TEXT,
  ADD COLUMN IF NOT EXISTS initial_time_seconds INTEGER,
  ADD COLUMN IF NOT EXISTS increment_seconds INTEGER,
  ADD COLUMN IF NOT EXISTS white_time_remaining_ms INTEGER,
  ADD COLUMN IF NOT EXISTS black_time_remaining_ms INTEGER,
  ADD COLUMN IF NOT EXISTS last_move_at TIMESTAMPTZ;

ALTER TABLE public.games
  ADD COLUMN IF NOT EXISTS time_control TEXT,
  ADD COLUMN IF NOT EXISTS initial_time_seconds INTEGER,
  ADD COLUMN IF NOT EXISTS increment_seconds INTEGER;

COMMENT ON COLUMN public.games.time_control IS 'Time control format like "3+0", "10+5", etc.';
COMMENT ON COLUMN public.rooms.time_control IS 'Time control format like "3+0", "10+5", etc.';

-- Миграция 003: Добавить рейтинговую систему
ALTER TABLE public.rooms
  ADD COLUMN IF NOT EXISTS is_rated BOOLEAN,
  ADD COLUMN IF NOT EXISTS white_rating INTEGER,
  ADD COLUMN IF NOT EXISTS black_rating INTEGER;

ALTER TABLE public.games
  ADD COLUMN IF NOT EXISTS is_rated BOOLEAN,
  ADD COLUMN IF NOT EXISTS rating_change INTEGER,
  ADD COLUMN IF NOT EXISTS opponent_rating INTEGER;

-- Миграция 004: Добавить название комнаты
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS name TEXT;

-- Установить временные названия для существующих комнат
UPDATE rooms SET name = 'Комната ' || SUBSTRING(id::text, 1, 8) WHERE name IS NULL;

-- Миграция 005: Сделать name nullable и добавить функцию генерации
ALTER TABLE rooms ALTER COLUMN name DROP NOT NULL;

-- Создать функцию генерации случайных названий
CREATE OR REPLACE FUNCTION generate_room_name()
RETURNS TEXT AS $$
DECLARE
  adjectives TEXT[] := ARRAY['Быстрая', 'Тихая', 'Яркая', 'Смелая', 'Мудрая', 'Дерзкая', 'Хитрая', 'Сильная', 'Ловкая', 'Грозная'];
  nouns TEXT[] := ARRAY['Пешка', 'Ладья', 'Слон', 'Конь', 'Ферзь', 'Король', 'Партия', 'Атака', 'Защита', 'Гамбит'];
BEGIN
  RETURN adjectives[1 + floor(random() * 10)::int] || ' ' || nouns[1 + floor(random() * 10)::int];
END;
$$ LANGUAGE plpgsql;

-- Установить функцию как значение по умолчанию
ALTER TABLE rooms ALTER COLUMN name SET DEFAULT generate_room_name();

-- Миграция 006: Обновить старые названия комнат
UPDATE rooms
SET name = (
  SELECT (ARRAY['Быстрая', 'Тихая', 'Яркая', 'Смелая', 'Мудрая', 'Дерзкая', 'Хитрая', 'Сильная', 'Ловкая', 'Грозная'])[floor(random() * 10 + 1)::int]
  || ' ' ||
  (ARRAY['Пешка', 'Ладья', 'Слон', 'Конь', 'Ферзь', 'Король', 'Партия', 'Атака', 'Защита', 'Гамбит'])[floor(random() * 10 + 1)::int]
)
WHERE name IS NULL OR (name LIKE 'Комната %' AND length(name) > 20);

-- Готово! Теперь все миграции применены.
