# 🚀 คู่มือการนำไฟล์ไปติดตั้งและพัฒนาต่อกับ Google Apps Script (GAS)

ชุดไฟล์นี้ออกแบบมาเพื่อให้คุณครูและนักพัฒนาสามารถนำแพลตฟอร์มการเรียนรู้ **Coder Kids: สื่อการเรียนรู้วิทยาการคำนวณและเทคโนโลยี (สพฐ. & สสวท.)** ไปติดตั้งและพัฒนาต่อบน **Google Apps Script** และ **Google Sheets** ได้อย่างสมบูรณ์แบบ 100%

---

## 📁 รายการไฟล์ในชุด Export

1. **`Code.gs`** — สคริปต์หลักฝั่ง Server (Google Apps Script)
   - `doGet(e)` / `doPost(e)` รองรับทั้งการแสดงผล Web App และ REST API
   - ฟังก์ชันจัดการฐานข้อมูล Google Sheets อัตโนมัติ (`setupCoderKidsDatabase()`)
   - ระบบ CRUD โปรไฟล์นักเรียน บันทึกการเข้าเรียน สมุดบันทึกประจำวัน (Daily Journal) ผลคะแนนแบบทดสอบ และโครงงาน Showcase
   - เชื่อมต่อ Gmail สำหรับส่งเกียรติบัตร (Certificate) ให้อัตโนมัติ
   - AI Tutor Chatbot รองรับ Gemini API ผ่าน UrlFetchApp
2. **`Index.html`** — หน้าบ้าน Web App (HTML Service)
   - รองรับ Tailwind CSS CDN + Canvas Confetti
   - ระบบสลับโหมดสว่าง/โหมดมืด (Dark Mode / Light Mode)
   - ฟังก์ชันเชื่อมต่อกับ Server ผ่าน `google.script.run` แบบเรียลไทม์
3. **`appsscript.json`** — ไฟล์ Manifest การตั้งค่าสิทธิ์และการเข้าถึง (OAuth Scopes & V8 Runtime)

---

## 🛠️ ขั้นตอนการติดตั้งบน Google Apps Script ใน 5 นาที

### ขั้นตอนที่ 1: เตรียม Google Sheets
1. เปิดแผ่นงาน Google Sheets เดิมของคุณ หรือสร้างใหม่ที่ [sheets.new](https://sheets.new)
   - *Spreadsheet ID อ้างอิงในระบบเดิม:* `1tWcZ4OaGZKOcX1PEvVNadyf9mM_igaKcF3ZV_b3L7Ng`
2. ตั้งชื่อไฟล์ เช่น `Coder Kids Database (โรงเรียนของคุณ)`

### ขั้นตอนที่ 2: เปิดโปรเจกต์ Apps Script
1. ที่เมนูด้านบนของ Google Sheets คลิกที่ **ส่วนขยาย (Extensions)** > **Apps Script**
2. ตั้งชื่อโปรเจกต์ เช่น `Coder Kids Web App Backend`

### ขั้นตอนที่ 3: วางโค้ดไฟล์
1. **ไฟล์ `Code.gs`**:
   - ลบโค้ดเริ่มต้นในไฟล์ `Code.gs` ออกทั้งหมด
   - คัดลอกเนื้อหาจากไฟล์ `gas-export/Code.gs` มาวาง
   - *(หากใช้ Google Sheets ไฟล์อื่น)* ให้แก้ไขตัวแปร `SPREADSHEET_ID` ที่บรรทัด 11 ให้ตรงกับ ID ของคุณ
2. **สร้างไฟล์ `Index.html`**:
   - คลิกเครื่องหมาย **+ (เพิ่มไฟล์)** ด้านซ้าย > เลือก **HTML**
   - ตั้งชื่อไฟล์ว่า `Index` (ไม่ต้องใส่นามสกุล .html)
   - คัดลอกเนื้อหาจากไฟล์ `gas-export/Index.html` มาวาง
3. **ไฟล์ `appsscript.json` (ตั้งค่า Manifest)**:
   - คลิกที่รูปฟันเฟือง **การตั้งค่าโปรเจกต์ (Project Settings)** ด้านซ้าย
   - ทำเครื่องหมายถูกที่ **แสดงไฟล์ manifest "appsscript.json" ในตัวแก้ไข**
   - กลับมาที่หน้าต่างโค้ด คลิกเปิดไฟล์ `appsscript.json` แล้วแทนที่ด้วยเนื้อหาใน `gas-export/appsscript.json`

### ขั้นตอนที่ 4: สร้างฐานข้อมูลและแผ่นงานอัตโนมัติ
1. ที่แถบเครื่องมือด้านบน เลือกฟังก์ชันเป็น **`setupCoderKidsDatabase`**
2. คลิกปุ่ม **เรียกใช้ (Run)** ▶️
3. กดยอมรับการอนุญาตสิทธิ์เข้าถึง (Review Permissions > เลือกบัญชี Google ของคุณ > Advanced > Go to Coder Kids (unsafe) > Allow)
4. ระบบจะสร้างแผ่นงานที่จำเป็นทั้งหมดพร้อมตกแต่งสีหัวตารางอัตโนมัติ:
   - `Students` (รายชื่อและข้อมูลผู้เรียน)
   - `DailyJournals` (บันทึกประจำวันและการสะท้อนคิด)
   - `QuizResults` (ประวัติผลสอบแต่ละบทเรียน)
   - `ShowcaseProjects` (โครงงาน Scratch และ Micro:bit)
   - `ClassroomLogs` (บันทึกการเข้าเรียน)

### ขั้นตอนที่ 5: เผยแพร่เป็นเว็บแอป (Deploy as Web App)
1. คลิกปุ่ม **การทำให้ใช้งานได้ (Deploy)** สีน้ำเงินมุมขวาบน > เลือก **การทำให้ใช้งานได้ใหม่ (New deployment)**
2. คลิกรูปฟันเฟืองเลือกประเภท: **เว็บแอป (Web app)**
3. ตั้งค่าการเผยแพร่:
   - **คำอธิบาย:** `Coder Kids Version 1.0`
   - **ดำเนินการในฐานะ (Execute as):** `ฉัน (Me - ที่อยู่อีเมลของคุณ)`
   - **ผู้มีสิทธิ์เข้าถึง (Who has access):** `ทุกคน (Anyone)`
4. คลิก **ทำให้ใช้งานได้ (Deploy)**
5. คัดลอก **URL เว็บแอป (Web App URL)** นำไปให้นักเรียนใช้งาน หรือนำไปฝังใน Google Sites / Canva / Schoology ได้ทันที!

---

## 💡 ตัวเลือกเพิ่มเติม: การตั้งค่า Gemini API สำหรับครูพี่โค้ดดิ้ง (AI Tutor)
1. นำ API Key จาก [Google AI Studio](https://aistudio.google.com/)
2. ในหน้า Apps Script Editor ไปที่ **การตั้งค่าโปรเจกต์ (Project Settings)**
3. เลื่อนลงมาที่หัวข้อ **คุณสมบัติของสคริปต์ (Script Properties)** > คลิก **เพิ่มคุณสมบัติของสคริปต์**
4. ตั้งชื่อคุณสมบัติ: `GEMINI_API_KEY`
5. วาง API Key ของคุณ แล้วกด **บันทึกคุณสมบัติของสคริปต์**
