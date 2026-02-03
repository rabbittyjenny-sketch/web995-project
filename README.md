# 995 Events - Web Project

โปรเจกต์เว็บไซต์สำหรับ 995 Events พร้อมระบบร้านค้าและการจัดการอีเวนต์

## 📋 รายละเอียดโปรเจกต์

เว็บไซต์นี้ประกอบด้วย:
- หน้าเว็บหลัก (Landing Page)
- ระบบร้านค้า (995shop)
- Brand Guidebook
- Google Apps Script Integration

## 🚀 การติดตั้งและใช้งาน

### ข้อกำหนดเบื้องต้น
- Web Browser (Chrome, Firefox, Safari, Edge)
- Text Editor (VS Code แนะนำ)
- Git

### วิธีการติดตั้ง

1. Clone repository:
```bash
git clone <your-repo-url>
cd web995-project
```

2. เปิดไฟล์ `index.html` ด้วย browser หรือใช้ local server:
```bash
# ถ้ามี Python
python -m http.server 8000

# ถ้ามี Node.js
npx http-server
```

3. เข้าถึงเว็บไซต์ที่ `http://localhost:8000`

## 📁 โครงสร้างโปรเจกต์

```
web995-project/
├── index.html              # หน้าเว็บหลัก
├── index_backup.html       # ไฟล์สำรอง
├── 995shop                 # โมดูลร้านค้า
├── 995shopmodule_html      # HTML โมดูลร้านค้า
├── Visual_995eventsbrandbook # Brand guidebook
├── google-apps-script.js   # Google Apps Script
├── logo995.png            # โลโก้
├── bg1.png, bg2.png, bg3.png # รูปภาพพื้นหลัง
├── 9995555.txt            # ข้อมูลเพิ่มเติม
└── setup-instructions.md  # คำแนะนำการติดตั้ง
```

## 🎨 Brand Guidelines

ดูรายละเอียดใน `Visual_995eventsbrandbook` สำหรับ:
- Color Palette
- Typography
- Logo Usage
- Design Elements

## 🔧 Google Apps Script

ไฟล์ `google-apps-script.js` ใช้สำหรับ:
- การจัดการข้อมูล
- Integration กับ Google Sheets
- Automation workflows

## 📝 License

© 2026 995 Events. All rights reserved.

## 👥 Contact

สำหรับข้อมูลเพิ่มเติม กรุณาติดต่อทีมงาน 995 Events

---

**Created with ❤️ by 995 Events Team**
