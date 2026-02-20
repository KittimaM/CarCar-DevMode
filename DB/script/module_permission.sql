SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `module_permission`;

CREATE TABLE IF NOT EXISTS `module_permission` (
  `module_id` INT NOT NULL,
  `permission_id` INT NOT NULL,
  UNIQUE KEY `module_permission_unique` (`module_id`, `permission_id`),
  FOREIGN KEY (module_id) REFERENCES module(id),
  FOREIGN KEY (permission_id) REFERENCES permission(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;