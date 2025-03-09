TRUNCATE TABLE `menu_items`;

INSERT INTO `menu_items` (`name`, `icon`, `parent_alias`, `alias`, `role`) VALUES
('Home', 'ri-home-line', NULL, 'home', NULL),
('Schedule page | ตารางงาน', 'ri-calendar-line', NULL, 'schedule', 'have_schedule_access'),
('Booking', 'ri-user-line', NULL, 'booking', 'have_booking_access'),
('Payment History | ประวัติการชําระเงิน', NULL, NULL, 'payment', 'have_payment_access'),
('User', 'ri-calendar-line', NULL, 'user', 'have_user_access'),
('Staff', NULL, 'user', 'staff', 'have_staff_access'),
('Customer', NULL, 'user', 'customer', 'have_customer_access'),
('Customer car', NULL, 'user', 'customerCar', 'have_customer_access'),
('Onleave Personal', NULL, NULL, 'onLeavePersonal', 'have_on_leave_personal_access'),
('DayOff List', NULL, NULL, 'dayOffList', 'have_day_off_list_access'),
('Setting', NULL, NULL, 'setting', 'have_general_setting'),
('Car size', 'ri-user-line', 'setting', 'carSize', 'have_car_size_access'),
('Service', 'ri-settings-2-line', 'setting', 'service', 'have_service_access'),
('Channel', 'ri-user-line', 'setting', 'channel', 'have_channel_access'),
('Template', NULL, 'setting', 'template', 'have_template_access'),
('Search', NULL, 'setting', 'search', 'have_search_access'),
('Role', 'ri-logout-box-line', 'setting', 'role', 'have_role_access'),
('Account', NULL, 'setting', 'account', 'have_account_access'),
('Onleave List', 'ri-logout-box-line', 'setting', 'onLeaveList', 'have_on_leave_list_access'),
('Status', 'ri-user-line', 'setting', 'status', 'have_status_access'),
('Onleave Type', NULL, 'setting', 'onLeaveType', 'have_on_leave_type_access'),
('Payment Type', NULL, 'setting', 'paymentType', 'have_payment_type_access'),
('Advance Setting', NULL, 'setting', 'advSetting', 'have_general_setting');
