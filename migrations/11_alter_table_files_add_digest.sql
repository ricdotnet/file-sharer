ALTER TABLE files ADD COLUMN `digest` VARCHAR(16) NOT NULL DEFAULT '';
UPDATE files SET `digest` = LEFT(MD5(RAND()), 16) WHERE `digest` IS NULL OR `digest` = '';