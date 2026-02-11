DROP TABLE IF EXISTS `payment_account`;

CREATE TABLE IF NOT EXISTS `payment_account` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `payment_type_id` INT NOT NULL,
  `provider` VARCHAR(50) NOT NULL,
  `account_no` VARCHAR(50) NOT NULL,
  `account_name` VARCHAR(50) NOT NULL,
  `qr_code` VARCHAR(255) NOT NULL,
  `is_available` TINYINT(1) DEFAULT 1,
  FOREIGN KEY (`payment_type_id`) REFERENCES `payment_type`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
