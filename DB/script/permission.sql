DROP TABLE IF EXISTS `permission`;

CREATE TABLE IF NOT EXISTS `permission` (
  `id` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `role_name` VARCHAR(50) NOT NULL,
  `page_alias` VARCHAR(50) NOT NULL,
  `access` TINYINT(1) NOT NULL DEFAULT 0,
  `add` TINYINT(1) NOT NULL DEFAULT 0,
  `edit` TINYINT(1) NOT NULL DEFAULT 0,
  `delete` TINYINT(1) NOT NULL DEFAULT 0,
  `approve` TINYINT(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- add role_id and make it FK
