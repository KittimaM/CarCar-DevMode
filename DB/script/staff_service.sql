DROP TABLE IF EXISTS `staff_service`;

CREATE TABLE IF NOT EXISTS `staff_service` (
  `staff_id` INT NOT NULL,
  `service_id` INT NOT NULL,
  FOREIGN KEY (staff_id) REFERENCES staff_user(id),
  FOREIGN KEY (service_id) REFERENCES service(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;