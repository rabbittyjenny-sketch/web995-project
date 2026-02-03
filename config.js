// ===== GOOGLE SHEETS INTEGRATION CONFIG =====

// Google Apps Script Web App URL (ใส่ URL ที่ได้จาก Apps Script)
const GOOGLE_SHEET_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';

// ฟังก์ชันส่งข้อมูลไป Google Sheets
const sendToGoogleSheet = async (sheetName, data) => {
    try {
        const response = await fetch(GOOGLE_SHEET_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sheet: sheetName,
                data: data
            })
        });

        console.log('✅ ส่งข้อมูลไป Google Sheets สำเร็จ:', sheetName);
        return true;
    } catch (error) {
        console.error('❌ เกิดข้อผิดพลาดในการส่งข้อมูล:', error);
        return false;
    }
};

// ฟังก์ชันสำหรับแต่ละประเภทข้อมูล
const saveOrderToSheet = async (order) => {
    const orderData = {
        orderId: order.id,
        orderDate: new Date(order.date).toLocaleString('th-TH'),
        customerName: order.user?.name || '',
        customerEmail: order.user?.email || '',
        customerPhone: order.shipping?.phone || '',
        shippingAddress: order.shipping?.address || '',
        shippingProvince: order.shipping?.province || '',
        shippingPostal: order.shipping?.postal || '',
        items: order.items.map(i => `${i.product?.name || 'N/A'} x${i.qty}`).join(', '),
        itemCount: order.items.length,
        subtotal: order.subtotal,
        shippingCost: order.shippingCost,
        total: order.total,
        status: order.status,
        timestamp: new Date().toISOString()
    };

    return await sendToGoogleSheet('Orders', orderData);
};

const saveContactToSheet = async (contact) => {
    const contactData = {
        fullName: contact.fullName,
        email: contact.email,
        phone: contact.phone || '',
        budget: contact.budget || '',
        message: contact.message,
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleString('th-TH')
    };

    return await sendToGoogleSheet('Contacts', contactData);
};

const saveUserToSheet = async (user) => {
    const userData = {
        name: user.name,
        email: user.email,
        phone: user.phone,
        registeredDate: new Date().toLocaleString('th-TH'),
        timestamp: new Date().toISOString()
    };

    return await sendToGoogleSheet('Users', userData);
};
