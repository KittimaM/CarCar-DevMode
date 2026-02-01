DROP TABLE IF EXISTS `service`;

CREATE TABLE IF NOT EXISTS `service` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `car_size_id` INT NOT NULL,
  `duration_minute` INT NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `required_staff` INT NOT NULL,
  `is_available` TINYINT(1) DEFAULT 1,
  FOREIGN KEY (car_size_id) REFERENCES car_size(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;