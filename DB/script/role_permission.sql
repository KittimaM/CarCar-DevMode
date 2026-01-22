DROP TABLE IF EXISTS `role_permission`;

CREATE TABLE IF NOT EXISTS `role_permission` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `role_id` INT NOT NULL,
  `module_id` INT NOT NULL,
  `permission_id` INT NOT NULL,
  `is_allowed` TINYINT(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;