DROP TABLE IF EXISTS customer_user;

CREATE TABLE customer_user (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `phone` VARCHAR(100) UNIQUE,
  `name` VARCHAR(100),
  `password` VARCHAR(255),
  `failed_login_count` INT DEFAULT 0,
  `is_locked` TINYINT DEFAULT 0,
  `locked_reason` VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
