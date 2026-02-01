DROP TABLE IF EXISTS `booking`;

CREATE TABLE IF NOT EXISTS `booking` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `customer_car_id` INT NOT NULL,
  `channel_id` INT NOT NULL,
  `service_id` INT NOT NULL,
  `booking_type` ENUM('booking', 'walk-in') NOT NULL,
  `booking_date` DATE NOT NULL,
  `start_time` TIME NOT NULL,
  `end_time` TIME NOT NULL,
  `status_id` INT NOT NULL,
  FOREIGN KEY (customer_car_id) REFERENCES customer_car(id),
  FOREIGN KEY (channel_id) REFERENCES channel_service(channel_id),
  FOREIGN KEY (service_id) REFERENCES channel_service(service_id),
  FOREIGN KEY (status_id) REFERENCES status(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;