-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 07, 2026 at 06:33 PM
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
(7, 'testexpense', 0, 20, 1, 0, '2024-02-04'),
(8, 'admin', 0, 300, 1, 0, '2024-02-04'),
(9, 'admin', 300, 0, 0, 1, '2024-06-02'),
(10, 'newcar', 50, 0, 0, 1, '2024-06-02'),
(11, 'testchangecar_no', 0, 0, 0, 1, '2024-06-02'),
(12, 'testchangecar_no', 200, 0, 0, 1, '2024-06-02'),
(13, 'test', 0, 3, 1, 0, '0000-00-00');

-- --------------------------------------------------------

--
-- Table structure for table `car_size`
--

CREATE TABLE `car_size` (
  `id` int(11) NOT NULL,
  `size` varchar(30) NOT NULL,
  `is_available` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `car_size`
--

INSERT INTO `car_size` (`id`, `size`, `is_available`) VALUES
(86, ' mini car', 1),
(87, 'normal ', 1),
(101, 'mini car', 1),
(114, 'XXs', 1),
(159, 'new gen1', 1);

-- --------------------------------------------------------

--
-- Table structure for table `channel`
--

CREATE TABLE `channel` (
  `id` int(11) NOT NULL,
  `name` varchar(30) NOT NULL,
  `max_capacity` int(11) NOT NULL,
  `is_available` tinyint(4) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `channel`
--

INSERT INTO `channel` (`id`, `name`, `max_capacity`, `is_available`) VALUES
(1, 'channel 1', 3, 1),
(2, 'channel 2', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `channel_schedule`
--

CREATE TABLE `channel_schedule` (
  `channel_id` int(11) NOT NULL,
  `day_of_week` enum('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday') NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `channel_schedule`
--

INSERT INTO `channel_schedule` (`channel_id`, `day_of_week`, `start_time`, `end_time`) VALUES
(1, 'Sunday', '09:00:00', '18:00:00'),
(1, 'Monday', '09:00:00', '18:00:00'),
(1, 'Tuesday', '09:00:00', '18:00:00'),
(1, 'Wednesday', '09:00:00', '18:00:00'),
(1, 'Thursday', '09:00:00', '18:00:00'),
(1, 'Friday', '09:00:00', '18:00:00'),
(1, 'Saturday', '09:00:00', '18:00:00'),
(2, 'Sunday', '09:00:00', '20:00:00'),
(2, 'Monday', '01:01:00', '01:01:00');

-- --------------------------------------------------------

--
-- Table structure for table `channel_service`
--

CREATE TABLE `channel_service` (
  `channel_id` int(11) NOT NULL,
  `service_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `channel_service`
--

INSERT INTO `channel_service` (`channel_id`, `service_id`) VALUES
(1, 2),
(1, 3),
(2, 3);

-- --------------------------------------------------------

--
-- Table structure for table `customer_car`
--

CREATE TABLE `customer_car` (
  `id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `plate_no` varchar(20) NOT NULL,
  `province_id` int(11) NOT NULL,
  `brand` varchar(25) NOT NULL,
  `model` varchar(25) DEFAULT NULL,
  `size_id` int(11) NOT NULL,
  `color` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customer_car`
--

INSERT INTO `customer_car` (`id`, `customer_id`, `plate_no`, `province_id`, `brand`, `model`, `size_id`, `color`) VALUES
(2, 6, 'csdd1234', 51, 'sd', NULL, 86, 'ds'),
(4, 6, 'csdd1234s', 51, 'sd', 'fcv', 86, 'ds'),
(5, 1, '123abc', 60, 'toyota', 'altiz 7.4', 87, 'pink');

-- --------------------------------------------------------

--
-- Table structure for table `customer_user`
--

CREATE TABLE `customer_user` (
  `id` int(11) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `name` varchar(50) NOT NULL,
  `password` varchar(150) NOT NULL,
  `failed_login_count` tinyint(4) NOT NULL DEFAULT 0,
  `is_locked` tinyint(4) NOT NULL DEFAULT 0,
  `locked_reason` varchar(150) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customer_user`
--

INSERT INTO `customer_user` (`id`, `phone`, `name`, `password`, `failed_login_count`, `is_locked`, `locked_reason`) VALUES
(1, '0000', 'name surname 0000', '$2b$10$GAA5SQm1Dio/yviAKVaHw.FChyPs8NQwHFwrfpEGt/dhQrbII9x8W', 0, 0, NULL),
(6, '222', 'twotwotwo', '$2b$10$YJH7EVFO0dBFi/zNnvbr4.DZNIGZMuJSwuhLlr2ZrjzEIxKTGT81m', 0, 0, NULL),
(43, 'test1', 'test', '$2b$10$DVgCD4s4eXlQpFZ0q71xm.Lep9WGo9RYw9fduugzfCku1dv5KO.oi', 0, 0, NULL),
(61, '0922788380', 'Kittima Moolamart', '$2b$10$LCY8HnucIwojboDko/1BfOBIfXzZVwWak1EGakhRmq4gyZmpdiZpG', 0, 0, NULL),
(62, '232222', 'new member', '$2b$10$Vxk7Iy0y1zRtGjmExvT4wui05n9T2o91If9R91T6lvDS47E2prjfO', 0, 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `general_setting`
--

CREATE TABLE `general_setting` (
  `id` int(11) NOT NULL,
  `staff_failed_login_limit` int(11) NOT NULL,
  `customer_failed_login_limit` int(11) NOT NULL,
  `staff_user_login_mins_limit` int(11) NOT NULL,
  `customer_user_login_mins_limit` int(11) NOT NULL,
  `staff_inactive_limit` int(11) NOT NULL,
  `customer_inactive_limit` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `general_setting`
--

INSERT INTO `general_setting` (`id`, `staff_failed_login_limit`, `customer_failed_login_limit`, `staff_user_login_mins_limit`, `customer_user_login_mins_limit`, `staff_inactive_limit`, `customer_inactive_limit`) VALUES
(1, 3, 3, 480, 480, 4, 1);

-- --------------------------------------------------------

--
-- Table structure for table `holiday`
--

CREATE TABLE `holiday` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `holiday`
--

INSERT INTO `holiday` (`id`, `name`, `date`) VALUES
(1, 'songkran', '2026-04-13');

-- --------------------------------------------------------

--
-- Table structure for table `module`
--

CREATE TABLE `module` (
  `id` int(11) NOT NULL,
  `code` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `parent_id` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `module`
--

INSERT INTO `module` (`id`, `code`, `name`, `parent_id`) VALUES
(1, 'home', 'HOME', 0),
(2, 'setting', 'SETTING', 0),
(3, 'role', 'ACCESS CONFIG', 2),
(4, 'user', 'USER', 0),
(5, 'customer', 'CUSTOMER', 4),
(6, 'staff', 'STAFF', 4),
(7, 'masterData', 'MASTER DATA', 0),
(8, 'carSize', 'CAR SIZE', 7),
(9, 'customerCar', 'CUSTOMER\'S CAR', 4),
(10, 'service', 'SERVICE', 0),
(11, 'service', 'SERVICE', 7),
(12, 'channel', 'CHANNEL', 7),
(13, 'general', 'GENERAL', 2),
(14, 'status', 'STATUS', 7),
(15, 'paymentType', 'PAYMENT TYPE', 7);

-- --------------------------------------------------------

--
-- Table structure for table `module_permission`
--

CREATE TABLE `module_permission` (
  `module_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `module_permission`
--

INSERT INTO `module_permission` (`module_id`, `permission_id`) VALUES
(2, 1),
(3, 1),
(3, 2),
(3, 3),
(3, 4),
(4, 1),
(5, 1),
(5, 2),
(5, 3),
(5, 4),
(6, 1),
(6, 2),
(6, 3),
(6, 4),
(11, 1),
(8, 1),
(8, 2),
(8, 3),
(8, 4),
(9, 1),
(9, 2),
(9, 3),
(9, 4),
(11, 1),
(11, 2),
(11, 3),
(11, 4),
(7, 1),
(11, 1),
(12, 1),
(12, 2),
(12, 3),
(12, 4),
(13, 1),
(13, 3),
(14, 1),
(14, 2),
(14, 3),
(14, 4),
(15, 1),
(15, 2),
(15, 3),
(15, 4);

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
(51, 6, '2024-06-01', '2024-06-01', 'test', 1, 6, 15, 1, 6),
(53, 6, '2025-03-09', '2025-03-09', 'test', 1, 6, 14, 1, 29);

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
-- Table structure for table `permission`
--

CREATE TABLE `permission` (
  `id` int(11) NOT NULL,
  `code` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `permission`
--

INSERT INTO `permission` (`id`, `code`, `name`) VALUES
(1, 'view', 'VIEW'),
(2, 'add', 'ADD'),
(3, 'edit', 'EDIT'),
(4, 'delete', 'DELETE');

-- --------------------------------------------------------

--
-- Table structure for table `province`
--

CREATE TABLE `province` (
  `id` int(11) NOT NULL,
  `province` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `province`
--

INSERT INTO `province` (`id`, `province`) VALUES
(60, 'กระบี่'),
(1, 'กรุงเทพมหานคร'),
(36, 'กาญจนบุรี'),
(51, 'กาฬสินธุ์'),
(47, 'กำแพงเพชร'),
(24, 'ขอนแก่น'),
(26, 'จันทบุรี'),
(28, 'ฉะเชิงเทรา'),
(6, 'ชลบุรี'),
(39, 'ชัยนาท'),
(41, 'ชัยภูมิ'),
(55, 'ชุมพร'),
(59, 'ตรัง'),
(15, 'ตราด'),
(16, 'ตาก'),
(20, 'นครนายก'),
(3, 'นครปฐม'),
(56, 'นครพนม'),
(21, 'นครราชศรีมา'),
(45, 'นครศรีธรรมราช'),
(19, 'นครสวรรค์'),
(2, 'นนทบุรี'),
(35, 'นราธิวาส'),
(17, 'น่าน'),
(63, 'บึงกาฬ'),
(44, 'บุรีรัมย์'),
(72, 'ปทุมธานี'),
(30, 'ประจวบคีรีขันธ์'),
(27, 'ปราจีนบุรี'),
(71, 'ปัตตานี'),
(38, 'พระนครศรีอยุธยา'),
(18, 'พะเยา'),
(64, 'พังงา'),
(67, 'พัทลุง'),
(61, 'พิจิตร'),
(43, 'พิษณุโลก'),
(74, 'ภูเก็ต'),
(58, 'มหาสารคาม'),
(62, 'มุกดาหาร'),
(10, 'ยะลา'),
(65, 'ยโสธร'),
(9, 'ระนอง'),
(8, 'ระยอง'),
(7, 'ราชบุรี'),
(48, 'ร้อยเอ็ด'),
(54, 'ลพบุรี'),
(14, 'ลำปาง'),
(32, 'ลำพูน'),
(31, 'ศรีสะเกษ'),
(46, 'สกลนคร'),
(33, 'สงขลา'),
(75, 'สตูล'),
(5, 'สมุทรปราการ'),
(76, 'สมุทรสงคราม'),
(4, 'สมุทรสาคร'),
(69, 'สระบุรี'),
(25, 'สระแก้ว'),
(37, 'สิงห์บุรี'),
(57, 'สุพรรณบุรี'),
(40, 'สุราษฎร์ธานี'),
(49, 'สุรินทร์'),
(77, 'สุโขทัย'),
(70, 'หนองคาย'),
(66, 'หนองบัวลำภู'),
(68, 'อำนาจเจริญ'),
(23, 'อุดรธานี'),
(50, 'อุตรดิตถ์'),
(52, 'อุทัยธานี'),
(22, 'อุบลราชธานี'),
(73, 'อ่างทอง'),
(12, 'เชียงราย'),
(11, 'เชียงใหม่'),
(53, 'เพชรบุรี'),
(42, 'เพชรบูรณ์'),
(34, 'เลย'),
(29, 'แพร่'),
(13, 'แม่ฮ่องสอน');

-- --------------------------------------------------------

--
-- Table structure for table `role`
--

CREATE TABLE `role` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `role`
--

INSERT INTO `role` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'Super User', '2026-01-09 08:43:19', '2026-02-07 11:52:38'),
(95, 'Admin', '2026-01-24 16:06:34', '2026-02-07 11:19:22');

-- --------------------------------------------------------

--
-- Table structure for table `role_permission`
--

CREATE TABLE `role_permission` (
  `role_id` int(11) NOT NULL,
  `module_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `role_permission`
--

INSERT INTO `role_permission` (`role_id`, `module_id`, `permission_id`) VALUES
(95, 2, 1),
(1, 2, 1),
(1, 3, 1),
(1, 3, 2),
(1, 3, 3),
(1, 3, 4),
(1, 4, 1),
(1, 5, 1),
(1, 5, 2),
(1, 5, 3),
(1, 5, 4),
(1, 6, 1),
(1, 6, 2),
(1, 6, 3),
(1, 6, 4),
(1, 7, 1),
(1, 8, 1),
(1, 8, 2),
(1, 8, 3),
(1, 8, 4),
(1, 9, 1),
(1, 9, 2),
(1, 9, 3),
(1, 9, 4),
(1, 11, 1),
(1, 11, 1),
(1, 11, 1),
(1, 11, 2),
(1, 11, 3),
(1, 11, 4),
(1, 12, 1),
(1, 12, 2),
(1, 12, 3),
(1, 12, 4),
(1, 13, 1),
(1, 13, 3),
(1, 14, 1),
(1, 14, 2),
(1, 14, 3),
(1, 14, 4),
(1, 15, 1),
(1, 15, 2),
(1, 15, 3),
(1, 15, 4);

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
  `name` varchar(100) NOT NULL,
  `car_size_id` int(11) NOT NULL,
  `duration_minute` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `required_staff` int(11) NOT NULL,
  `is_available` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `service`
--

INSERT INTO `service` (`id`, `name`, `car_size_id`, `duration_minute`, `price`, `required_staff`, `is_available`) VALUES
(2, 'wash', 87, 20, 200.00, 1, 1),
(3, 'coated', 87, 60, 500.00, 3, 1);

-- --------------------------------------------------------

--
-- Table structure for table `staff_service`
--

CREATE TABLE `staff_service` (
  `staff_id` int(11) NOT NULL,
  `service_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `staff_service`
--

INSERT INTO `staff_service` (`staff_id`, `service_id`) VALUES
(17, 2),
(18, 2),
(19, 2),
(17, 3),
(18, 3),
(19, 3);

-- --------------------------------------------------------

--
-- Table structure for table `staff_user`
--

CREATE TABLE `staff_user` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `failed_login_count` tinyint(4) NOT NULL DEFAULT 0,
  `is_locked` tinyint(4) NOT NULL DEFAULT 0,
  `locked_reason` varchar(150) DEFAULT NULL,
  `role_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `staff_user`
--

INSERT INTO `staff_user` (`id`, `username`, `name`, `password`, `failed_login_count`, `is_locked`, `locked_reason`, `role_id`) VALUES
(6, 'admin', 'admin', '$2b$10$S/ro0u/Ufy36muvZ1OC3betMfoMI7PEQtYV.36ZLeAxjqdNN1bvT2', 0, 0, NULL, 1),
(16, 'admin2', 'admin2', '$2b$10$uzZYS/rfzH6DVwDUQ1Gh9eWU67P9UUn6BooroWlydgWm9jFSTtKRe', 0, 0, NULL, 1),
(17, 'washer1', 'washer1', '$2b$10$YMkskvIU68wywwbwTHyNXOsVYKdSsWbLre9Reuig12Ino1yu2NPAm', 0, 0, NULL, 95),
(18, 'washer2', 'washer2', '$2b$10$6oKHZTChMUr0OJmkhZHZb.g5uGvje429CRBck9FwXgQwhMTHJ8csa', 0, 0, NULL, 1),
(19, 'washer3', 'washer3', '$2b$10$f46vFQTDkQ4sQ/3Q558lIODtI/O30JQ7YKSWkkyWa9aNyKWKNJrVa', 0, 0, NULL, 1),
(20, 'manager2', 'manager2', '$2b$10$C2/cw.Jj.AuZYhEnGcPdWOVfc/nk33YQOHO8R881Cx6gqXuR3AD1i', 0, 1, NULL, 1),
(21, 'manager3', 'manager3', '$2b$10$WuU4GwaZLBmj6sT6gz92genTr0Y6JYWfFoUIlmMQxIZp7ViC4YdJW', 0, 1, NULL, 1),
(30, 'adminnewnew', 'admin4', '$2b$10$monDz9DtKFyrNRu7G4SyRuiL.xEdiv5vVr5yEntZl5ZFpvx8k.YoC', 0, 1, NULL, 1),
(62, 'newstaff2', 'newstaff', '$2b$10$dVtXAxJMMNqEhHlnwn6jr.800YIxg5bkvveclaM7zDuToHa3z7nP.', 0, 0, NULL, 95);

-- --------------------------------------------------------

--
-- Table structure for table `status`
--

CREATE TABLE `status` (
  `id` int(11) NOT NULL,
  `code` varchar(20) NOT NULL,
  `status_group_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `status`
--

INSERT INTO `status` (`id`, `code`, `status_group_id`) VALUES
(1, 'Booking', 1),
(7, 'Cancel', 1),
(6, 'Failed', 2),
(3, 'In Progress', 1),
(12, 'NEW', 1),
(15, 'NEW', 2),
(5, 'Paid', 2),
(4, 'Pending_TEST', 2),
(2, 'WalkIn', 1);

-- --------------------------------------------------------

--
-- Table structure for table `status_group`
--

CREATE TABLE `status_group` (
  `id` int(11) NOT NULL,
  `code` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `status_group`
--

INSERT INTO `status_group` (`id`, `code`) VALUES
(2, 'Payment'),
(1, 'Service');

-- --------------------------------------------------------

--
-- Table structure for table `template`
--

CREATE TABLE `template` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `template` longtext NOT NULL,
  `is_available` tinyint(4) NOT NULL DEFAULT 0,
  `is_have_custom_field` tinyint(1) NOT NULL,
  `custom_field` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `template`
--

INSERT INTO `template` (`id`, `name`, `template`, `is_available`, `is_have_custom_field`, `custom_field`) VALUES
(29, 'test', '<p>test<img src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD0AAAAwCAYAAACi/HI3AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAScSURBVGhD7ZldSJtXGMd/kakXGqlakTYIUWYM6ApiR1eQDJFdqbtpQxy4lw0tBHRQb0y3G/GmJN7Uiw56oUOCF8mysQvTmw0ZiDBbCJbNgY1QA2JZmTGUmG0quF3kfV/fnHwYp7Xm4wfCm+c5OeR/nuecnH/Umc3mfykwSsRAIaD7+P3rxUoXAkXRWmrLSmnWV9JztZ5PjQ3cvFwtDslZUu7pZn0loy1NYpjw/gHL2zs8fvlKTOUUSZVOJxi5+j1X62nWV4qplOh0OjGUGsmJzzWgCQww5XVi10TOkiTRUmMDAOvRXdaju2p8PbqrVlgZcxwVVVV8MvIFdVeuiKm3SoLom5erqS0rBaCmvBz3xqYq/sHzF5j0FaDZ79lgNJkYdNzjuuVDMZUVfWMzTI05mPV68Hk9QkfE8z4lN+2gD4BOxqflWEI8Pj5BdE1ZmfpcW1bKXfO7uDc2efD8BaMtTQlClQXIBl1JCR/dvs2tO3eoqj75gWjoqGbZ1o/V5mfL2MW4RU5ITiRTELetH6utH+uQi3kAlpgYkmO2ftxBE7fGOtX5ktpby87eHuH9A7X6p8X03jWGvvyKazduiKmMxAJ+HgEQIhI9ittbjWwtKkITsbuOKi11JBYoQXQwGlOflZYebWlSK67d4zv7++pztvzz91/89J2PX588EVNni+Sk2xhiQal04EgXomilsgDbewdqSyutrhDeP+CX7Yjmncez9uwZ0/fv89vTp2IKQhFixjb1tO4b68IQWpWrm56tcAyD5Wi/JhCNsAXAAN2ZKh3eP8C9sQnyoabdw9rDSxmTDYeHh/zo+5Yfvpkh+vq1mI6z6OL7QB3dajv+yYJjThyVxPzkIAvhdiTxwHL7WUWJtxHRVHp+8uf0lxOpsSFpLyuLom3zTNTW1wM6wq/+EFNvlZSikStbU16untLBaCxrsRedtKLzmYxfWflKUXShkL+iJSe+NE7tAoo+ma1MMByCGUnHBTy9B5jytrFmu3fsjexkY494RwycDuFDSE58ratYHXP0jc3QTZBLHe1UAIT8WNVbVyfj0yO06ZV5Qqwpj5ITX48x/hxdwa06KcBi4JJ63VTQzhViQbMgymc41/ZOZxHtrhEagw9lK+g/EmFxMGuJqNbRHTQhuQbkxfXgG26nQq9cN2fk+RRbqZlHg6Gj+nxFp7aIA5iNIZYnl7RDAej7wKQRpbWIc9y19WP9eoVYdEVelEEmFoUJUhAL+M9X9P8hFlA6QP7LwogcxxsQXUe9hXgLKnsxIyEiUSNmKf7K7urFIGfml4PQ0Zv1SZ4tZyx6joUAtA178Hm7iARC4oAULDGxGMLQE29h8++avShYTp/Xw5S8OOmR97u3FwPG+Hs1v5FxMb+y3jxnXOncoCi6UCiKLhTyVHRmp5anojOTu9/TFgezw7Jjk6+rn00uYXd56BYvggmOLpdFJ9DJ+PTn4FZMR2afncPtrVw3Pfi8Wi9+PDkr2u7qxRDyy+7rIaua/2YeR86KBoiFZUMj9aaotOL2kslZ0Y8er0DHSLy9WyNCpbVuL/kHwzw5yE5Gzlb6NBRFFwr/ATGt7FW0EAkDAAAAAElFTkSuQmCC\"></p>', 1, 0, ''),
(30, 'test2 ', '<iframe class=\"ql-video\" frameborder=\"0\" allowfullscreen=\"true\" src=\"https://www.youtube.com/embed/MA_B8RU9BsQ?showinfo=0\"></iframe><p><br></p>', 1, 0, ''),
(31, 'test3', '<p>test333333sdfsdfsdfsefwef</p><p>serfse</p><p>esfsef</p><p>EEFEFE</p><p>DSFEFSE</p><p>DFDSFSD</p><p>dF</p><p>DSFSD</p><p>FSD</p><p>FDS</p><p>FDS</p><p>FDS</p><p>FSD</p><p>FSD</p><p>FSD</p><p>FSD</p><p>F</p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p>sdfsd</p><p><br></p><p>sdf</p><p>d</p><p>d</p><p>d</p><p>dd</p><p><br></p><p>d</p><p>d</p><p><br></p><p>d</p><p>d</p><p>d</p><p>d</p><p>d</p><p><br></p><p>d</p><p>d</p><p>d</p><p><br></p><p>d</p><p>d</p><p>d</p><p><br></p><p>d</p><p>SDFsdfdd</p><p>d</p><p>d</p><p>d</p><p><br></p><p>sd</p><p>fsd</p><p>gs</p><p>dg</p><p>sdg</p><p>sdg</p><p>sd</p><p>g</p><p>sdg</p><p>ds</p><p>gdsg</p><p>SDF</p><p>SDFSDFSED</p><p>FSD</p><p>FSD</p><p>FSD</p><p>F</p>', 1, 0, '');
INSERT INTO `template` (`id`, `name`, `template`, `is_available`, `is_have_custom_field`, `custom_field`) VALUES
(32, 'test4', '<p><img src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD0AAAAwCAYAAACi/HI3AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAScSURBVGhD7ZldSJtXGMd/kakXGqlakTYIUWYM6ApiR1eQDJFdqbtpQxy4lw0tBHRQb0y3G/GmJN7Uiw56oUOCF8mysQvTmw0ZiDBbCJbNgY1QA2JZmTGUmG0quF3kfV/fnHwYp7Xm4wfCm+c5OeR/nuecnH/Umc3mfykwSsRAIaD7+P3rxUoXAkXRWmrLSmnWV9JztZ5PjQ3cvFwtDslZUu7pZn0loy1NYpjw/gHL2zs8fvlKTOUUSZVOJxi5+j1X62nWV4qplOh0OjGUGsmJzzWgCQww5XVi10TOkiTRUmMDAOvRXdaju2p8PbqrVlgZcxwVVVV8MvIFdVeuiKm3SoLom5erqS0rBaCmvBz3xqYq/sHzF5j0FaDZ79lgNJkYdNzjuuVDMZUVfWMzTI05mPV68Hk9QkfE8z4lN+2gD4BOxqflWEI8Pj5BdE1ZmfpcW1bKXfO7uDc2efD8BaMtTQlClQXIBl1JCR/dvs2tO3eoqj75gWjoqGbZ1o/V5mfL2MW4RU5ITiRTELetH6utH+uQi3kAlpgYkmO2ftxBE7fGOtX5ktpby87eHuH9A7X6p8X03jWGvvyKazduiKmMxAJ+HgEQIhI9ittbjWwtKkITsbuOKi11JBYoQXQwGlOflZYebWlSK67d4zv7++pztvzz91/89J2PX588EVNni+Sk2xhiQal04EgXomilsgDbewdqSyutrhDeP+CX7Yjmncez9uwZ0/fv89vTp2IKQhFixjb1tO4b68IQWpWrm56tcAyD5Wi/JhCNsAXAAN2ZKh3eP8C9sQnyoabdw9rDSxmTDYeHh/zo+5Yfvpkh+vq1mI6z6OL7QB3dajv+yYJjThyVxPzkIAvhdiTxwHL7WUWJtxHRVHp+8uf0lxOpsSFpLyuLom3zTNTW1wM6wq/+EFNvlZSikStbU16untLBaCxrsRedtKLzmYxfWflKUXShkL+iJSe+NE7tAoo+ma1MMByCGUnHBTy9B5jytrFmu3fsjexkY494RwycDuFDSE58ratYHXP0jc3QTZBLHe1UAIT8WNVbVyfj0yO06ZV5Qqwpj5ITX48x/hxdwa06KcBi4JJ63VTQzhViQbMgymc41/ZOZxHtrhEagw9lK+g/EmFxMGuJqNbRHTQhuQbkxfXgG26nQq9cN2fk+RRbqZlHg6Gj+nxFp7aIA5iNIZYnl7RDAej7wKQRpbWIc9y19WP9eoVYdEVelEEmFoUJUhAL+M9X9P8hFlA6QP7LwogcxxsQXUe9hXgLKnsxIyEiUSNmKf7K7urFIGfml4PQ0Zv1SZ4tZyx6joUAtA178Hm7iARC4oAULDGxGMLQE29h8++avShYTp/Xw5S8OOmR97u3FwPG+Hs1v5FxMb+y3jxnXOncoCi6UCiKLhTyVHRmp5anojOTu9/TFgezw7Jjk6+rn00uYXd56BYvggmOLpdFJ9DJ+PTn4FZMR2afncPtrVw3Pfi8Wi9+PDkr2u7qxRDyy+7rIaua/2YeR86KBoiFZUMj9aaotOL2kslZ0Y8er0DHSLy9WyNCpbVuL/kHwzw5yE5Gzlb6NBRFFwr/ATGt7FW0EAkDAAAAAElFTkSuQmCC\"><img src=\"data:image/png;base64,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slehevpKkE7GXJUAne3RK8FgBn0pHnLNSA9xO64vUVnJysrSqVu3bmZO5bNm8t148StTQDdc8peKGagMPU6P7pfgr2a4hoNl1y9j8M+3FpgScNofHjVDcRARERERERGVvwoV9CUiIiIiIiIiIiKi0gkJ+sbzrfNEREREREREREREVPFUMzkRERERERERERERVQEhPX0zMzPNFJW32bNno3fv3qZEFRXPU+zYVuWL7Z1YbM+yxzYue2zjyonnrWriea2YeF6IiKgqY9C3gpA3HD179jQlqojky+F4nmLDtipfbO/EYnuWPbZx2WMbV048b1UTz2vFxPNSscj54JdwExElFod3ICIiIiIiIiIiIqpCkjMzM+830+jatauZovK2ceNGNG/eHEVFRYEkWK44Zfnrs5ynZs2a+dazHCx728pbz3Jiy2zvxJbZnmVf5vO07MvuNhbeepYrZpnPn6pZ5v1YMcu83ypWWc6H9PR1z2fOnDlz5qXL2dO3ArEnxmK5YpW9Er39qlb2SvT2WQ4teyV6+4da2SvR2z/Uy16J3j7LLLtVtrJXorfPMstuh3rZK9HbZ7lkZebMmTNnnpicY/pWEDKeVPfu3U2JKqKaNWvyPMWIbVW+2N6JxfYse2zjssc2rpx43qomnteKieelYpHzceDAAR2oSEpKYs6cOXPmCcjZ05eIiIiIiIiIDioJUDBnzpw588TlHNO3gpDxpNLT02M+cczLP69evTrPU4y5baumTZvqcqzrMS9ZzvZObM72LPucz9Oyz3kdV86c561q5jyvFTPnealYuZyP/Px8PU1ERInBoG8F4X7DQRWT940hhWfbSgI6VPbY3onF9ix7fJ6WPV7HlRPPW9XE81ox8bxULHI+GPQlIkosBn0rCPvLr99fPm2yZW/O+vKpr1Gjhu95ssmWvblNq3LyMWruTny/Jh9frdiPib/tw8Rle/H58r34evU+/Lh+P75bux9zNuZhQVYeaiQDqSlJSPJsz5vbZMve/GDU27Zq0qSJb707Z33p693tbefb3CZb9uasL17P67fs671tbOd7c5ts2ZuzPnx9pOeCzW2yZW/O+vKvL8vnz6+//orp06frMUx/+eUXdOvWLaTem9tky96c9bHX+92P7nq/nPVlXx/pOWmTLXtz1ie+Xs6HHdPXjWWW3Vhm2Y3l6OVSf5Hb/DX7sXRj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REREREREREREVJFFDPrKl7YVwfbwJSIiIiIiIiIiIqKKLmLQVzhj+LKHLxEREREREREREVFlEDXoS0RERERERERERESVB4O+RERERERERERERFUIg75EREREREREREREVQiDvkRERERERERERERVCIO+RERERERERERERFUIg75EREREREREREREVQiDvkRERERERERERERVCIO+RERERERERERERFVIhQj6jp87F5/Mm29K4ezAe5ddjqa1gumZGaZKzPhIzfsIM00x4db/gKtrPYv31ptyFZH1zrOB9rz6nR1mbsnEty05nz7tKefxsh+QZYrlZebD6rgf/s2UYqCvh+C1eDCOuew491qs10M85z3isu42Ldaev+EZWxfhPpfzWNrr+GDRbRPvdST3SzzXLREREREREREdEg560FcCvou35GDG+k34eO4vZq6XBKFuwU1d70P2/jEm3Qec5An8UnzW/4ARVwIvLVftufwPwJX/LXlQO85tZb3zX3xy7lW4sJWZISSAddJ4UwgjjuB7iYJosZDj7Pgienxjr8UxWHjuTHQ96H8UcAKj5XpPxHPeIy6r7vG7XgT+94JqzxfwEl7ECFfwdubDD+Dhe537f+K94zHEJ9ApAd8hD5rCoaLveZiIB/gcJCIiIiIiIqIQBzXoO27OHCzK3o4OGW3RukUrfLNyDd77cZapdcvCmveAewYfbsricFz2vz54eFI59XJr1R+v7789NEhZyWV9NxOfXNgHJ8prUq/vD/eq8ncl6yUZ37Z+w9gr2+EPFzc0ZdPT9qRVuOfePmZORfUbnjlpPM7+3wu4o6+ZpaRffDsmqtd80/8OrV6X8Zz3iMuuX4hP3uuDs0+Qa6IhLrw9E59MWGgC9r/huweD93+fK/+Asx9c5Ort6wS7hyzMxD0XmlmHEGmPec9WpZ7mRERERERERFRaBy3oO272HCzM2ob2bdoiv7AAy1auwKqVa3DuMT3NEm7pyLgQxQK8EmjLvscdCAbWRPj4uA4smrrAR6I9wwl4e4fqsizr7mEq69T6CM+4the6L/dQFM+q5cL0ONXbDG7H9tZzfwQ+uJ4Etlw9Sb09Xs22dCBMH19w/+F6Xq5erpbu2lS1btAny0sWOoprWzMW4eF7uyAkvDtYenHejss6mrIv1QYdX8Qn6lXe1DH4usKd165XqmN670V0DbSh+7xIKsFwIHLsyAwJWFt9BmcCNhjpPT8mMOnukel73IrMv/rhj9T6ar469i+l7L6+PNesQ17bA+rY1H3i7gGvj8Pux3stOMdkjyFsb1FzPfnVx3PeIy67Plud13bIcP9R5b1srJZc1c1TV0tIHVZhjeu1nCC9rscORIYphxXx3ojcHuHOV9g2NteAvv/91vM8J8YuN7M1z7Uasp5Hq6bo8d5MfBvyWoiIiIiIiIjoUFamQd8VOdswa8NaUwp6Z/YcLMjainYZbZFfVICFi5dgxbJVePP2m1CjerJZyq0hLnxcevc9EAiC+I/bOR6f4CrnI/ffZOIT18fHJZA6ZOEfsNAMDXGP2pbeRt8uuCcQMNmBbycAZ8NdnunpYWyNx7yO8lF0v339FzfB7msI8GCk0GJwO7rnqA5WtsNEva7zMfeuOuBzOE5w9YyUXpO4ECHlT3Qg9Tc8c9Iq5yP0+tja4aa7fALOxtkdgyG4th1L18s21m3NnDQ+ZFnRp69fG3sdjjuWq+tAvcqXlju9rsOf1/Ow8H/qGC5UdWP760CjPi+BIUJU2144Hi/6Xkcl1KqpOrbQYGQ4ocetjmWhOW7jkweBP0idOvbTBrt7vZr2O7drSPBU3yNj1etXU/d8Y64lEyS3w1As/B9wU0cb6HaCxPP0cAqqXl3DD5/kDYIqEiQ9Cfp6dPdsdovnGoq47IVN0dZMOm3p5goIS5DTTDoOV9ePmYwo0r3haQ91nc1ztUf48xWpjcVMPIwhgW3KM8wGkyM9J4pdq2p/YYPynmcDEREREREREVGZBX3X7NyOcQt+wTdrNuDblSvMXOCdWbOxYPMWtMvIQEFRARaZgO9bd9wcJuBr6OEVbGClDz658hYd/A0NhLh6YIYEjZzgbTBQ5gwN4QTSpBfxTBOoy8Ia9MEfzlXHL2X9kfNMnOAbUIpvX+HZj7Q7JKCHQC9Y52PutveoBMlsz8jVy4Gzb1dL6bI3OO0aZqDveTpwGBogPJh2YM1CoEf74j1l4xfpvBYX2jPcGTLk4DDn63Z7XrzDGSjuntAhf5iQoQ5Cr5mwTK9ke/2mXzwE92A8vpN7JmQ4BaXvQLyk7oOQwOGE/5qA73nBY6n0wtwb5l4P3tPu4Se815kE2MfgdVk2UhtrffDSleaaCwlWx/CceHCiCTo7+wsXdLdK2kufiIiIiIiIiKqeMgn6Ltu+FW/Nm4u0+ulo0iAN7//8M6Yu/Q3vzpmL+ZuzkZGRgfzC/EDA9+0//SFywNdDB+9M8Pfhk2L5iL4T4PMPNDbEieeasYElgNO1Kfq0b+eU5SPn3mEIooq0r2icgKi3F6yVfkIfM5apBP7aIaNvU/TQZdmnDTwdjjtMj9dYPhruDhTpj9/7Cfn4evhhAGLaVkLF2dYhH+2fiHmJHv/Vb4gCX85xyzAMgeORL7CzwxkU4+rJKUMd2HFxo8hauSq096xbDMf6iTrGs2PoDR3PeY+4rPv16+Nzc/WgljYwk/GJcG/o/Y3HEDtfJflSOOd4w19nEds4ouLbTFfPHUuecU6vYXs8Pr2wXUrbS5+IiIiIiIiIqpYyCfq2a9AI23fvQ87unUiuXh1HduiMaatWY9G2HLRu3Rr5RflYvGQpVi5bjXf+75boAV8J1vmMiesOkkTmjAk8b6V/8EoHUxdmY+bKVU5vWelZqcrvTRofZmiHSCLvK7KGyOgaGhgL0aorzr5wFdbMyMY8HYyWYKAqv+MdI1eCW06vaO9Hyt38AkW+AWdXL2tJfj0OY95WQsXT1jvw3rPOF7A5r+Mqz/ABMZJrA+5AqAwL4PzhIbSXdiTOccswDLZNnRS+R62MFyw9gWfKsB6B3qGR6fsjXCBZ906PPBTF2f+7Cq8//gfANXSJVzznPeKyIb3lDRtMDekha8USXPcT5t7Q+880w6q4ku4ZHv46i9jGERXfpg4gu9g/bknSXxIYYZiW8vkjCxERERERERFVFmUS9K2enIx/nHoG1m3egOVrV6J6jepo07IVmqSnoVD9t2SxBHzXYNydf4yth6/+eLsd29ZygnixBdmc3rzBj8//hrFXuj5aLUGl92bixQkwgaR0ZGAmPlkYbmiHSPz3FauQLwMr9holKKyO61lVa4JlbTtC7csEq4X3C8R0wMz7JVgOp+ew+Qi5Wu/FWIcN8BH7tpzAdsmC4l5RzquPQEB9xjTc9J4zGZ/DcYcew/kWE0iXoRmge4gOUa859KP8ruESpBe5M6WY3uXPBoN4+kvCfP6wEWDugSHq9cXcs9kEqO1QA1nvTAwORaD/gOA+PmkPn3PWqj8ekx6nYQKO8VxDEZfVx2OD6SZA7xr6QHo622EZZv7vxRL0wFci3Rsh+xfOl7o54/Z6rzNzvuR5FKmNIzLbvHJa4F6X4R6swPYNHTD3fAmeV9n/kYWIiIiIiIiIKosyG9O3RnIynjj3fKxbvwG/rViOA4X5KCiUgO9vWLVsDcb/OYYevgHSO8/5MqPAx7Jr3YJPzn3BNUZrZNJrbmLXF9FVr/sAHr73PmdMTs18fP4923vQBFe7liCwpKRffJXzBWx6X4uQEXFMXw/9BWSrzMfMb3G+6Mn1GnWPz/eCgT/paSjHHQgySa9c+YKqwMfC5cuprtJfelaMDejJsh1fBMItF4s4tqVfQ7jezNGYYKXsR4Kukc6rDjLKHwtqSU9cOz6yuYYmdcHEe8P0qg7TszxAxoLVX/Ql+1RJhmbQ5LhsUNGML2zGnm46qSleulAvpIUetwSMMzEx4tjLco1KHimg6Cwjw0Y4wUp137iOs+uVwEvLbW9iGSf2PvSwx6dewz3fOF+O56XHqVXtOCIQEHWJeN4lcOoOskZaVh2P7lUsx+Nc948F7k91zdwTHJZBt1WM932IiPeGpz2815L3fMmXuuljiNTGkelt3muHlLgFa7qq69Poc0/o805/uaN5zfKlcqFDtsQxzjMRERERERERHRKSxo0bV2SmkZkZDDqIN+afjrM63YTCor1mTvzy8gtwzSuvo2nTJjiQfwBrVqzDeyNuRY3q1c0SVZ8EabouHxJzgLrqk2DgIpxQYb8gbAfee3ghTrynBF+At/43zMTh6BMm4F0avI7Il/yR4tmmWFihvrCRiIiIiIiIiA6mMuvpa9Wsnoz/XH8VVq9ai7WHSMBXPprt9LQUZsgBfvTaRXrBror6BWEHzfqFWNMxtnFzi2lVNgFf+/H/+MeYpqpOxpK+53YGfImIiIiIiIgoqMx7+lq5B/JRLQmHRg9fGTu044v4xBRx733snVmMfAHaf4HH/YcUIBd7PfE6Ii/p5TupC68LIiIiIiIiIgpRbkFfIiIiIiIiIiIiIip7ZT68AxERERERERERERGVHwZ9iYiIiIiIiIiIiKoQBn2JiIiIiIiIiIiIqhAGfYmIiIiIiIiIiIiqEAZ9iYiIiIiIiIiIiKoQBn2JiIiIiIiIiIiIqpCkcePGFZlpZGZmminHhg0bzBQRERERERERERERVQbs6UtERERERERERERUhTDoS0RERERERERERFSFMOhLREREREREREREVIUw6EtERERERERERERUhTDoS0RERERERERERFSFMOhLREREREREREREVIUw6EtERERERERERERUhTDoS0RERERERERERFSFMOhLREREREREREREVIUw6EtERERERERERERUhTDoS0RERERERERERFSFMOhLREREREREREREVIUw6EtERERERERERERUhTDoS0RERERERERERFSFMOhLREREREREREREVIUw6EtERERERERERERUhTDoS0RERERERERERFSFMOgbg3ofNkf6HFOolHbgg2e+R6vh8zDbzKm0fp2nXoe8FpXGrzMzK7bZ4xPb9s72ZuKDbWYGERERERERERGRS9K4ceOKzDQyMzPNlGPDhg1mKk5zvsJz52wyBeXP/XDb8MPUxDbMvPFTTP/Ema2d3QmXv9wXqWpy24cfYMyq7mZZD+82lcM+vgJDepnCxhkYc8yvag+G2e62kW9g4hNmnkvIumFIsLfBZwew98xkJGcUoMY5NXBg1iZsbWEWCMd7LErqC2fh8vPVqyxWVw/9Zv0Ofew2PfWB9bAME1tNx7ZA2bQlgu0XTdY3M9Hz/RRMGNkDvc28ykq/ls0tsD6ztZlTliRovgBrhxyP2zqZWS7RjkWCtOd+Xz+x7S7B73/n4l/39sHvYjn5RERERERERER0yEh80FcHLXfguPWnonjo1glUZt/oH3CNGvR9uaF/gNMEhCMGciMeVwQb09D8mBRUOzsXO1/eit1mdkSR9uWp06/5s1bmdTmBXQReh7uspm9cCRzZEMcNV8uq7Ux8Zwe2LW6IITEGfauSyhT0JSIiIiIiIiIiKk+JH95h446QHq7lYdk3m3SP2Gg9d+MlPX1b3g/sfyEfuTeqcquWCR/mITWjHvCJ02bbPpyPZX/u53odh+G4F+qp17dMtes2tUxDHNFuB5ZvVMv+tANNT2poliulbUtxvR0yodjQCevwnGv+9d/sMPOdHqzPfeNa95mlyDJ1QoKhge2FDG8gQdSZ+OBX/3VD1wvdZ2k4wyLY5BkewdMGz/3qzHaOZQH+uBp47N+edc06Pd/PA75fHVg3cLzubXraRtepeR+4jsnuU3MPY2FSotqBiIiIiIiIiIiqtsQHfXudiiF/3oSJrd7AczfO8A0ALztH1Ul9hGV8ffIrxtj1VJqoA7DbsH2xBE8T39d19/mbsOHlrchXzZSMrdi0fgOyYg4smzYIOdbiJGCNP7d3ev2u2o3UdqGvQweFF0vA15SPbYjsn5Zh+aqG6NgrFakmYFxy6/Dcg9nofvPxWD9SpZvrA22bYq7utSrB2Y1oc6+pG9kNQ2YvDQmWPvb+DgzR9d3wL2TjbRu4/HWe0/tVryfbBc4NGYM3D3+cCPzTbNe9bvpJfYLrjWyL7u+vLv14uNuW4qV16nUFtuseFkHaYD9ucu0T/3aC1M6xqONTs0bYNrLrph6BUao894KawPFtTd3xGGWD8aZet6mf1dn4I8x6apnHJprAsASE9dANzvbs9gPbJSIiIiIiIiIiiqBMvsjtsOFX4Lb1V+DyM9c7QdqRy0yNQ4ZhkHqd4hmaQMbpteup5PSI3YZs9xjBZUCCv7EHe63mGFLsWK1gQHgi7HjHMWrRF0esmo7sk8pwSIfV+7FW8m2bMXF1Hv74oO1tKj1e87A2Wy+lDbngCBM8bYiM1sD8zU5v1NnzdoX0fm31b1Vetzekt+uIIUcgXU81xO/ucA2dENLLdTUeQy7WlC6yDaTWQffV2ejp9wVov25T+9iFcxO9z6jqY4IdEqJpLQyx7e7H03ZEREREREREREThlEnQ10o9/3e4bX0/HPbEfMzcaGYmXCqang1sK/sIXQKZgPCsTkh9YjrGfOgce2q7eti2KvR1bFuzGzgyFakybIbkap4E1RM3lEVrHH+8a+gC3cPU9YVj0uvX9GC1yW9cWz/BnrEm3WGDvJGsw3P/3uVaty1GmJrSaY3b9PaOAP7nvNaQ4RRcPXWddBC/IC21GYa0DQbb9ZfvxdR2REREREREREREZRz01fRYtGUpFX1ubI5tt3xdhoHlMtKiL477M7Dts2W6jVKPbYVUd4BcvqztFqDfxXF99Vx8Ig17YHrH/rUEY8m2aVYTj5khEuKybS/moybaNHWKWd9sxGPOZII4vYplyATbK1n3sv1+dWgQOERoL2av9GYpie2J++tq/LG1OwjtCsITERERERERERFFkTRu3LgiM43MzEwz5diwYYOZit22Dz/AmFt2m5Koh36zfoc+LWR6G2be+Cmmu4djkCEbzBAPxdd1hoLQvVrnfIXnztnkzDQCdcJb79qutnEGxhyzA8etP1WPn1umIu2rWN0yTGw1HQjzOkNe/zftPUNByLrz0TTQviUjX3B27vemoNXEv+41wV8ZX/bBbEx0KpT6mGCCkLLeS826Bcaa9Su7tzvkAlsnYwUvwNoh/r2GQ9Y7vin+tW4HcKVzPPLFavqL09ykl64dJiEcGTJChpiwpAezu/dstPqQdnC1j+a8HvmyNxF4nd5tCrtdvT0ZR9gEdEPKodtzBNudiIiIiIiIiIgokoQHfamS8QYfFR10lS8YixZIpbIhweKJtVxBZycIPLF3MKBOREREREREREQUTtkP70AVW/Z+Vy9esQNr1gFDmtU3ZSpvWZtzzZS1C2tXA92bMeBLRERERERERETRsacvFRuGIabhEioY32EfrEr3eooP7xAcGoOIiIiIiIiIiCiyhAd9W7VqhfXr11eanIiIiIiIiIiIiKgqYU9fIiIiIiIiIiIioiqEY/oSERERERERERERVSEM+hIRERERERERERFVIQz6EhEREREREREREVUhDPoSERERERERERERVSEM+hIRERERERERERFVIQz6EhEREREREREREVUhDPoSERERERERERERVSEM+hIRERERERERERFVIQz6EhEREREREREREVUhDPoSERERERERERERVSEM+hIRERERERERERFVIQz6EhEREREREREREVUhDPoSERERERERERERVSEM+hIRERERERERERFVIUnjxo0rMtPIzMw0U44Fy9eZKSIiIiIiIiIiIiKqDNjTl4iIiIiIiIiIiKgKYdCXiIiIiIiIiIiIqAph0JeIiIiIiIiIiIioCmHQl4iIiIiIiIiIiKgKYdCXiIiIiIiIiIiIqAph0JeIiIiIiIiIiIioCmHQl4iIiIiIiIiIiKgKYdCXiIiIiIiIiIiIqApJGjduXJGZRmZmpplyLFi+zkz527VjO2b98A3WrV1j5oTXuk0Gjul/Euo3bGzmEBEREREREREREVGilSroO/Wzj3BM717o16+fmRPe9OnTMWv2HAw68zwzJ4pNH+KOE27FJFMMGP4h5v+xtynEazZeOex8PK+mBg+/BZNG1sWYZbfiqJ+fR/eLUHzaWan09DYfVxNn4rHvXsGQ5s5sa8XXM/DYalMIUQNXnNcTJzQ0xYCd+O6jJZjbvjNu7QHXdANT70/vB63x8oCWZo4/93KxrhO7bEy8tRdGfKYm/c6l67zf+u5a3HC0M9sql7aKcgyJP58xWrMIN04DRgzrgg5mlq8dy/H8RzvRs0T72oB3R6/DV6YU7ph3zJuLu34+YEpAt6M9bRrrMURpy1/+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sn5+Ht1fa4Opz5+PJmbWoW7Lxzdg0Oobi4/RvOlD3HHCWly17NbgF/QdFAfnfEovzMfQuoINERC7HWukB2nLOANjs/HKYS+j9XfF/0Dzy7/a4L9t54R+eSNVMof6+Y3wLCEiIiIiIiIqI6Xq6XtM/5N0IHfEiBFRkywny1cdEsi4ARPtmL5mKInW5fHFbkQVVMO4A75ERERERERERJRopQr61m/YWPfcveKGW6MmWU6Wrzp644JngBEntIltKInPVBu4g8SHLOn11gaD7og0APLjuFy16Ss/m2J5k97Gh/WKPEYzz2diSK/pw87H86boZ5IMoXLrh9hiylSJHOrnN5ZnCREREREREVEZKNXwDkRERERERERERERUsVSxL3IjIiIiIiIiIiIiOrQx6EtERERERERERERUhYQN+hYWFqJmjeqmRERERERERERERESVQdigb7Vq1VA7pYYpEREREREREREREVFlEHF4h4b16rC3LxEREREREREREVElEjHo26BubbRq2hgN69U2c4iIiIiIiIiIiIioIksaN25ckZlGZmammSIiIiIiIiIiIiKiyihiT18iIiIiIiIiIiIiqlwY9CUiIiIiIiIiIiKqQhj0JSIiIiIiIiIiIqpCGPQlIiIiIiIiIiIiqkIY9CUiIiIiIiIiIiKqQhj0JSIiIiIiIiIiIqpCGPQlIiIiIiIiIiIiqkIY9CUiIiIiIiIiIiKqQhj0JSIiIiIiIiIiIqpCGPQlIiIiIiIiIiIiqkKSxo0bV2SmkZmZaaZC5eXlITc3F/n5+WYOEREREcWrevXqSElJQc2aNc0cIiIiIiKixEvOzMy830yja9euZipo7969OhUUFOhyUZETI2bOnDlz5syZM2ceXy7vpw4cOKDLNWrU0POIiIiIiIgSLWLQV3r3SsCXiIiIiBJHPj2VnJyse/4SERERERElWsSg7549ewI9fImIiIgocaS3b61atUyJiIiIiIgocSJ+kZt8/JCIiIiIEo/vs4iIiIiIqKxE/CK3rKwsM0VEREREiZaenm6miIiIiIiIEodBXyIiKpWNGzdi1apVyMvLM3OIKo+aNWuiXbt2aNGihZlTvhj0JSIiIiKishAx6Lt582YzRURE5O/HH3/EiSeeiNTUVDOHqPLYtm0bvv32Wxx33HFmTvlq1qyZmSIiIiIiIkqcqEFf+ZIR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qZkqP19++SV69+6Nfv36mTnhTZ8+XY8Retppp5k5FGLjz5j2az66/u4S9MQyrNtu5lOVs2bNGgwePNiUKrdJkyYhIyPDlKgy+OWXX4r9/CCqTMaPH4+jjjrKlMrXEUccYaaIiIiIiIgSp8IFfXfu3Ikff/wRa9euNXPCa9OmDY477jg0aNDAzKEQDPoeMhj0pYOJQV+q7Bj0JSIiIiKiqiZZ/aJ+v5lG165dzZRjy5bgMAPlldesWRMdO3bE0UcfjV69ekXMZTlZXsS6/UMq370Zq7cWIv3IbmhRtAU79sW4HvNKl8sfSzp0iO0LCSu6FStWoH79+no61tfP/ODmmzdvLvbzg6gyWbRoEdLTnYEzYr3uE5U3adJE50RERERERIkU9YvcmFfiXP8roizHvErkVU2sr5t5xciJqoJYr/dE50RERERERIkWNejLVLmT5VfHVHVSVeP3GpkqbiKqCvyu7fJIREREREREZSFi0FfYX0iYV848KLblmVfOvKqJ9XUzrxg5UVUQ6/We6JyIiIiIiKgsRAz6FhYW6l9KmFfS3P37ZCzLM6+0efXq1fW4vpWdvAZ5LbG+buYVIyeqCmK93hOdExERERERlYWkcePGBUKD3m9fX7hwoZkioops79692LNnD/Lz882cykkCvnXr1kWdOnXMHKoM5EuwvD8/iCqT8ePHo0uXLqZUvvgliEREREREVBYiBn0XLFige6IkJSUxZ86cOXPmvvnixYsZ9KVKTYK+nTt3jul6T3TerVs3cxRERERERESJE/WL3JgzZ86cOfNIeY0aNbBt2zZdJqps5NqVa1jEcr2XRU5ERERERJRoEXv6zps3z0wRERH5y8nJ0YGzAwcOmDlElYcEfFNTU9GoUSMzp3z16NHDTBERERERESUOg75EREREBwmDvkREREREVBaiBn35zdJEREREiVetWjUGfYmIiIiIqExEHNOX36BPREREVDb4PouIiIiIiMpKcmZm5v1mGl27djVTDvlWaRmrkYiIiIgSq0WLFqhdu7YpERERERERJU7Enr6NGzdGenq6no71G6iZM2fOnDlz5syZR87l/ZV8gRwREREREVFZiDimryXfyp6dnY29e/dyjF8iIiKiEpAxfGVIh6ZNmzLgS0REREREZSqmoC8RERERERERERERVQ4Rh3cgIiIiIiIiIiIiosqFQV8i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\"></p>', 0, 0, '');
INSERT INTO `template` (`id`, `name`, `template`, `is_available`, `is_have_custom_field`, `custom_field`) VALUES
(46, 'customername/plateno', '<p><br></p><p>[Customer Name]</p><p>[Plate No]</p><p>[Customer Name]</p><p>[Plate No]</p>', 1, 1, '1,2'),
(47, 'test1154654654', '<p><br></p><p>[Customer Name] [Plate No]</p><p>[Customer Name]</p><p>[Plate No]</p>', 1, 1, '1,2');

-- --------------------------------------------------------

--
-- Table structure for table `template_field`
--

CREATE TABLE `template_field` (
  `id` int(11) NOT NULL,
  `field_name` varchar(150) NOT NULL,
  `field_key` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `template_field`
--

INSERT INTO `template_field` (`id`, `field_name`, `field_key`) VALUES
(1, 'Customer Name', 'customer_name'),
(2, 'Plate No', 'plate_no');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `account`
--
ALTER TABLE `account`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `car_size`
--
ALTER TABLE `car_size`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `size` (`size`),
  ADD UNIQUE KEY `size_2` (`size`),
  ADD UNIQUE KEY `size_3` (`size`);

--
-- Indexes for table `channel`
--
ALTER TABLE `channel`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `channel_schedule`
--
ALTER TABLE `channel_schedule`
  ADD KEY `channel_id` (`channel_id`);

--
-- Indexes for table `channel_service`
--
ALTER TABLE `channel_service`
  ADD KEY `channel_id` (`channel_id`),
  ADD KEY `service_id` (`service_id`);

--
-- Indexes for table `customer_car`
--
ALTER TABLE `customer_car`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `plate_no` (`plate_no`),
  ADD KEY `customer_id` (`customer_id`),
  ADD KEY `size_id` (`size_id`),
  ADD KEY `province_id` (`province_id`);

--
-- Indexes for table `customer_user`
--
ALTER TABLE `customer_user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `phone` (`phone`);

--
-- Indexes for table `general_setting`
--
ALTER TABLE `general_setting`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `holiday`
--
ALTER TABLE `holiday`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `module`
--
ALTER TABLE `module`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `module_permission`
--
ALTER TABLE `module_permission`
  ADD KEY `module_id` (`module_id`),
  ADD KEY `permission_id` (`permission_id`);

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
-- Indexes for table `permission`
--
ALTER TABLE `permission`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `province`
--
ALTER TABLE `province`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `province` (`province`);

--
-- Indexes for table `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `role_permission`
--
ALTER TABLE `role_permission`
  ADD KEY `role_id` (`role_id`),
  ADD KEY `module_id` (`module_id`),
  ADD KEY `permission_id` (`permission_id`);

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
  ADD UNIQUE KEY `name` (`name`),
  ADD KEY `car_size_id` (`car_size_id`);

--
-- Indexes for table `staff_service`
--
ALTER TABLE `staff_service`
  ADD KEY `staff_id` (`staff_id`),
  ADD KEY `service_id` (`service_id`);

--
-- Indexes for table `staff_user`
--
ALTER TABLE `staff_user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_staff_user_username` (`username`);

--
-- Indexes for table `status`
--
ALTER TABLE `status`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_status_code_group` (`code`,`status_group_id`),
  ADD KEY `status_group_id` (`status_group_id`);

--
-- Indexes for table `status_group`
--
ALTER TABLE `status_group`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Indexes for table `template`
--
ALTER TABLE `template`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `template_field`
--
ALTER TABLE `template_field`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `account`
--
ALTER TABLE `account`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `car_size`
--
ALTER TABLE `car_size`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=161;

--
-- AUTO_INCREMENT for table `channel`
--
ALTER TABLE `channel`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `customer_car`
--
ALTER TABLE `customer_car`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `customer_user`
--
ALTER TABLE `customer_user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- AUTO_INCREMENT for table `general_setting`
--
ALTER TABLE `general_setting`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `holiday`
--
ALTER TABLE `holiday`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `module`
--
ALTER TABLE `module`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `on_leave`
--
ALTER TABLE `on_leave`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

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
-- AUTO_INCREMENT for table `permission`
--
ALTER TABLE `permission`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `province`
--
ALTER TABLE `province`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=78;

--
-- AUTO_INCREMENT for table `role`
--
ALTER TABLE `role`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=110;

--
-- AUTO_INCREMENT for table `search_filter`
--
ALTER TABLE `search_filter`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `service`
--
ALTER TABLE `service`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `staff_user`
--
ALTER TABLE `staff_user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=63;

--
-- AUTO_INCREMENT for table `status`
--
ALTER TABLE `status`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `status_group`
--
ALTER TABLE `status_group`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `template`
--
ALTER TABLE `template`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT for table `template_field`
--
ALTER TABLE `template_field`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `channel_schedule`
--
ALTER TABLE `channel_schedule`
  ADD CONSTRAINT `channel_schedule_ibfk_1` FOREIGN KEY (`channel_id`) REFERENCES `channel` (`id`);

--
-- Constraints for table `channel_service`
--
ALTER TABLE `channel_service`
  ADD CONSTRAINT `channel_service_ibfk_1` FOREIGN KEY (`channel_id`) REFERENCES `channel` (`id`),
  ADD CONSTRAINT `channel_service_ibfk_2` FOREIGN KEY (`service_id`) REFERENCES `service` (`id`);

--
-- Constraints for table `customer_car`
--
ALTER TABLE `customer_car`
  ADD CONSTRAINT `customer_car_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customer_user` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `customer_car_ibfk_2` FOREIGN KEY (`size_id`) REFERENCES `car_size` (`id`),
  ADD CONSTRAINT `customer_car_ibfk_3` FOREIGN KEY (`province_id`) REFERENCES `province` (`id`);

--
-- Constraints for table `module_permission`
--
ALTER TABLE `module_permission`
  ADD CONSTRAINT `module_permission_ibfk_1` FOREIGN KEY (`module_id`) REFERENCES `module` (`id`),
  ADD CONSTRAINT `module_permission_ibfk_2` FOREIGN KEY (`permission_id`) REFERENCES `permission` (`id`);

--
-- Constraints for table `on_leave`
--
ALTER TABLE `on_leave`
  ADD CONSTRAINT `fk_on_leave_approved_by_id` FOREIGN KEY (`approved_by_id`) REFERENCES `staff_user` (`id`),
  ADD CONSTRAINT `fk_on_leave_on_leave_type_id` FOREIGN KEY (`on_leave_type_id`) REFERENCES `on_leave_type` (`id`),
  ADD CONSTRAINT `fk_on_leave_staff_id` FOREIGN KEY (`staff_id`) REFERENCES `staff_user` (`id`);

--
-- Constraints for table `role_permission`
--
ALTER TABLE `role_permission`
  ADD CONSTRAINT `role_permission_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`),
  ADD CONSTRAINT `role_permission_ibfk_2` FOREIGN KEY (`module_id`) REFERENCES `module` (`id`),
  ADD CONSTRAINT `role_permission_ibfk_3` FOREIGN KEY (`permission_id`) REFERENCES `permission` (`id`);

--
-- Constraints for table `service`
--
ALTER TABLE `service`
  ADD CONSTRAINT `service_ibfk_1` FOREIGN KEY (`car_size_id`) REFERENCES `car_size` (`id`);

--
-- Constraints for table `staff_service`
--
ALTER TABLE `staff_service`
  ADD CONSTRAINT `staff_service_ibfk_1` FOREIGN KEY (`staff_id`) REFERENCES `staff_user` (`id`),
  ADD CONSTRAINT `staff_service_ibfk_2` FOREIGN KEY (`service_id`) REFERENCES `service` (`id`);

--
-- Constraints for table `status`
--
ALTER TABLE `status`
  ADD CONSTRAINT `status_ibfk_1` FOREIGN KEY (`status_group_id`) REFERENCES `status_group` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
