# ตั้งค่า LINE Login (ล็อกอินผ่าน LINE)

## ขั้นตอนที่ 1: สร้าง Provider (ทำครั้งเดียว)

1. เปิด **[LINE Developers Console](https://developers.line.biz/console/)**
2. ล็อกอินด้วยบัญชี LINE
3. ถ้ายังไม่มี Provider ให้กด **Create** สร้าง Provider (ตั้งชื่อ เช่น "My Company")

---

## ขั้นตอนที่ 2: สร้าง LINE Login Channel

1. ในหน้า Console เลือก Provider ของคุณ
2. กด **Create a new channel**
3. เลือก **LINE Login** (ไม่ใช่ Messaging API)
4. กรอกข้อมูล:
   - **Channel name:** ชื่อแอป/เว็บ (เช่น "CarCare Login")
   - **Channel description:** คำอธิบายสั้นๆ (ถ้ามี)
   - **App types:** ติ๊ก **Web app**
   - **Channel type:** เลือก **Public** หรือ **Private** ตามต้องการ
5. กด **Create** แล้วยอมรับข้อกำหนดการใช้งาน

---

## ขั้นตอนที่ 3: ดู Channel ID และ Channel secret

1. เข้าไปที่ channel ที่สร้างไว้
2. แท็บ **Basic settings**
3. คัดลอก:
   - **Channel ID** → ใช้ใส่ใน `LINE_CHANNEL_ID`
   - กด **Issue** ข้าง **Channel secret** แล้วคัดลอก → ใช้ใส่ใน `LINE_CHANNEL_SECRET`

---

## ขั้นตอนที่ 4: ตั้งค่า Callback URL

1. ใน channel เดิม ไปที่แท็บ **LINE Login** (เมนูซ้าย)
2. หัวข้อ **Callback URL**
3. กด **Edit** แล้วเพิ่ม URL ตามสภาพการใช้งาน:

   | สภาพ | Callback URL ตัวอย่าง |
   |------|------------------------|
   | รันบนเครื่องตัวเอง | `http://localhost:5000/customer/line/callback` |
   | Deploy แล้ว (มี domain) | `https://your-api.com/customer/line/callback` |

4. **สำคัญ:** URL ต้องตรงกับที่ backend ใช้ทุกตัวอักษร (รวม `http`/`https` และ port)
5. กด **Update**

---

## ขั้นตอนที่ 5: ใส่ค่าในโปรเจกต์ (node-api/.env)

เปิดไฟล์ `node-api/.env` แล้วใส่ (หรือเอา `#` ออกจากบรรทัดแล้วแก้ค่า):

```env
LINE_CHANNEL_ID=ใส่ Channel ID จากขั้นตอนที่ 3
LINE_CHANNEL_SECRET=ใส่ Channel secret จากขั้นตอนที่ 3
LINE_CALLBACK_URL=http://localhost:5000/customer/line/callback
CUSTOMER_WEB_URL=http://localhost:3001
```

- **LINE_CALLBACK_URL** ต้องเหมือนกับที่ใส่ใน LINE Developers (ขั้นตอนที่ 4) ทุกอย่าง
- **CUSTOMER_WEB_URL** = URL หน้าเว็บลูกค้า (ที่แสดงปุ่ม Login ผ่าน LINE)  
  - รัน local: `http://localhost:3001`  
  - Deploy: `https://your-customer-web.com`

---

## ขั้นตอนที่ 6: รีสตาร์ท node-api

หลังแก้ `.env` ให้รัน node-api ใหม่ (หยุดแล้ว `npm run dev` หรือ `node server.js` อีกครั้ง)

---

## สรุป Checklist

- [ ] สร้าง channel แบบ **LINE Login** (ไม่ใช่ Messaging API)
- [ ] คัดลอก **Channel ID** และ **Channel secret** ไปใส่ใน `.env`
- [ ] ใส่ **Callback URL** ใน LINE Developers ให้ตรงกับ `LINE_CALLBACK_URL` ใน `.env`
- [ ] ใส่ `CUSTOMER_WEB_URL` ใน `.env` ให้ตรงกับ URL หน้าเว็บลูกค้า
- [ ] รีสตาร์ท node-api

ถ้าตั้งค่าถูกต้อง กดปุ่ม "Login ผ่าน LINE" ในหน้า Login ลูกค้าจะไปหน้า LINE ให้ยืนยันตัวตน แล้วกลับมาเข้าเว็บได้
