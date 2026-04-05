SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE IF NOT EXISTS `walk_in` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `branch_id` INT NOT NULL,
  `channel_id` INT NOT NULL,
  `service_car_size_id` INT NOT NULL,
  `customer_name` VARCHAR(255) NOT NULL,
  `customer_phone` VARCHAR(50) NULL,
  `car_no` VARCHAR(50) NOT NULL,
  `car_size_id` INT NOT NULL,
  `car_size` VARCHAR(50) NULL,
  `car_color` VARCHAR(50) NULL,
  `service_name` VARCHAR(255) NOT NULL COMMENT 'ชื่อบริการ (ไม่รวม prefix [Walk-in · ช่อง])',
  `service_usetime` INT NOT NULL COMMENT 'นาที',
  `service_price` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `start_service_datetime` DATETIME NOT NULL,
  `end_service_datetime` DATETIME NOT NULL,
  `branch_name` VARCHAR(100) NULL COMMENT 'สำเนาชื่อสาขาตอนบันทึก',
  `processing_status` VARCHAR(32) NOT NULL DEFAULT 'pending',
  `created_by_id` INT NULL,
  `created_by` VARCHAR(100) NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_walk_in_branch_time` (`branch_id`, `start_service_datetime`),
  KEY `idx_walk_in_channel` (`channel_id`),
  KEY `idx_walk_in_created` (`created_at`),
  KEY `idx_walk_in_status` (`processing_status`),
  CONSTRAINT `fk_walk_in_branch` FOREIGN KEY (`branch_id`) REFERENCES `branch` (`id`),
  CONSTRAINT `fk_walk_in_channel` FOREIGN KEY (`channel_id`) REFERENCES `channel` (`id`),
  CONSTRAINT `fk_walk_in_service_car_size` FOREIGN KEY (`service_car_size_id`) REFERENCES `service_car_size` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='คิว Walk-in (ไม่ใช้ตาราง booking)';

SET FOREIGN_KEY_CHECKS = 1;
