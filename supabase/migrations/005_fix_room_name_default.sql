-- Make name column nullable and add default value
ALTER TABLE rooms ALTER COLUMN name DROP NOT NULL;
ALTER TABLE rooms ALTER COLUMN name SET DEFAULT 'Новая комната';
