DROP TABLE IF EXISTS `status`;

CREATE TABLE IF NOT EXISTS `status` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `code` VARCHAR(20) NOT NULL,
  `status_group_id` INT NOT NULL,
  UNIQUE KEY `uniq_status_code_group` (`code`, `status_group_id`),
  FOREIGN KEY (`status_group_id`) REFERENCES `status_group`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
