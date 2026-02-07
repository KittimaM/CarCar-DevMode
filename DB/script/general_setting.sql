DROP TABLE IF EXISTS `general_setting`;

CREATE TABLE IF NOT EXISTS `general_setting`  (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `staff_failed_login_limit` INT NOT NULL,
  `customer_failed_login_limit` INT NOT NULL,
  `staff_user_login_mins_limit` INT NOT NULL,
  `customer_user_login_mins_limit` INT NOT NULL,
  `staff_inactive_limit` INT NOT NULL,
  `customer_inactive_limit` INT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
