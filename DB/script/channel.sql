SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `channel`;

CREATE TABLE IF NOT EXISTS `channel`  (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(30) NOT NULL,
  `max_capacity` INT NOT NULL,
  `is_available` TINYINT DEFAULT 1,
  `branch_id` INT NOT NULL,
  UNIQUE KEY `unique_channel_name_branch_id` (`name`, `branch_id`),
  FOREIGN KEY (branch_id) REFERENCES branch(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;