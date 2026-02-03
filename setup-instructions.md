# การตั้งค่า Google Apps Script สำหรับ Contact Form

## ขั้นตอนการตั้งค่า:

### 1. สร้าง Google Apps Script Project
1. ไปที่ https://script.google.com
2. คลิก "New project"
3. คัดลอกโค้ดจากไฟล์ `google-apps-script.js` ไปใส่
4. บันทึกและตั้งชื่อโปรเจค เช่น "995Events Contact Form"

### 2. Deploy Web App
1. คลิก "Deploy" > "New deployment"
2. เลือก Type: "Web app"
3. Execute as: "Me"
4. Who has access: "Anyone" 
5. คลิก "Deploy"
6. **คัดลอก Web App URL** ที่ได้

### 3. อัพเดต JavaScript ในเว็บไซต์
ในไฟล์ `index.html` แก้ไขบรรทัดนี้:
```javascript
const SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
```
เป็น URL ที่คัดลอกมาจากขั้นตอนที่ 2

### 4. ทดสอบ
1. เปิดเว็บไซต์
2. กรอกฟอร์ม Contact
3. ส่งข้อมูล
4. ตรวจสอบใน Google Sheets ว่ามีข้อมูลเข้ามาหรือไม่

## โครงสร้าง Google Sheets:
- **Sheet Name**: "Consult"
- **Columns**: 
  - A: Timestamp
  - B: Full Name  
  - C: Email
  - D: Phone
  - E: Budget
  - F: Message

## Features:
- ✅ บันทึก Timestamp อัตโนมัติ (เวลาไทย)
- ✅ Validation ข้อมูล
- ✅ Auto-resize columns
- ✅ Error handling
- ✅ Loading states ในฟอร์ม

## หมายเหตุ:
- ทุกครั้งที่ Deploy ใหม่ จะได้ URL ใหม่
- ต้องอัพเดต URL ในเว็บไซต์ด้วย
- Google Sheets ต้อง Share ให้ Script สามารถเขียนได้