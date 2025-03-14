TRUNCATE TABLE `permission`;

INSERT INTO `permission` (`role_id`, `page_alias`, `access`, `add`, `edit`, `delete`, `approve`) VALUES
(1, 'schedule', 1, 1, 1, 1, 0),
(1, 'booking', 1, 0, 0, 0, 0),
(1, 'payment', 1, 0, 0, 0, 0),
(1, 'user', 1, 0, 0, 0, 0),
(1, 'staff', 1, 1, 1, 1, 0),
(1, 'customer', 1, 1, 1, 1, 0),
(1, 'customerCar', 1, 1, 1, 1, 0),
(1, 'onLeavePersonal', 1, 1, 1, 1, 0),
(1, 'dayOffList', 1, 1, 1, 1, 0),
(1, 'setting', 1, 0, 0, 0, 0),
(1, 'carSize', 1, 1, 1, 1, 0),
(1, 'service', 1, 1, 1, 1, 0),
(1, 'channel', 1, 1, 1, 1, 0),
(1, 'template', 1, 1, 1, 1, 0),
(1, 'search', 1, 1, 1, 1, 0),
(1, 'role', 1, 1, 1, 1, 0),
(1, 'account', 1, 1, 1, 1, 0),
(1, 'onLeaveList', 1, 1, 1, 1, 1),
(1, 'status', 1, 1, 1, 1, 0),
(1, 'onLeaveType', 1, 1, 1, 1, 0),
(1, 'paymentType', 1, 1, 1, 1, 0),
(1, 'advSetting', 1, 1, 1, 1, 0);
