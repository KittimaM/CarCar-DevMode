DROP TABLE IF EXISTS `module_permission`;

CREATE TABLE IF NOT EXISTS `module_permission` (
  `module_id` INT NOT NULL,
  `permission_id` INT NOT NULL,
  FOREIGN KEY (module_id) REFERENCES module(id),
  FOREIGN KEY (permission_id) REFERENCES permission(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;