DROP TABLE IF EXISTS staff_user;

CREATE TABLE staff_user (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(100) UNIQUE,
  `name` VARCHAR(100),
  `password` VARCHAR(255),
  `failed_login_count` INT DEFAULT 0,
  `is_locked` TINYINT DEFAULT 0,
  `locked_reason` VARCHAR(255),
  `role_id` INT NOT NULL,
  FOREIGN KEY (role_id) REFERENCES role(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
