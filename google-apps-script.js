// =====================================================
// Google Apps Script สำหรับ 995 Events Website
// รองรับ: Contact Form + Product CRUD
// =====================================================
// วิธีใช้:
// 1. ไปที่ https://script.google.com > New Project
// 2. คัดลอกโค้ดนี้ทั้งหมดไปวาง
// 3. Deploy > New Deployment > Web App
//    - Execute as: Me
//    - Who has access: Anyone
// 4. คัดลอก Web App URL ไปใส่ใน index.html
// =====================================================

const SHEET_ID = '1UDuvb9n47enjPx5fg3xDraP6g5n8JJCTb0mVNXCWJog';

// ==================== POST Handler ====================
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action || 'contact';

    switch (action) {
      case 'contact':
        return handleContact(data);
      case 'addProduct':
        return handleAddProduct(data);
      case 'updateProduct':
        return handleUpdateProduct(data);
      case 'deleteProduct':
        return handleDeleteProduct(data);
      default:
        return jsonResponse({ success: false, error: 'Unknown action: ' + action });
    }
  } catch (error) {
    return jsonResponse({ success: false, error: error.toString() });
  }
}

// ==================== GET Handler ====================
function doGet(e) {
  try {
    const action = e.parameter.action || 'status';

    switch (action) {
      case 'getProducts':
        return handleGetProducts();
      case 'status':
        return ContentService
          .createTextOutput('995 Events API is running!')
          .setMimeType(ContentService.MimeType.TEXT);
      default:
        return jsonResponse({ success: false, error: 'Unknown action' });
    }
  } catch (error) {
    return jsonResponse({ success: false, error: error.toString() });
  }
}

// ==================== Contact Form ====================
function handleContact(data) {
  const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  let sheet = spreadsheet.getSheetByName('Consult');
  if (!sheet) {
    sheet = spreadsheet.insertSheet('Consult');
    sheet.getRange(1, 1, 1, 6).setValues([
      ['Timestamp', 'Full Name', 'Email', 'Phone', 'Budget', 'Message']
    ]);
    sheet.getRange(1, 1, 1, 6).setFontWeight('bold');
    sheet.getRange(1, 1, 1, 6).setBackground('#4285f4');
    sheet.getRange(1, 1, 1, 6).setFontColor('white');
  }

  sheet.appendRow([
    data.timestamp,
    data.fullName,
    data.email,
    data.phone,
    data.budget,
    data.message
  ]);

  sheet.autoResizeColumns(1, 6);

  return jsonResponse({
    success: true,
    message: 'Contact saved',
    timestamp: data.timestamp
  });
}

// ==================== Product CRUD ====================
function getProductSheet() {
  const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  let sheet = spreadsheet.getSheetByName('Products');
  if (!sheet) {
    sheet = spreadsheet.insertSheet('Products');
    sheet.getRange(1, 1, 1, 7).setValues([
      ['ID', 'Name', 'Price', 'Discount', 'Image URL', 'Description', 'Category']
    ]);
    sheet.getRange(1, 1, 1, 7).setFontWeight('bold');
    sheet.getRange(1, 1, 1, 7).setBackground('#e80074');
    sheet.getRange(1, 1, 1, 7).setFontColor('white');
  }
  return sheet;
}

function handleGetProducts() {
  const sheet = getProductSheet();
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) {
    return jsonResponse({ success: true, products: [] });
  }

  const products = [];
  for (let i = 1; i < data.length; i++) {
    products.push({
      id: data[i][0],
      name: data[i][1],
      price: data[i][2],
      discount: data[i][3],
      image: data[i][4],
      description: data[i][5],
      category: data[i][6]
    });
  }

  return jsonResponse({ success: true, products: products });
}

function handleAddProduct(data) {
  const sheet = getProductSheet();
  const id = 'p' + new Date().getTime();
  sheet.appendRow([
    id,
    data.name,
    data.price,
    data.discount || 0,
    data.image,
    data.description,
    data.category || 'merch'
  ]);
  sheet.autoResizeColumns(1, 7);

  return jsonResponse({ success: true, message: 'Product added', id: id });
}

function handleUpdateProduct(data) {
  const sheet = getProductSheet();
  const allData = sheet.getDataRange().getValues();

  for (let i = 1; i < allData.length; i++) {
    if (allData[i][0] === data.id) {
      const row = i + 1;
      if (data.name !== undefined) sheet.getRange(row, 2).setValue(data.name);
      if (data.price !== undefined) sheet.getRange(row, 3).setValue(data.price);
      if (data.discount !== undefined) sheet.getRange(row, 4).setValue(data.discount);
      if (data.image !== undefined) sheet.getRange(row, 5).setValue(data.image);
      if (data.description !== undefined) sheet.getRange(row, 6).setValue(data.description);
      if (data.category !== undefined) sheet.getRange(row, 7).setValue(data.category);

      return jsonResponse({ success: true, message: 'Product updated' });
    }
  }

  return jsonResponse({ success: false, error: 'Product not found: ' + data.id });
}

function handleDeleteProduct(data) {
  const sheet = getProductSheet();
  const allData = sheet.getDataRange().getValues();

  for (let i = 1; i < allData.length; i++) {
    if (allData[i][0] === data.id) {
      sheet.deleteRow(i + 1);
      return jsonResponse({ success: true, message: 'Product deleted' });
    }
  }

  return jsonResponse({ success: false, error: 'Product not found: ' + data.id });
}

// ==================== Helper ====================
function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
