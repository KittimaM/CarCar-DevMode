# อธิบายการแก้ Worst Case (phone และ line_id เป็น null ทั้งคู่) ในโค้ด

**Worst case:** แถวในตาราง `customer_user` มีทั้ง `phone` และ `line_id` เป็น null → ลูกค้าคนนั้นล็อกอินด้วยเบอร์ก็ไม่ได้ (ไม่มี phone ให้ค้น) ล็อกอินด้วย LINE ก็ไม่ได้ (ไม่มี line_id ให้ค้น)

วิธีแก้คือ **ไม่ให้เกิดแถวแบบนั้น** และ **เช็กก่อนใช้** ใน 3 จุดหลัก

---

## 1. ล็อกอินด้วยเบอร์ + รหัสผ่าน (CustomerLogin.js)

**ไฟล์:** `Controller/Customer/CustomerLogin.js`

```javascript
if (!phone || String(phone).trim() === "") {
  return res.json({ status: "ERROR", msg: "Wrong username or password" });
}
Conn.execute("SELECT * FROM customer_user WHERE phone = ?", [phone.trim()], ...);
```

**ทำอะไร:**
- ถ้าไม่ส่งเบอร์โทรมา หรือส่งมาเป็นค่าว่าง → **ไม่ไปค้นใน DB** และตอบว่า "Wrong username or password"
- ค้นเฉพาะเมื่อมีค่าเบอร์แล้ว: `WHERE phone = ?`
- ดังนั้น **เราไม่เคยใช้ null/ค่าว่างไปค้น** → แถวที่ phone เป็น null จะไม่ถูกเลือกจากช่องทางนี้อยู่แล้ว

**ผลกับ worst case:** แถวที่ทั้ง phone และ line_id เป็น null จะไม่มีทางล็อกอินทางเบอร์ได้ (เพราะไม่มีเบอร์ให้ใส่)

---

## 2. ล็อกอินผ่าน LINE (CustomerLineLogin.js)

**ไฟล์:** `Controller/Customer/CustomerLineLogin.js`

### 2.1 เช็กว่าได้ line_id จาก LINE จริง

```javascript
if (!lineUserId) {
  return res.redirect(`${customerWebUrl}/?error=LINE_USER_ID_MISSING`);
}
```

**ทำอะไร:** ถ้า LINE ไม่ส่ง userId มา → ไม่สร้าง/ไม่หาผู้ใช้ และ redirect กลับไปหน้า login พร้อม error

### 2.2 หาผู้ใช้ด้วย line_id

```javascript
Conn.execute(
  "SELECT id, name, phone FROM customer_user WHERE line_id = ?",
  [lineUserId],
  ...
);
```

**ทำอะไร:** หาผู้ใช้จาก **line_id** เท่านั้น (ไม่ใช้ phone)
- ถ้ามีแถวที่ line_id ตรง → ล็อกอินได้
- ถ้าไม่มี (รวมถึงแถวที่ทั้ง phone และ line_id เป็น null) → ไม่มีแถวตรง → ไปขั้นสร้างผู้ใช้ใหม่

### 2.3 สร้างผู้ใช้ใหม่จาก LINE

```javascript
Conn.execute(
  "INSERT INTO customer_user (phone, name, password, line_id) VALUES (?, ?, ?, ?)",
  [null, name, hash, lineUserId],
  ...
);
```

**ทำอะไร:** สร้างแถวใหม่โดย
- **phone = null**
- **line_id = lineUserId** (จาก LINE เสมอ)
- ดังนั้น **ผู้ใช้ที่สร้างจาก LINE จะมี line_id ไม่เป็น null เสมอ** → ไม่เกิดแถวที่ทั้ง phone และ line_id เป็น null จากช่องทางนี้

**ผลกับ worst case:**
- แถวที่ทั้ง phone และ line_id เป็น null จะไม่มีทางล็อกอินทาง LINE ได้ (เพราะค้นด้วย line_id ไม่ตรง)
- แถวใหม่ที่สร้างจาก LINE จะมี line_id เสมอ จึงไม่เพิ่ม worst case

---

## 3. แก้ไข Profile (CustomerUpdateProfile.js)

**ไฟล์:** `Controller/Customer/CustomerProfile.js`

```javascript
Conn.execute("SELECT line_id FROM customer_user WHERE id = ?", [id], function (err, rows) {
  const hasLineId = rows && rows.length > 0 && rows[0].line_id != null;
  const phoneVal = phone === "" || phone == null ? null : phone;
  const sql = hasLineId
    ? "UPDATE customer_user SET name = ? WHERE id = ?"
    : "UPDATE customer_user SET phone = ?, name = ? WHERE id = ?";
  const params = hasLineId ? [name, id] : [phoneVal, name, id];
  ...
});
```

**ทำอะไร:**
- ถ้าผู้ใช้คนนี้ **มี line_id** (ล็อกอินผ่าน LINE) → อัปเดตเฉพาะ **name** ไม่แตะ **phone**
  - เหตุผล: ไม่ให้ไปทำให้ phone กลายเป็น null โดยไม่ตั้งใจ แล้วกลายเป็นแถวที่ทั้ง phone และ line_id เป็น null
- ถ้า **ไม่มี line_id** (ล็อกอินด้วยเบอร์) → อัปเดตได้ทั้ง **phone** และ **name**
  - ถ้าผู้ใช้ลบเบอร์ (ส่งค่าว่าง) จะได้ phone = null ได้ แต่คนนั้นยังมี line_id ไม่ได้ → แถวที่ไม่มี line_id อยู่แล้ว ถ้า phone กลายเป็น null ก็ยังล็อกอินทาง LINE ไม่ได้อยู่ดี (ไม่สร้าง worst case ใหม่ถ้าเดิมไม่มี line_id)

**ผลกับ worst case:** ลดโอกาสที่แถวที่มี line_id อยู่แล้ว ถูกอัปเดตจน phone เป็น null แล้วกลายเป็น “ทั้งคู่เป็น null” โดยไม่ตั้งใจ

---

## สรุปสั้นๆ

| จุดในโค้ด | วิธีแก้ worst case |
|-----------|---------------------|
| **CustomerLogin** | ไม่ยอมให้ค้นด้วย phone ว่าง → แถวที่ phone เป็น null ไม่มีทางล็อกอินทางเบอร์ |
| **CustomerLineLogin** | (1) บังคับว่าต้องมี lineUserId (2) หาผู้ใช้ด้วย line_id เท่านั้น (3) สร้างผู้ใช้ใหม่จาก LINE จะใส่ line_id เสมอ → ไม่สร้างแถวที่ทั้งคู่เป็น null |
| **CustomerUpdateProfile** | ถ้ามี line_id จะอัปเดตแค่ name ไม่แก้ phone → ไม่ให้แถว LINE กลายเป็น phone null โดยไม่ตั้งใจ |

รวมแล้ว: เรา **ไม่สร้าง** แถวที่ทั้ง phone และ line_id เป็น null และ **ไม่ให้ล็อกอิน** ด้วยค่าว่าง จึงป้องกัน worst case ไว้ในโค้ด
