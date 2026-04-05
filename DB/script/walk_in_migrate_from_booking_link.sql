-- รันครั้งเดียวถ้าเคยสร้าง walk_in แบบมี booking_id แล้วต้องการย้ายมาโครงใหม่
SET FOREIGN_KEY_CHECKS = 0;

-- ลบ FK/index/column booking_id ถ้ามี (ชื่อ FK อาจต่าง — ตรวจใน information_schema ถ้า error)
-- ALTER TABLE walk_in DROP FOREIGN KEY fk_walk_in_booking;
ALTER TABLE walk_in DROP INDEX uk_walk_in_booking;
ALTER TABLE walk_in DROP COLUMN `booking_id`;

-- เพิ่มคอลัมน์ใหม่ถ้ายังไม่มี (ถ้ามีอยู่แล้วให้ข้ามบรรทัดที่ error)
ALTER TABLE walk_in ADD COLUMN `branch_name` VARCHAR(100) NULL COMMENT 'สำเนาชื่อสาขา' AFTER `end_service_datetime`;
ALTER TABLE walk_in ADD COLUMN `processing_status` VARCHAR(32) NOT NULL DEFAULT 'pending' AFTER `branch_name`;
ALTER TABLE walk_in ADD KEY `idx_walk_in_status` (`processing_status`);

SET FOREIGN_KEY_CHECKS = 1;
