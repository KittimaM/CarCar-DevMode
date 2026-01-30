DROP TABLE IF EXISTS `service`;

CREATE TABLE IF NOT EXISTS `service` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `service` VARCHAR(100) NOT NULL UNIQUE,
  `description` VARCHAR(150),
  `car_size_id` INT NOT NULL,
  `used_time` INT NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `used_people` INT NOT NULL,
  `is_available` TINYINT(1) DEFAULT 1,
  FOREIGN KEY (car_size_id) REFERENCES car_size(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;