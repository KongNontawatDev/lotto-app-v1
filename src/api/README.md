# API Configuration Guide

## การใช้งาน Mock API (ปัจจุบัน)

ตอนนี้ระบบใช้ Mock API ที่ทำงานผ่าน memory state โดย:
- อ่านข้อมูลเริ่มต้นจาก `src/mockup/lotteries.json`
- จัดการ stock state ใน memory
- จำลอง network delay 300ms

## วิธีเปลี่ยนไปใช้ API จริง

เมื่อคุณพร้อมใช้ API จริง ให้ทำตามขั้นตอนต่อไปนี้:

### 1. แก้ไขไฟล์ `src/config/api.ts`

```typescript
export const USE_MOCK_API = false // เปลี่ยนเป็น false
export const API_BASE_URL = 'https://your-api-server.com/api' // เปลี่ยนเป็น URL ของ API server ของคุณ
```

### 2. ตรวจสอบ API Endpoints ที่ต้องมี

ระบบต้องการ API endpoints ต่อไปนี้:

#### POST `/api/cart/reserve`
**Request:**
```json
{
  "ticketId": "lot-001",
  "quantity": 1
}
```

**Response:**
```json
{
  "success": true,
  "reservedQuantity": 1,
  "remainingStock": 3
}
```

#### POST `/api/cart/release`
**Request:**
```json
{
  "ticketId": "lot-001",
  "quantity": 1
}
```

**Response:**
```json
{
  "success": true,
  "releasedQuantity": 1,
  "remainingStock": 4
}
```

#### PUT `/api/cart/update`
**Request:**
```json
{
  "cartId": "cart-uuid-123",
  "quantity": 2
}
```

**Response:**
```json
{
  "success": true,
  "updatedQuantity": 2,
  "remainingStock": 2
}
```

### 3. ตรวจสอบ Error Handling

API ควร return `success: false` เมื่อเกิด error และระบบจะแสดง toast error message อัตโนมัติ

### 4. หมายเหตุ

- เมื่อเปลี่ยนไปใช้ API จริง Mock API service จะไม่ถูกใช้งาน
- Stock state ใน memory จะถูกละเว้น
- ระบบจะเรียก API จริงทุกครั้งที่มีการเพิ่ม/ลบ/อัพเดทรายการในตะกร้า

