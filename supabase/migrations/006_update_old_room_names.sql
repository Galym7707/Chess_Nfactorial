-- Update existing rooms with ugly names to have nice random names
UPDATE rooms
SET name = (
  SELECT (ARRAY['Быстрая', 'Тихая', 'Яркая', 'Смелая', 'Мудрая', 'Дерзкая', 'Хитрая', 'Сильная', 'Ловкая', 'Грозная'])[floor(random() * 10 + 1)::int]
  || ' ' ||
  (ARRAY['Пешка', 'Ладья', 'Слон', 'Конь', 'Ферзь', 'Король', 'Партия', 'Атака', 'Защита', 'Гамбит'])[floor(random() * 10 + 1)::int]
)
WHERE name LIKE 'Комната %' AND length(name) > 20;
