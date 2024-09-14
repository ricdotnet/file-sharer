ALTER TABLE files ADD COLUMN IF NOT EXISTS original_filename varchar(255) not null default 'NO_NAME';
