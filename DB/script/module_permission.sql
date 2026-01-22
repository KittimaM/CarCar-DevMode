DROP TABLE IF EXISTS `module_permission`;

CREATE TABLE IF NOT EXISTS `module_permission` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `module_id` INT,
  `permission_id` INT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;