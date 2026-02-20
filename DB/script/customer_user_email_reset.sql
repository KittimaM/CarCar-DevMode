
-- Table for password reset tokens (expire after use or after 1 hour)
DROP TABLE IF EXISTS `customer_password_reset`;

CREATE TABLE `customer_password_reset` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `customer_user_id` INT NOT NULL,
  `token` VARCHAR(64) NOT NULL,
  `expires_at` DATETIME NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_reset_customer` FOREIGN KEY (`customer_user_id`) REFERENCES `customer_user` (`id`) ON DELETE CASCADE,
  INDEX `idx_token` (`token`),
  INDEX `idx_expires` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
