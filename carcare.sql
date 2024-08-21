-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 21, 2024 at 08:27 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `carcare`
--

-- --------------------------------------------------------

--
-- Table structure for table `account`
--

CREATE TABLE `account` (
  `id` int(11) NOT NULL,
  `label` varchar(255) NOT NULL,
  `income` int(11) DEFAULT NULL,
  `expense` int(11) DEFAULT NULL,
  `is_expense` tinyint(4) DEFAULT 0,
  `is_income` tinyint(4) DEFAULT 0,
  `date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `account`
--

INSERT INTO `account` (`id`, `label`, `income`, `expense`, `is_expense`, `is_income`, `date`) VALUES
(6, 'testchangecar_no', 100, 0, 0, 1, '2024-02-04'),
(7, 'testexpense', 0, 20, 1, 0, '2024-02-04'),
(8, 'admin', 0, 300, 1, 0, '2024-02-04'),
(9, 'admin', 300, 0, 0, 1, '2024-06-02'),
(10, 'newcar', 50, 0, 0, 1, '2024-06-02'),
(11, 'testchangecar_no', 0, 0, 0, 1, '2024-06-02'),
(12, 'testchangecar_no', 200, 0, 0, 1, '2024-06-02');

-- --------------------------------------------------------

--
-- Table structure for table `admin_role_label`
--

CREATE TABLE `admin_role_label` (
  `id` int(11) NOT NULL,
  `role` varchar(100) NOT NULL,
  `label` varchar(100) NOT NULL,
  `module_level` int(11) NOT NULL DEFAULT 1,
  `header_module_id` int(11) NOT NULL DEFAULT 0,
  `is_have_sub_role` tinyint(4) NOT NULL DEFAULT 0,
  `data_value` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin_role_label`
--

INSERT INTO `admin_role_label` (`id`, `role`, `label`, `module_level`, `header_module_id`, `is_have_sub_role`, `data_value`) VALUES
(1, 'have_staff_access', 'staff', 2, 19, 0, 'staff'),
(2, 'have_car_size_access', 'car size', 1, 0, 0, 'carSize'),
(3, 'have_service_access', 'service', 1, 0, 0, 'service'),
(4, 'have_booking_access', 'booking', 1, 0, 0, 'booking'),
(5, 'have_role_access', 'role', 1, 0, 0, 'role'),
(6, 'have_account_access', 'account', 1, 0, 0, 'account'),
(7, 'have_schedule_access', 'schedule', 1, 0, 0, 'schedule'),
(8, 'have_payment_access', 'payment', 1, 0, 0, 'payment'),
(9, 'have_payment_type_access', 'payment type', 2, 18, 0, 'paymentType'),
(10, 'have_on_leave_list_access', 'onleave list', 1, 0, 0, 'onLeaveList'),
(12, 'have_on_leave_personal_access', 'onleave personal', 1, 0, 0, 'onLeavePersonal'),
(13, 'have_day_off_list_access', 'dayoff list', 1, 0, 0, 'dayOffList'),
(14, 'have_on_leave_type_access', 'onleave type', 2, 18, 0, 'onLeaveType'),
(15, 'have_channel_access', 'channel', 1, 0, 0, 'channel'),
(16, 'have_status_access', 'status', 1, 0, 0, 'status'),
(17, 'have_customer_access', 'customer', 2, 19, 0, 'customer'),
(18, 'have_master_table_access', 'master table', 1, 0, 1, 'masterTable'),
(19, 'have_user_access', 'user', 1, 0, 1, 'user'),
(20, 'have_template_access', 'template', 1, 0, 0, 'template'),
(21, 'have_search_access', 'Search', 1, 0, 0, 'search');

-- --------------------------------------------------------

--
-- Table structure for table `booking`
--

CREATE TABLE `booking` (
  `id` int(11) NOT NULL,
  `car_no` varchar(255) DEFAULT NULL,
  `car_size_id` int(11) DEFAULT NULL,
  `car_size` varchar(255) DEFAULT NULL,
  `car_color` varchar(255) DEFAULT NULL,
  `customer_phone` varchar(255) DEFAULT NULL,
  `customer_name` varchar(255) DEFAULT NULL,
  `service` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`service`)),
  `service_usetime` int(11) DEFAULT NULL,
  `start_service_datetime` datetime DEFAULT NULL,
  `end_service_datetime` datetime DEFAULT NULL,
  `payment_type_id` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `created_by_id` varchar(255) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `processing_status` varchar(255) DEFAULT 'Waiting',
  `service_price` int(11) DEFAULT NULL,
  `customer_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `booking`
--

INSERT INTO `booking` (`id`, `car_no`, `car_size_id`, `car_size`, `car_color`, `customer_phone`, `customer_name`, `service`, `service_usetime`, `start_service_datetime`, `end_service_datetime`, `payment_type_id`, `created_at`, `created_by_id`, `created_by`, `processing_status`, `service_price`, `customer_id`) VALUES
(169, 'admin', 12, 'super car', 'admin', 'admin', 'admin', '[9, 10]', 90, '2024-02-04 12:30:00', '2024-02-04 14:00:00', 1, '2024-02-04 05:13:05', '6', 'admin', 'Paid', 300, 0),
(170, 'newcar', 13, 's', 'pink', '000', '000', '[11]', 30, '2024-02-28 08:00:00', '2024-02-28 08:30:00', 1, '2024-02-27 13:59:09', '000', '000', 'Paid', 50, 0),
(171, 'testchangecar_no', 12, 'super car', '000_car_color', '000', '000', '[]', 0, '2024-02-28 08:30:00', '2024-02-28 08:30:00', 1, '2024-02-27 14:30:31', '000', '000', 'Paid', 0, 0),
(172, 'testchangecar_no', 12, 'super car', '000_car_color', '000', '000', '[10]', 60, '2024-02-28 17:00:00', '2024-02-28 18:00:00', 1, '2024-02-27 14:31:12', '000', '000', 'Paid', 200, 0),
(182, '1กข990', 12, 'super car', 'silver', '000', '000', '[9, 10]', 90, '2024-04-06 16:30:00', '2024-04-06 18:00:00', NULL, '2024-04-05 16:18:24', NULL, NULL, '', 300, 0),
(183, '1กข990', 12, 'super car', 'silver', '000', '000', '[9, 10]', 90, '2024-04-06 16:30:00', '2024-04-06 18:00:00', 1, '2024-04-05 16:19:24', NULL, NULL, '', 300, 0),
(184, '1กข990', 12, 'super car', 'silver', '000', '000', '[9, 10]', 90, '2024-04-06 16:30:00', '2024-04-06 18:00:00', 1, '2024-04-05 16:20:11', '1', '000', '', 300, 0),
(185, '1กข990', 12, 'super car', 'silver', '000', '000', '[9, 10]', 90, '2024-04-06 08:00:00', '2024-04-06 09:30:00', 3, '2024-04-05 16:21:18', '1', '000', '', 300, 0),
(186, '1กข990', 12, 'super car', 'silver', '000', 'name surname', '[9]', 30, '2024-04-10 14:30:00', '2024-04-10 15:00:00', 1, '2024-04-09 16:01:58', '1', 'name surname', '', 100, 0);

-- --------------------------------------------------------

--
-- Table structure for table `car_size`
--

CREATE TABLE `car_size` (
  `id` int(11) NOT NULL,
  `size` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `is_available` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `car_size`
--

INSERT INTO `car_size` (`id`, `size`, `description`, `is_available`) VALUES
(86, ' mini car', '2 seats', 1),
(87, 'normal car', '4 wheels', 1),
(101, 'mini car', '', 1),
(105, 'mini car1', '', 1);

-- --------------------------------------------------------

--
-- Table structure for table `channel`
--

CREATE TABLE `channel` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `is_available` tinyint(1) DEFAULT 0,
  `description` varchar(120) DEFAULT NULL,
  `service` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `channel`
--

INSERT INTO `channel` (`id`, `name`, `is_available`, `description`, `service`) VALUES
(16, 'channel1', 1, '', '14,15'),
(18, 'channel2', 1, '', '14,15');

-- --------------------------------------------------------

--
-- Table structure for table `customer`
--

CREATE TABLE `customer` (
  `id` int(11) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `name` varchar(50) NOT NULL,
  `password` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customer`
--

INSERT INTO `customer` (`id`, `phone`, `name`, `password`) VALUES
(1, '000', 'name surname', '$2b$10$OLc9DX1quiDIJJieDklyqO.tQVA3AcTqxiMhLRZP2bS7AFG5cDFnG'),
(6, '111', '111', '$2b$10$DyvBknbhozFHEhgAYlL7g.naUXbuUGfyJAl1iaaL97u/Q.P0EeAQ.'),
(8, '222', '222', '$2b$10$ctAa4KFdPZh4Zhv9PrY4ze/hIKdkV6VvWe3kuTHKcwWLYNN6bWn3O');

-- --------------------------------------------------------

--
-- Table structure for table `customer_car`
--

CREATE TABLE `customer_car` (
  `id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `plate_no` varchar(20) NOT NULL,
  `prefix` varchar(10) NOT NULL,
  `postfix` varchar(10) NOT NULL,
  `province` varchar(30) NOT NULL,
  `brand` varchar(25) NOT NULL,
  `model` varchar(25) NOT NULL,
  `size_id` int(11) NOT NULL,
  `color` varchar(25) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customer_car`
--

INSERT INTO `customer_car` (`id`, `customer_id`, `plate_no`, `prefix`, `postfix`, `province`, `brand`, `model`, `size_id`, `color`, `created_at`, `updated_at`, `deleted_at`) VALUES
(23, 1, 'abc1234', 'abc', '1234', 'สมุทรปราการ', 'aespa', 'kwangya', 86, 'black mamba', '2024-06-05 11:58:35', NULL, NULL),
(24, 6, 'รกจ980', 'รกจ', '980', 'กรุงเทพมหานคร', 'yamaha', 'series 1', 86, 'test', '2024-08-21 06:25:20', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `day_off`
--

CREATE TABLE `day_off` (
  `staff_id` int(11) NOT NULL,
  `day_off` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `day_off`
--

INSERT INTO `day_off` (`staff_id`, `day_off`) VALUES
(6, 'Friday'),
(16, 'Sunday'),
(17, 'Sunday'),
(18, 'Thursday'),
(19, 'Saturday'),
(20, 'Sunday'),
(21, 'Friday'),
(30, 'Sunday');

-- --------------------------------------------------------

--
-- Table structure for table `on_leave`
--

CREATE TABLE `on_leave` (
  `id` int(11) NOT NULL,
  `staff_id` int(11) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `reason` varchar(255) NOT NULL,
  `is_approved` tinyint(1) DEFAULT 0,
  `approved_by_id` int(11) DEFAULT NULL,
  `on_leave_type_id` int(11) NOT NULL,
  `number_of_days` int(11) NOT NULL,
  `remain_days` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `on_leave`
--

INSERT INTO `on_leave` (`id`, `staff_id`, `start_date`, `end_date`, `reason`, `is_approved`, `approved_by_id`, `on_leave_type_id`, `number_of_days`, `remain_days`) VALUES
(47, 6, '2024-06-01', '2024-06-30', 'test', 1, 6, 14, 30, 0),
(48, 16, '2024-06-01', '2024-06-30', 'test', 1, 6, 14, 30, 0),
(49, 17, '2024-06-22', '2024-06-25', 'test', 1, 6, 15, 4, 3),
(50, 17, '2024-06-18', '2024-06-20', 'test', 1, 6, 14, 3, 4),
(51, 6, '2024-06-01', '2024-06-01', 'test', 0, NULL, 15, 1, 6),
(52, 6, '2024-06-07', '2024-06-08', 'test', 0, NULL, 15, 2, 5);

-- --------------------------------------------------------

--
-- Table structure for table `on_leave_type`
--

CREATE TABLE `on_leave_type` (
  `id` int(11) NOT NULL,
  `type` varchar(255) NOT NULL,
  `day_limit` int(11) DEFAULT 0,
  `is_available` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `on_leave_type`
--

INSERT INTO `on_leave_type` (`id`, `type`, `day_limit`, `is_available`) VALUES
(14, 'sick leave', 30, 1),
(15, 'privacy leave', 7, 1);

-- --------------------------------------------------------

--
-- Table structure for table `payment_type`
--

CREATE TABLE `payment_type` (
  `id` int(11) NOT NULL,
  `type` varchar(120) NOT NULL,
  `is_available` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payment_type`
--

INSERT INTO `payment_type` (`id`, `type`, `is_available`) VALUES
(7, 'cash', 1);

-- --------------------------------------------------------

--
-- Table structure for table `province`
--

CREATE TABLE `province` (
  `id` int(11) NOT NULL,
  `province` varchar(30) NOT NULL,
  `region` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `province`
--

INSERT INTO `province` (`id`, `province`, `region`) VALUES
(1, 'กรุงเทพมหานคร', 'กลาง'),
(2, 'นนทบุรี', 'กลาง'),
(3, 'นครปฐม', 'กลาง'),
(4, 'สมุทรสาคร', 'กลาง'),
(5, 'สมุทรปราการ', 'กลาง'),
(6, 'ชลบุรี', 'ตะวันออก'),
(7, 'ราชบุรี', 'ตะวันตก'),
(8, 'ระยอง', 'ตะวันออก'),
(9, 'ระนอง', 'ใต้'),
(10, 'ยะลา', 'ใต้'),
(11, 'เชียงใหม่', 'เหนือ'),
(12, 'เชียงราย', 'เหนือ'),
(13, 'แม่ฮ่องสอน', 'เหนือ'),
(14, 'ลำปาง', 'เหนือ'),
(15, 'ตราด', 'ตะวันออก'),
(16, 'ตาก', 'ตะวันตก'),
(17, 'น่าน', 'เหนือ'),
(18, 'พะเยา', 'เหนือ'),
(19, 'นครสวรรค์', 'กลาง'),
(20, 'นครนายก', 'กลาง'),
(21, 'นครราชศรีมา', 'อีสาน'),
(22, 'อุบลราชธานี', 'อีสาน'),
(23, 'อุดรธานี', 'อีสาน'),
(24, 'ขอนแก่น', 'อีสาน'),
(25, 'สระแก้ว', 'ตะวันออก'),
(26, 'จันทบุรี', 'ตะวันออก'),
(27, 'ปราจีนบุรี', 'ตะวันออก'),
(28, 'ฉะเชิงเทรา', 'ตะวันออก'),
(29, 'แพร่', 'เหนือ'),
(30, 'ประจวบคีรีขันธ์', 'ตะวันตก'),
(31, 'ศรีสะเกษ', 'อีสาน'),
(32, 'ลำพูน', 'เหนือ'),
(33, 'สงขลา', 'ใต้'),
(34, 'เลย', 'อีสาน'),
(35, 'นราธิวาส', 'ใต้'),
(36, 'กาญจนบุรี', 'ตะวันตก'),
(37, 'สิงห์บุรี', 'กลาง'),
(38, 'พระนครศรีอยุธยา', 'กลาง'),
(39, 'ชัยนาท', 'กลาง'),
(40, 'สุราษฎร์ธานี', 'ใต้'),
(41, 'ชัยภูมิ', 'อีสาน'),
(42, 'เพชรบูรณ์', 'กลาง'),
(43, 'พิษณุโลก', 'กลาง'),
(44, 'บุรีรัมย์', 'อีสาน'),
(45, 'นครศรีธรรมราช', 'ใต้'),
(46, 'สกลนคร', 'อีสาน'),
(47, 'กำแพงเพชร', 'กลาง'),
(48, 'ร้อยเอ็ด', 'อีสาน'),
(49, 'สุรินทร์', 'อีสาน'),
(50, 'อุตรดิตถ์', 'เหนือ'),
(51, 'กาฬสินธุ์', 'อีสาน'),
(52, 'อุทัยธานี', 'กลาง'),
(53, 'เพชรบุรี', 'ตะวันตก'),
(54, 'ลพบุรี', 'กลาง'),
(55, 'ชุมพร', 'ใต้'),
(56, 'นครพนม', 'อีสาน'),
(57, 'สุพรรณบุรี', 'กลาง'),
(58, 'มหาสารคาม', 'อีสาน'),
(59, 'ตรัง', 'ใต้'),
(60, 'กระบี่', 'ใต้'),
(61, 'พิจิตร', 'กลาง'),
(62, 'มุกดาหาร', 'อีสาน'),
(63, 'บึงกาฬ', 'อีสาน'),
(64, 'พังงา', 'ใต้'),
(65, 'ยโสธร', 'อีสาน'),
(66, 'หนองบัวลำภู', 'อีสาน'),
(67, 'พัทลุง', 'ใต้'),
(68, 'อำนาจเจริญ', 'อีสาน'),
(69, 'สระบุรี', 'กลาง'),
(70, 'หนองคาย', 'อีสาน'),
(71, 'ปัตตานี', 'ใต้'),
(72, 'ปทุมธานี', 'กลาง'),
(73, 'อ่างทอง', 'กลาง'),
(74, 'ภูเก็ต', 'ใต้'),
(75, 'สตูล', 'ใต้'),
(76, 'สมุทรสงคราม', 'กลาง'),
(77, 'สุโขทัย', 'กลาง');

-- --------------------------------------------------------

--
-- Table structure for table `role`
--

CREATE TABLE `role` (
  `id` int(11) NOT NULL,
  `role` varchar(10) NOT NULL,
  `have_staff_access` varchar(10) DEFAULT '0',
  `have_car_size_access` varchar(10) DEFAULT '0',
  `have_service_access` varchar(10) DEFAULT '0',
  `have_booking_access` varchar(10) DEFAULT '0',
  `have_role_access` varchar(10) DEFAULT '0',
  `have_account_access` varchar(10) DEFAULT '0',
  `have_schedule_access` varchar(10) DEFAULT '0',
  `have_payment_access` varchar(10) DEFAULT '0',
  `have_payment_type_access` varchar(10) DEFAULT '0',
  `have_on_leave_list_access` varchar(10) DEFAULT '0',
  `have_right_to_approve_on_leave` varchar(10) DEFAULT '0',
  `have_on_leave_personal_access` varchar(10) DEFAULT '0',
  `have_day_off_list_access` varchar(10) DEFAULT '0',
  `have_on_leave_type_access` varchar(10) DEFAULT '0',
  `have_channel_access` varchar(10) DEFAULT '0',
  `have_status_access` varchar(10) DEFAULT '0',
  `have_customer_access` varchar(10) DEFAULT '0',
  `have_master_table_access` varchar(10) DEFAULT '0',
  `have_user_access` varchar(10) DEFAULT '0',
  `have_template_access` varchar(10) DEFAULT '0',
  `have_search_access` varchar(10) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `role`
--

INSERT INTO `role` (`id`, `role`, `have_staff_access`, `have_car_size_access`, `have_service_access`, `have_booking_access`, `have_role_access`, `have_account_access`, `have_schedule_access`, `have_payment_access`, `have_payment_type_access`, `have_on_leave_list_access`, `have_right_to_approve_on_leave`, `have_on_leave_personal_access`, `have_day_off_list_access`, `have_on_leave_type_access`, `have_channel_access`, `have_status_access`, `have_customer_access`, `have_master_table_access`, `have_user_access`, `have_template_access`, `have_search_access`) VALUES
(1, 'admin', '1,2,3,4', '1,2,3,4', '1,2,3,4', '1,2,3,4', '1,2,3,4', '1,2,3,4', '1,2,3,4', '1,2,3,4', '1,2,3,4', '1,2,4,5', '1,2,3,4,5', '1,2,3,4', '1,2,3,4', '1,2,3,4', '1,2,3,4', '1,2,3,4', '1,2,3,4', '1', '1', '1,3,2,4', '1,2,3,4'),
(2, 'user', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'),
(3, 'new', '1', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'),
(4, 'test', '0', '1', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0');

-- --------------------------------------------------------

--
-- Table structure for table `search_filter`
--

CREATE TABLE `search_filter` (
  `id` int(11) NOT NULL,
  `label` varchar(50) NOT NULL,
  `data_value` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `search_filter`
--

INSERT INTO `search_filter` (`id`, `label`, `data_value`) VALUES
(1, 'customer name', 'customer_name'),
(2, 'customer car no', 'customer_carno');

-- --------------------------------------------------------

--
-- Table structure for table `service`
--

CREATE TABLE `service` (
  `id` int(11) NOT NULL,
  `service` varchar(100) NOT NULL,
  `description` varchar(150) DEFAULT NULL,
  `car_size_id` int(11) DEFAULT NULL,
  `used_time` int(11) NOT NULL,
  `is_available` tinyint(4) DEFAULT 0,
  `price` decimal(10,2) NOT NULL,
  `used_people` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `service`
--

INSERT INTO `service` (`id`, `service`, `description`, `car_size_id`, `used_time`, `is_available`, `price`, `used_people`) VALUES
(14, 'normal wash', '', 86, 30, 1, 100.00, 8),
(15, 'test noti', '', 87, 10, 1, 123.45, 1),
(17, 'wash', '', 87, 30, 1, 450.20, 1);

-- --------------------------------------------------------

--
-- Table structure for table `staff_user`
--

CREATE TABLE `staff_user` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `staff_user`
--

INSERT INTO `staff_user` (`id`, `username`, `name`, `password`, `role_id`) VALUES
(6, 'admin', 'admin', '$2b$10$ooW8uNmzu485Kbk7kbCCyubNukNbJhBEqEw0qRRbLuAs2zf0iWJJK', 1),
(16, 'admin2', 'admin2', '$2b$10$ByE9eqDxL1I4qBQjC1Khd.cHRzcSlhr/m8emx07m6JGMU5ju4a08i', 1),
(17, 'washer1', 'washer1', '$2b$10$YMkskvIU68wywwbwTHyNXOsVYKdSsWbLre9Reuig12Ino1yu2NPAm', 1),
(18, 'washer2', 'washer2', '$2b$10$6oKHZTChMUr0OJmkhZHZb.g5uGvje429CRBck9FwXgQwhMTHJ8csa', 2),
(19, 'washer3', 'washer3', '$2b$10$f46vFQTDkQ4sQ/3Q558lIODtI/O30JQ7YKSWkkyWa9aNyKWKNJrVa', 2),
(20, 'manager2', 'manager2', '$2b$10$C2/cw.Jj.AuZYhEnGcPdWOVfc/nk33YQOHO8R881Cx6gqXuR3AD1i', 1),
(21, 'manager3', 'manager3', '$2b$10$WuU4GwaZLBmj6sT6gz92genTr0Y6JYWfFoUIlmMQxIZp7ViC4YdJW', 1),
(30, 'admin45', 'admin4', '$2b$10$7oGLC4658EuWxI2I2svbZOh7tIovR37CbW4lmX3NjYKJHGWWIRIry', 2);

-- --------------------------------------------------------

--
-- Table structure for table `status`
--

CREATE TABLE `status` (
  `id` int(11) NOT NULL,
  `code` varchar(50) NOT NULL,
  `description` varchar(100) DEFAULT NULL,
  `status_group_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `status`
--

INSERT INTO `status` (`id`, `code`, `description`, `status_group_id`) VALUES
(1, 'wait to be called', NULL, 1),
(2, 'washing', NULL, 1),
(4, 'paid', '', 2),
(5, 'indept', 'not ready to pay', 2);

-- --------------------------------------------------------

--
-- Table structure for table `status_group`
--

CREATE TABLE `status_group` (
  `id` int(11) NOT NULL,
  `code` varchar(50) NOT NULL,
  `description` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `status_group`
--

INSERT INTO `status_group` (`id`, `code`, `description`) VALUES
(1, 'washing status', NULL),
(2, 'payment status', NULL),
(3, 'on leave status', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `template`
--

CREATE TABLE `template` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `template` text NOT NULL,
  `is_available` tinyint(4) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `template`
--

INSERT INTO `template` (`id`, `name`, `template`, `is_available`) VALUES
(29, 'test', '<p>test</p>', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `account`
--
ALTER TABLE `account`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `admin_role_label`
--
ALTER TABLE `admin_role_label`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `booking`
--
ALTER TABLE `booking`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `car_size`
--
ALTER TABLE `car_size`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `size` (`size`),
  ADD UNIQUE KEY `size_2` (`size`);

--
-- Indexes for table `channel`
--
ALTER TABLE `channel`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `channel_name` (`name`);

--
-- Indexes for table `customer`
--
ALTER TABLE `customer`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `phone` (`phone`);

--
-- Indexes for table `customer_car`
--
ALTER TABLE `customer_car`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_plate_no` (`plate_no`),
  ADD KEY `fk_customer_id` (`customer_id`),
  ADD KEY `fk_size_id` (`size_id`);

--
-- Indexes for table `day_off`
--
ALTER TABLE `day_off`
  ADD PRIMARY KEY (`staff_id`);

--
-- Indexes for table `on_leave`
--
ALTER TABLE `on_leave`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_on_leave_staff_id` (`staff_id`),
  ADD KEY `fk_on_leave_on_leave_type_id` (`on_leave_type_id`),
  ADD KEY `fk_on_leave_approved_by_id` (`approved_by_id`);

--
-- Indexes for table `on_leave_type`
--
ALTER TABLE `on_leave_type`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `type` (`type`);

--
-- Indexes for table `payment_type`
--
ALTER TABLE `payment_type`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `type` (`type`);

--
-- Indexes for table `province`
--
ALTER TABLE `province`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `search_filter`
--
ALTER TABLE `search_filter`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `service`
--
ALTER TABLE `service`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `service` (`service`),
  ADD KEY `fk_service_car_size_id` (`car_size_id`);

--
-- Indexes for table `staff_user`
--
ALTER TABLE `staff_user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_staff_user_username` (`username`),
  ADD KEY `fk_staff_user_role` (`role_id`);

--
-- Indexes for table `status`
--
ALTER TABLE `status`
  ADD PRIMARY KEY (`id`),
  ADD KEY `status_group_id` (`status_group_id`);

--
-- Indexes for table `status_group`
--
ALTER TABLE `status_group`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `template`
--
ALTER TABLE `template`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `account`
--
ALTER TABLE `account`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `admin_role_label`
--
ALTER TABLE `admin_role_label`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `booking`
--
ALTER TABLE `booking`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=187;

--
-- AUTO_INCREMENT for table `car_size`
--
ALTER TABLE `car_size`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=108;

--
-- AUTO_INCREMENT for table `channel`
--
ALTER TABLE `channel`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `customer`
--
ALTER TABLE `customer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `customer_car`
--
ALTER TABLE `customer_car`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `on_leave`
--
ALTER TABLE `on_leave`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT for table `on_leave_type`
--
ALTER TABLE `on_leave_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `payment_type`
--
ALTER TABLE `payment_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `province`
--
ALTER TABLE `province`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=79;

--
-- AUTO_INCREMENT for table `role`
--
ALTER TABLE `role`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `search_filter`
--
ALTER TABLE `search_filter`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `service`
--
ALTER TABLE `service`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `staff_user`
--
ALTER TABLE `staff_user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `status`
--
ALTER TABLE `status`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `status_group`
--
ALTER TABLE `status_group`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `template`
--
ALTER TABLE `template`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `customer_car`
--
ALTER TABLE `customer_car`
  ADD CONSTRAINT `fk_customer_id` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`id`),
  ADD CONSTRAINT `fk_size_id` FOREIGN KEY (`size_id`) REFERENCES `car_size` (`id`);

--
-- Constraints for table `day_off`
--
ALTER TABLE `day_off`
  ADD CONSTRAINT `day_off_ibfk_1` FOREIGN KEY (`staff_id`) REFERENCES `staff_user` (`id`);

--
-- Constraints for table `on_leave`
--
ALTER TABLE `on_leave`
  ADD CONSTRAINT `fk_on_leave_approved_by_id` FOREIGN KEY (`approved_by_id`) REFERENCES `staff_user` (`id`),
  ADD CONSTRAINT `fk_on_leave_on_leave_type_id` FOREIGN KEY (`on_leave_type_id`) REFERENCES `on_leave_type` (`id`),
  ADD CONSTRAINT `fk_on_leave_staff_id` FOREIGN KEY (`staff_id`) REFERENCES `staff_user` (`id`);

--
-- Constraints for table `service`
--
ALTER TABLE `service`
  ADD CONSTRAINT `fk_service_car_size_id` FOREIGN KEY (`car_size_id`) REFERENCES `car_size` (`id`);

--
-- Constraints for table `staff_user`
--
ALTER TABLE `staff_user`
  ADD CONSTRAINT `fk_staff_user_role` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`);

--
-- Constraints for table `status`
--
ALTER TABLE `status`
  ADD CONSTRAINT `status_ibfk_1` FOREIGN KEY (`status_group_id`) REFERENCES `status_group` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
