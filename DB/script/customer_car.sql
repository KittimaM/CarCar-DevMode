DROP TABLE IF EXISTS `customer_car`;

CREATE TABLE IF NOT EXISTS `customer_car` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `customer_id` INT NOT NULL,
  `plate_no` VARCHAR(20) NOT NULL UNIQUE,
  `province` VARCHAR(30) NOT NULL,
  `brand` VARCHAR(25) NOT NULL,
  `model` VARCHAR(25),
  `size_id` INT NOT NULL,
  `color` VARCHAR(25) NOT NULL,
  FOREIGN KEY (customer_id) REFERENCES customer_user(id) ON DELETE CASCADE,
  FOREIGN KEY (size_id) REFERENCES car_size(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;