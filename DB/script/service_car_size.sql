SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `service_car_size`;

CREATE TABLE IF NOT EXISTS `service_car_size` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `service_id` INT NOT NULL,
  `car_size_id` INT NOT NULL,
  `duration_minute` INT NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `required_staff` INT NOT NULL,
  `is_available` TINYINT(1) DEFAULT 1,
  FOREIGN KEY (service_id) REFERENCES service(id),
  FOREIGN KEY (car_size_id) REFERENCES car_size(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;