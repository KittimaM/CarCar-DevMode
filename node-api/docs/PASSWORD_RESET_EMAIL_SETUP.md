# คู่มือตั้งค่าส่งอีเมลรีเซ็ตรหัสผ่าน (ภาษาไทย)

เมื่อลูกค้ากด "ลืมรหัสผ่าน" แล้วกรอกอีเมล ระบบจะส่งอีเมลที่มีลิงก์ให้กดไปตั้งรหัสใหม่ การตั้งค่ามี 2 ส่วนหลัก

---

## สารบัญ

1. [RESET_BASE_URL](#1-reset_base_url)
2. [SMTP – การส่งอีเมล](#2-smtp--การส่งอีเมล)
3. [ตัวอย่างการตั้งค่าใน .env](#3-ตัวอย่างการตั้งค่าใน-env)
4. [ทดสอบการทำงาน](#4-ทดสอบการทำงาน)
5. [แก้ปัญหาเบื้องต้น](#5-แก้ปัญหาเบื้องต้น)
6. [ขึ้น Production – ตั้งค่า SMTP อย่างไร](#6-ขึ้น-production--ตั้งค่า-smtp-อย่างไร)

---

## 1. RESET_BASE_URL

**คืออะไร**  
URL หน้าเว็บฝั่งลูกค้า (customer-web) ที่จะนำไปใส่ในลิงก์ในอีเมล เช่น  
`http://localhost:3001/customer/reset-password?token=xxx`

**ตั้งค่าอย่างไร**

| สถานการณ์ | ค่าที่ใส่ |
|-----------|-----------|
| รันบนเครื่องตัวเอง (พัฒนา) | `http://localhost:3001` |
| ทดสอบด้วย ngrok / tunnel | `https://xxxx.ngrok.io` (ตาม URL ที่ได้) |
| ขึ้น production จริง | `https://your-domain.com` (ไม่มี slash ปิดท้าย) |

**ขั้นตอน**

1. เปิดไฟล์ `node-api/.env`
2. หาบรรทัด `# RESET_BASE_URL=...`
3. ลบ `#` ด้านหน้า แล้วใส่ URL ให้ตรงกับสภาพที่รัน เช่น  
   `RESET_BASE_URL=http://localhost:3001`
4. บันทึกไฟล์ แล้ว restart node-api

**หมายเหตุ:** ถ้าไม่ตั้งค่า ระบบจะใช้ค่า default เป็น `http://localhost:3001`

---

## 2. SMTP – การส่งอีเมล

ถ้า**ไม่ตั้งค่า SMTP** ระบบจะยังสร้างลิงก์รีเซ็ตรหัสได้ แต่จะ**ไม่ส่งอีเมล** และจะ**พิมพ์ลิงก์นั้นใน console ของ node-api** ให้ copy ไปเปิดในเบราว์เซอร์ทดสอบได้

ถ้าต้องการให้**ส่งอีเมลจริง** ต้องตั้งค่า SMTP ใน `.env` ดังนี้

### ตัวแปรที่ใช้

| ตัวแปร | ความหมาย | ตัวอย่าง |
|--------|----------|----------|
| `SMTP_HOST` | ที่อยู่เซิร์ฟเวอร์เมล (host) | `smtp.gmail.com` |
| `SMTP_PORT` | พอร์ต | `587` (TLS) หรือ `465` (SSL) |
| `SMTP_USER` | อีเมลที่ใช้ล็อกอินส่ง | `yourname@gmail.com` |
| `SMTP_PASS` | รหัสผ่านหรือ App Password | รหัสที่ได้จากบัญชี |
| `SMTP_SECURE` | ใช้ SSL หรือไม่ | `false` สำหรับพอร์ต 587, `true` สำหรับ 465 |
| `RESET_EMAIL_FROM` | (ไม่บังคับ) อีเมล/ชื่อที่แสดงเป็นผู้ส่ง | `noreply@yoursite.com` |

---

### หา SMTP ยังไง / มีค่าใช้จ่ายไหม

**SMTP server** คือที่อยู่ (host + port) ที่ใช้ส่งอีเมล มีทั้งแบบ **ฟรี** และแบบ **เสียเงิน** ตามการใช้งาน

| แหล่ง | ค่าใช้จ่าย | ข้อดี / ข้อจำกัด | Host (ตัวอย่าง) |
|-------|------------|-------------------|------------------|
| **Gmail** | ฟรี | ใช้ได้ทันที มีขีดจำกัด ~500 ฉบับ/วัน ต้องเปิด 2-Step Verification + App Password | `smtp.gmail.com` พอร์ต 587 |
| **Outlook / Microsoft 365** | ฟรี (บัญชีส่วนตัว) | คล้าย Gmail ต้องใช้ App password | `smtp-mail.outlook.com` พอร์ต 587 |
| **SendGrid** | ฟรี 100 ฉบับ/วัน แล้วมีแผนเสียเงิน | เหมาะ production ส่งเยอะ ไม่ค่อยติด spam | `smtp.sendgrid.net` พอร์ต 587, User = `apikey`, Pass = API Key |
| **Mailgun** | ฟรีช่วงทดสอบ แล้วมีแผนเสียเงิน | เหมาะแอป/เว็บส่งเมลจำนวนมาก | ดูใน Dashboard → Sending → SMTP credentials |
| **AWS SES** | ฟรีช่วงทดสอบ แล้วคิดตามจำนวนเมล | เสถียร ราคาต่อฉบับถูกเมื่อส่งเยอะ | ต้องสร้าง SMTP credentials ใน AWS Console |
| **เมลของ hosting** | ขึ้นกับแพ็กเกจ | บางเจ้าให้ SMTP กับโดเมนตัวเอง (เช่น cPanel) | ดูในคู่มือหรือถามฝ่าย support |

**วิธีหา SMTP ของแต่ละที่**

- **Gmail / Outlook:** ใช้ค่าตารางด้านบน หรือค้นในเน็ตว่า "Gmail SMTP settings" / "Outlook SMTP settings"
- **SendGrid / Mailgun / AWS SES:** หลังสมัครและสร้าง API Key หรือ SMTP credentials จะมีหน้าแสดง **SMTP host, port, username, password** ให้ copy ไปใส่ใน `.env`

**สรุป:** ถ้าแค่ทดสอบหรือส่งไม่เกินวันละไม่กี่ร้อยฉบับ ใช้ **Gmail หรือ Outlook (ฟรี)** ได้ ถ้าต้องการส่งเยอะหรือใช้ใน production จริง แนะนำ **SendGrid / Mailgun / AWS SES** (มี free tier แล้วค่อยเสียเงินเมื่อเกิน)

---

### วิธีที่ 1: ใช้ Gmail

**ข้อควรรู้:** Gmail ต้องเปิด "การเข้าสู่ระบบด้วยแอป" และใช้ **รหัสผ่านแอป (App Password)** ไม่ใช้รหัสผ่านเข้าอีเมลปกติ

**ขั้นตอน**

1. **เปิดการยืนยันตัวตน 2 ขั้นตอน (2-Step Verification)**  
   - ไปที่ [Google Account → Security](https://myaccount.google.com/security)  
   - เปิด **2-Step Verification** ให้เรียบร้อย

2. **สร้างรหัสผ่านแอป (App Password)**  
   - ยังอยู่ที่ Security → **2-Step Verification**  
   - เลื่อนลงหา **App passwords**  
   - เลือก App: **Mail** และ Device: **Other** แล้วตั้งชื่อ เช่น "CarCar Node API"  
   - กดสร้าง จะได้รหัส 16 ตัว (เช่น `abcd efgh ijkl mnop`)  
   - ** copy รหัสนี้ไปใช้ใน `SMTP_PASS`** (ใส่ต่อกันไม่มีช่องว่างได้)

3. **ตั้งค่าใน `.env`**

   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=yourname@gmail.com
   SMTP_PASS=abcdefghijklmnop
   SMTP_SECURE=false
   RESET_EMAIL_FROM=yourname@gmail.com
   ```

   แทน `yourname@gmail.com` และ `abcdefghijklmnop` ด้วยอีเมลและรหัสแอปจริง

4. บันทึก `.env` แล้ว restart node-api

---

### วิธีที่ 2: ใช้ Outlook / Microsoft 365

**ขั้นตอน**

1. ไปที่ [Microsoft Account → Security](https://account.microsoft.com/security)  
2. เปิด **Two-step verification** (ถ้ายังไม่เปิด)  
3. สร้าง **App password**:  
   - Security → Advanced security options → App passwords  
   - สร้างรหัสแล้ว copy ไปใช้ใน `SMTP_PASS`

4. **ตั้งค่าใน `.env`**

   ```env
   SMTP_HOST=smtp-mail.outlook.com
   SMTP_PORT=587
   SMTP_USER=yourname@outlook.com
   SMTP_PASS=รหัสแอปที่ได้
   SMTP_SECURE=false
   RESET_EMAIL_FROM=yourname@outlook.com
   ```

   สำหรับบัญชีองค์กร (@yourcompany.com) อาจใช้  
   `SMTP_HOST=smtp.office365.com` และพอร์ต 587 เช่นกัน (ให้ตรวจกับฝ่าย IT)

---

### วิธีที่ 3: เซิร์ฟเวอร์เมลหรือผู้ให้บริการอื่น

ถ้าใช้เมลของบริษัท หรือผู้ให้บริการ SMTP อื่น (เช่น SendGrid, Mailgun, เซิร์ฟเวอร์เมลของ hosting):

1. ขอจากฝ่าย IT หรือเอกสารของผู้ให้บริการ:
   - **Host (SMTP server)** → ใส่ใน `SMTP_HOST`
   - **Port** → ใส่ใน `SMTP_PORT` (มักเป็น 587 หรือ 465)
   - **Username** → มักเป็นอีเมลเต็ม ใส่ใน `SMTP_USER`
   - **Password** → ใส่ใน `SMTP_PASS`
2. ถ้าใช้พอร์ต **465** ใส่ `SMTP_SECURE=true`  
   ถ้าใช้พอร์ต **587** ใส่ `SMTP_SECURE=false`
3. ใส่ค่าทั้งหมดใน `node-api/.env` แล้ว restart node-api

---

## 3. ตัวอย่างการตั้งค่าใน .env

**กรณีทดสอบบนเครื่องตัวเอง + ส่งอีเมลด้วย Gmail**

เปิด `node-api/.env` แล้วเพิ่มหรือแก้เป็นแบบนี้ (ลบ `#` ด้านหน้าบรรทัดที่ต้องการใช้):

```env
# ลิงก์ในอีเมลจะพาไปที่ customer-web บนเครื่องเรา
RESET_BASE_URL=http://localhost:3001

# Gmail
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=yourname@gmail.com
SMTP_PASS=รหัสผ่านแอป16ตัว
SMTP_SECURE=false
RESET_EMAIL_FROM=yourname@gmail.com
```

**กรณีไม่ต้องการส่งอีเมล (แค่ทดสอบลิงก์)**  
- ไม่ต้องใส่ `SMTP_*` เลย  
- เมื่อมีคนกด "ลืมรหัสผ่าน" แล้วกรอกอีเมล ลิงก์จะถูกพิมพ์ใน **terminal ที่รัน node-api**  
- Copy ลิงก์นั้นไปวางในเบราว์เซอร์เพื่อทดสอบหน้าเปลี่ยนรหัสได้

---

## 4. ทดสอบการทำงาน

1. เปิด customer-web (เช่น `http://localhost:3001`) แล้วไปหน้า Login  
2. กด **Forgot password?**  
3. กรอกอีเมลที่**มีในระบบแล้ว** (เคยสมัครและมี email ใน customer_user)  
4. กดส่ง  
5. **ถ้าตั้ง SMTP แล้ว:** ตรวจสอบกล่องจดหมาย (และถังขยะ) ว่ามีอีเมลและลิงก์  
6. **ถ้าไม่ได้ตั้ง SMTP:** ดูที่ terminal ที่รัน `npm run dev` (node-api) ว่ามีลิงก์ถูกพิมพ์ออกมา  
7. กดลิงก์ (หรือ copy จาก console) แล้วตั้งรหัสผ่านใหม่ จากนั้นลองล็อกอินด้วยรหัสใหม่

---

## 5. แก้ปัญหาเบื้องต้น

| อาการ | สาเหตุที่เป็นไปได้ | แนวทางแก้ |
|--------|---------------------|-----------|
| ไม่มีอีเมลส่ง / ไม่มีลิงก์ใน console | อีเมลที่กรอกไม่มีในตาราง `customer_user` หรือคอลัมน์ `email` ว่าง | ต้องมีลูกค้าที่ลงทะเบียนด้วยอีเมลนั้นก่อน หรือใส่ email ใน customer_user |
| Gmail แจ้ง "Less secure app" / ปฏิเสธการล็อกอิน | ใช้รหัสผ่านปกติแทนรหัสแอป | ใช้ **App Password** ตามวิธีที่ 1 ข้างต้น |
| Error ส่งเมลไม่ผ่าน (ECONNREFUSED / ETIMEDOUT) | พอร์ตหรือ host ผิด หรือ firewall บล็อก | ตรวจ `SMTP_HOST`, `SMTP_PORT` และลองพอร์ต 587 กับ 465 |
| ลิงก์ในอีเมลกดแล้วไม่เปิดหรือเปิดผิดหน้า | `RESET_BASE_URL` ไม่ตรงกับที่ customer-web รันอยู่ | ตั้ง `RESET_BASE_URL` ให้เป็น URL จริงของ customer-web (รวมถึง production) |
| ลิงก์บอก "Invalid or expired" | โทเค็นหมดอายุ (ปกติ 1 ชม.) หรือใช้ไปแล้ว | ให้ผู้ใช้กด "Forgot password?" อีกครั้งเพื่อรับลิงก์ใหม่ |

---

## 6. ขึ้น Production – ตั้งค่า SMTP อย่างไร

เมื่อ deploy node-api ขึ้น production (Railway, Heroku, VPS ฯลฯ) **อย่าใส่รหัสผ่าน SMTP ในไฟล์ `.env` แล้ว commit ขึ้น Git** ให้ใช้ **Environment Variables / Secrets** ของแพลตฟอร์มที่ deploy แทน

### สิ่งที่ต้องตั้งบน Production

| ตัวแปร | ค่าที่ใส่ใน Production |
|--------|-------------------------|
| `RESET_BASE_URL` | **URL จริงของ customer-web** เช่น `https://customer.yourdomain.com` หรือ `https://yourdomain.com` (ไม่มี slash ปิดท้าย) |
| `SMTP_HOST` | เซิร์ฟเวอร์ SMTP (Gmail / Outlook / SendGrid ฯลฯ) |
| `SMTP_PORT` | `587` หรือ `465` |
| `SMTP_USER` | อีเมลหรือ username ที่ใช้ส่ง |
| `SMTP_PASS` | รหัสผ่านหรือ App Password / API Key |
| `SMTP_SECURE` | `false` (พอร์ต 587) หรือ `true` (พอร์ต 465) |
| `RESET_EMAIL_FROM` | (ไม่บังคับ) อีเมลที่แสดงเป็นผู้ส่ง |

### วิธีตั้งค่าในแพลตฟอร์ม

- **Railway:** โปรเจกต์ → Service (node-api) → **Variables** → Add Variable ใส่ชื่อและค่าตามตารางด้านบน  
- **Heroku:** Dashboard → App → **Settings** → **Config Vars** → Reveal Config Vars แล้วเพิ่ม  
- **VPS / รันด้วย Docker ฯลฯ:** สร้างไฟล์ `.env` บนเซิร์ฟเวอร์โดยไม่ commit (หรือใช้ `export` ใน shell script ที่รันก่อน start app)

ใส่ครบทุกตัวที่ใช้ แล้ว **redeploy / restart** service เพื่อให้โหลดค่าใหม่

### ใช้ Gmail ใน Production ได้ไหม

ได้ แต่ Gmail มีขีดจำกัดการส่ง (เช่น 500 ฉบับ/วัน) และอาจถูกมองว่าเป็น spam ถ้าส่งเยอะ  
ถ้าส่งเมลปริมาณมากหรือต้องการความเสถียร แนะนำใช้บริการส่งเมลแบบ Transactional เช่น **SendGrid**, **Mailgun**, **AWS SES** — ใส่ค่า SMTP หรือ API ตามที่ผู้ให้บริการแจ้ง (ส่วนใหญ่มี SMTP ให้ ใช้ตัวแปรเดิม `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` ได้เลย)

### สรุป Production

1. ตั้ง **RESET_BASE_URL** = URL จริงของ customer-web (ต้องเป็น https ถ้า production ใช้ SSL)  
2. ตั้งค่า **SMTP** ผ่าน Environment Variables ของ hosting **ไม่ใส่ในโค้ดหรือไฟล์ที่ commit**  
3. Restart / Redeploy node-api หลังแก้ตัวแปร

---

**สรุป:** ตั้ง `RESET_BASE_URL` ให้ตรงกับ URL ของ customer-web แล้วตั้ง SMTP ถ้าต้องการส่งอีเมลจริง ไม่ตั้ง SMTP ก็ยังทดสอบได้โดยดูลิงก์ใน console ของ node-api
