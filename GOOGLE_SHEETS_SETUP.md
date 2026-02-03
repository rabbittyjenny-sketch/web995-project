# Google Sheets Integration Guide

## 📋 โครงสร้าง Google Sheets ที่ต้องสร้าง

คุณต้องสร้าง Google Sheets ที่มี **3 Sheets** ดังนี้:

### 1. Sheet: "Orders" (ออเดอร์สั่งซื้อ)
คอลัมน์ที่ต้องมี:
- `orderId` - หมายเลขออเดอร์
- `orderDate` - วันที่สั่งซื้อ
- `customerName` - ชื่อลูกค้า
- `customerEmail` - อีเมลลูกค้า
- `customerPhone` - เบอร์โทรลูกค้า
- `shippingAddress` - ที่อยู่จัดส่ง
- `shippingProvince` - จังหวัด
- `shippingPostal` - รหัสไปรษณีย์
- `items` - รายการสินค้า
- `itemCount` - จำนวนรายการ
- `subtotal` - ราคาสินค้า
- `shippingCost` - ค่าจัดส่ง
- `total` - ยอดรวมทั้งหมด
- `status` - สถานะ
- `timestamp` - เวลาที่บันทึก

### 2. Sheet: "Contacts" (ข้อความติดต่อ)
คอลัมน์ที่ต้องมี:
- `fullName` - ชื่อ-นามสกุล
- `email` - อีเมล
- `phone` - เบอร์โทร
- `budget` - งบประมาณ
- `message` - ข้อความ
- `date` - วันที่ติดต่อ
- `timestamp` - เวลาที่บันทึก

### 3. Sheet: "Users" (สมาชิกที่สมัคร)
คอลัมน์ที่ต้องมี:
- `name` - ชื่อ-นามสกุล
- `email` - อีเมล
- `phone` - เบอร์โทร
- `registeredDate` - วันที่สมัคร
- `timestamp` - เวลาที่บันทึก

---

## 🔧 Google Apps Script Code

คัดลอกโค้ดนี้ไปใส่ใน Google Apps Script:

```javascript
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheetName = data.sheet;
    const rowData = data.data;
    
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(sheetName);
    
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({
        status: 'error',
        message: 'Sheet not found: ' + sheetName
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Get headers from first row
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    
    // Create row array based on headers
    const row = headers.map(header => rowData[header] || '');
    
    // Append row
    sheet.appendRow(row);
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Data added to ' + sheetName
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput('Google Sheets API is running');
}
```

---

## 📝 ขั้นตอนการติดตั้ง

1. **สร้าง Google Sheets** ใหม่
2. **สร้าง 3 Sheets** ตามที่ระบุข้างต้น (Orders, Contacts, Users)
3. **ใส่ชื่อคอลัมน์** ในแถวแรกของแต่ละ Sheet
4. ไปที่ **Extensions → Apps Script**
5. **วางโค้ด** ด้านบนลงไป
6. **Deploy → New deployment**
   - Type: Web app
   - Execute as: Me
   - Who has access: Anyone
7. **คัดลอก URL** ที่ได้มา
8. **แก้ไขไฟล์ `config.js`** ในโปรเจกต์:
   ```javascript
   const GOOGLE_SHEET_URL = 'URL_ที่คัดลอกมา';
   ```

---

## ✅ การใช้งาน

หลังจากตั้งค่าเสร็จแล้ว ระบบจะส่งข้อมูลไป Google Sheets อัตโนมัติเมื่อ:

- ✅ มีการสั่งซื้อสินค้า → บันทึกใน Sheet "Orders"
- ✅ มีการส่งฟอร์มติดต่อ → บันทึกใน Sheet "Contacts"  
- ✅ มีการสมัครสมาชิก → บันทึกใน Sheet "Users"

---

## 🔍 การทดสอบ

1. เปิดเว็บไซต์
2. ทดสอบสั่งซื้อสินค้า / ส่งฟอร์มติดต่อ / สมัครสมาชิก
3. เช็คใน Google Sheets ว่าข้อมูลเข้ามาหรือไม่
4. เปิด Console (F12) เพื่อดู log การส่งข้อมูล

---

## ⚠️ หมายเหตุ

- ใช้ `mode: 'no-cors'` เพราะ Google Apps Script ไม่รองรับ CORS
- ข้อมูลจะถูกส่งแบบ asynchronous (ไม่รอผลลัพธ์)
- ตรวจสอบ Console เพื่อดูสถานะการส่งข้อมูล
