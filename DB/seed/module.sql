TRUNCATE TABLE `module`;

INSERT INTO `module` (`id`, `code`, `name`, `parent_id`) VALUES
(1, 'home', 'HOME', 0),
(2, 'setting', 'SETTING', 0),
(3, 'role', 'ACCESS CONFIG', 2),
(4, 'user', 'USER', 0),
(5, 'customer', 'CUSTOMER', 4),
(6, 'staff', 'STAFF', 4),
(7, 'masterData', 'MASTER DATA', 0),
(8, 'carSize', 'CAR SIZE', 7),
(9, 'customerCar', `CUSTOMER\'S CAR`, 4),
(10, 'service', 'SERVICE', 0),
(11, 'service', 'SERVICE', 7),
(12, 'channel', 'CHANNEL', 7);