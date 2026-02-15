SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `channel_service`;

CREATE TABLE IF NOT EXISTS `channel_service` (
  `channel_id` INT NOT NULL,
  `service_id` INT NOT NULL,
  `is_available` TINYINT(1) DEFAULT 1,
  UNIQUE KEY `channel_service_unique` (`channel_id`, `service_id`),
  FOREIGN KEY (channel_id) REFERENCES channel(id),
  FOREIGN KEY (service_id) REFERENCES service(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;