SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `booking`;

CREATE TABLE IF NOT EXISTS `booking` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `booking_no` VARCHAR(50) UNIQUE,
  `customer_car_id` INT NOT NULL,
  `channel_id` INT NOT NULL,
  `service_car_size_id` INT NOT NULL,
  `booking_date` DATE NOT NULL,
  `start_time` TIME NOT NULL,
  `end_time` TIME NOT NULL,
  `price_snapshot` DECIMAL(10,2),
  `duration_snapshot` INT,
  `status_id` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_car_id) REFERENCES customer_car(id),
  FOREIGN KEY (channel_id) REFERENCES channel(id),
  FOREIGN KEY (service_car_size_id) REFERENCES service_car_size(id),
  FOREIGN KEY (status_id) REFERENCES status(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;