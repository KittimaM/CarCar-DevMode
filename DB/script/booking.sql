SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `booking`;

CREATE TABLE IF NOT EXISTS `booking` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `customer_car_id` INT NOT NULL,
  `channel_id` INT NOT NULL,
  `service_id` INT NOT NULL,
  `booking_type` VARCHAR(20) NOT NULL,
  `booking_date` DATE NOT NULL,
  `start_time` TIME NOT NULL,
  `end_time` TIME NOT NULL,
  `status_id` INT NOT NULL,
  FOREIGN KEY (customer_car_id) REFERENCES customer_car(id),
  FOREIGN KEY (channel_id) REFERENCES channel(id),
  FOREIGN KEY (service_id) REFERENCES service(id),
  FOREIGN KEY (status_id) REFERENCES status(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;