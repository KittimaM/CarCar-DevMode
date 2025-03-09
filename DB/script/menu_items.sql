DROP TABLE IF EXISTS `menu_items`;

CREATE TABLE IF NOT EXISTS `menu_items` (
  `id` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(50) NOT NULL,
  `icon` VARCHAR(50) DEFAULT NULL,
  `parent_alias` VARCHAR(50) DEFAULT NULL, -- easy to make seed, no need to count for id number
  `alias` VARCHAR(30) NOT NULL,
  INDEX `idx_parent_alias` (`parent_alias`) -- Add index for faster search
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- change back to use parent_id