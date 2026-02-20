SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `role_permission`;

CREATE TABLE IF NOT EXISTS `role_permission` (
  `role_id` INT NOT NULL,
  `module_id` INT NOT NULL,
  `permission_id` INT NOT NULL,
  FOREIGN KEY (role_id) REFERENCES role(id),
  FOREIGN KEY (module_id) REFERENCES module(id),
  FOREIGN KEY (permission_id) REFERENCES permission(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;