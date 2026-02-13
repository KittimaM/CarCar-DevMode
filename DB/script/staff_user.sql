SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `staff_user`;

CREATE TABLE IF NOT EXISTS `staff_user`  (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(100) UNIQUE,
  `name` VARCHAR(100),
  `password` VARCHAR(255),
  `failed_login_count` INT DEFAULT 0,
  `is_locked` TINYINT DEFAULT 0,
  `locked_reason` VARCHAR(255),
  `role_id` INT NOT NULL,
  `branch_id` INT NOT NULL,
  `is_system_id` TINYINT DEFAULT 0,
  FOREIGN KEY (role_id) REFERENCES role(id),
  FOREIGN KEY (branch_id) REFERENCES branch(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;
