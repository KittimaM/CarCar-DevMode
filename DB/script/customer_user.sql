SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `customer_user`;

CREATE TABLE `customer_user` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `phone` VARCHAR(20) UNIQUE DEFAULT NULL,
  `email` VARCHAR(255) UNIQUE DEFAULT NULL,
  `line_id` VARCHAR(50) UNIQUE DEFAULT NULL,
  `name` VARCHAR(100),
  `password` VARCHAR(255),
  `failed_login_count` INT DEFAULT 0,
  `is_locked` TINYINT DEFAULT 0,
  `locked_reason` VARCHAR(255),

  CONSTRAINT chk_phone_or_line_id
  CHECK (phone IS NOT NULL OR line_id IS NOT NULL)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;
