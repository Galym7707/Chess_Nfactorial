-- Add name column to rooms table
ALTER TABLE rooms ADD COLUMN name TEXT;

-- Set default names for existing rooms
UPDATE rooms SET name = 'Комната ' || SUBSTRING(id::text, 1, 8) WHERE name IS NULL;

-- Make name NOT NULL after setting defaults
ALTER TABLE rooms ALTER COLUMN name SET NOT NULL;
