# Hotel Management System - Complete Setup Guide

## 🎯 Project Overview

نظام إدارة فندق متكامل مع:
- **Backend**: Node.js + Express + PostgreSQL + Prisma
- **Frontend**: React + Vite
- نظام أدوار كامل (Guest, Staff, Admin)
- نظام خصومات تلقائي (20% أول زيارة، 10% نزيل عائد)
- Reception Dashboard مع Chat System
- فلترة ذكية للغرف
- نظام حجز متكامل

---

## 📋 Prerequisites

قبل البدء، تأكد من تثبيت:
- **Node.js** (v18 أو أحدث)
- **PostgreSQL** (v14 أو أحدث)
- **npm** أو **yarn**

---

## 🚀 Installation Steps

### 1. Backend Setup

```bash
# انتقل إلى مجلد Backend
cd backend

# تثبيت المكتبات
npm install

# إنشاء ملف .env
# انسخ من .env.example وعدّل البيانات
cp .env.example .env
```

#### تعديل ملف `.env`:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/hotel_db?schema=public"
JWT_SECRET="your-very-secure-secret-key-change-this"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV="development"
```

**⚠️ مهم**: استبدل `username` و `password` ببيانات PostgreSQL الخاصة بك.

#### إعداد قاعدة البيانات:

```bash
# إنشاء قاعدة البيانات
# في PostgreSQL CLI أو pgAdmin، قم بتنفيذ:
CREATE DATABASE hotel_db;

# توليد Prisma Client
npm run prisma:generate

# إنشاء الجداول
npm run prisma:push

# إدخال البيانات التجريبية
node prisma/seed.js
```

#### تشغيل Backend:

```bash
# Development mode (مع auto-reload)
npm run dev

# Production mode
npm start
```

✅ Backend سيعمل على: `http://localhost:5000`

---

### 2. Frontend Setup

```bash
# في المجلد الرئيسي
cd ..

# تثبيت المكتبات
npm install

# إنشاء ملف .env
echo "VITE_API_URL=http://localhost:5000/api" > .env
```

#### تشغيل Frontend:

```bash
# Development mode
npm run dev

# Build للإنتاج
npm run build
```

✅ Frontend سيعمل على: `http://localhost:5173`

---

## 👥 Test Accounts

بعد تنفيذ seed.js، ستتوفر الحسابات التالية:

### Admin
- **Email**: `admin@hotel.com`
- **Password**: `password123`
- **Access**: تحكم كامل بالنظام

### Reception Staff
- **Email**: `reception@hotel.com`
- **Password**: `password123`
- **Access**: Reception Dashboard + Chat + Bookings

### Guest
- **Email**: `guest@example.com`
- **Password**: `password123`
- **Access**: حجز غرف + خصم 20% لأول مرة

### Staff (Other Departments)
- **Nursing**: `nursing@hotel.com` / `password123`
- **Maintenance**: `maintenance@hotel.com` / `password123`
- **Accounting**: `accounting@hotel.com` / `password123`

---

## 🏗️ Project Structure

```
Hotel-System-project/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── seed.js            # Initial data
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js    # Prisma client
│   │   ├── controllers/       # Request handlers
│   │   │   ├── authController.js
│   │   │   ├── roomController.js
│   │   │   ├── bookingController.js
│   │   │   └── chatController.js
│   │   ├── services/          # Business logic
│   │   │   ├── authService.js
│   │   │   ├── roomService.js
│   │   │   ├── bookingService.js
│   │   │   └── chatService.js
│   │   ├── routes/            # API routes
│   │   │   ├── authRoutes.js
│   │   │   ├── roomRoutes.js
│   │   │   ├── bookingRoutes.js
│   │   │   ├── chatRoutes.js
│   │   │   └── index.js
│   │   ├── middlewares/       # Auth & error handling
│   │   │   ├── auth.js
│   │   │   └── errorHandler.js
│   │   ├── utils/             # Helper functions
│   │   │   ├── jwt.js
│   │   │   └── discounts.js
│   │   └── server.js          # Entry point
│   ├── package.json
│   ├── .env.example
│   └── README.md
│
├── src/
│   ├── pages/
│   │   ├── Booking/
│   │   │   ├── Booking.jsx           # صفحة الحجز + Chat
│   │   │   ├── BookingConfirm.jsx    # تأكيد الحجز
│   │   │   └── BookingSuccess.jsx    # نجاح الحجز
│   │   ├── Dashboard/
│   │   │   └── ReceptionDashboard.jsx # لوحة موظف الاستقبال
│   │   └── Auth/
│   │       ├── Login.jsx
│   │       └── Register.jsx
│   ├── services/
│   │   └── api.js                    # API calls
│   ├── context/
│   │   └── AuthContext.jsx           # Auth state management
│   └── router/
│       └── index.jsx                 # Routes
│
├── package.json
└── PROJECT_SETUP.md (this file)
```

---

## 🔑 Key Features

### 1. نظام الأدوار (Roles)

#### Guest Roles:
- **GUEST_NEW**: نزيل جديد - خصم 20%
- **GUEST_RETURNING**: نزيل عائد - خصم 10%

#### Staff Roles:
- **STAFF_RECEPTION**: موظف استقبال
- **STAFF_NURSING**: طاقم التمريض
- **STAFF_MAINTENANCE**: الصيانة
- **STAFF_ACCOUNTING**: المحاسبة

#### Admin Role:
- **ADMIN**: مدير النظام

### 2. Discount System

```javascript
// يتم تطبيق الخصم تلقائياً عند الحجز
- First visit: 20% discount (automatic)
- Returning guests: 10% discount (automatic)
```

### 3. Chat System

- تخزين المحادثات في قاعدة البيانات
- ربط Guest مع Staff
- تتبع تفضيلات النزيل
- جاهز للربط مع AI

### 4. Room Filtering

```javascript
// الفلترة تتم بناءً على:
- عدد النزلاء
- نوع الإقامة (luxury, family, business, quiet)
- التفضيلات (view, spa, pool, etc.)
- الاحتياجات الخاصة
- الميزانية
```

---

## 📡 API Endpoints

### Authentication
```
POST   /api/auth/register       # تسجيل مستخدم جديد
POST   /api/auth/login          # تسجيل دخول
POST   /api/auth/logout         # تسجيل خروج
GET    /api/auth/profile        # عرض الملف الشخصي
```

### Rooms
```
GET    /api/rooms               # عرض جميع الغرف
GET    /api/rooms/:id           # عرض غرفة واحدة
POST   /api/rooms/filter        # فلترة الغرف
POST   /api/rooms               # إضافة غرفة (Admin/Reception)
PUT    /api/rooms/:id           # تعديل غرفة
DELETE /api/rooms/:id           # حذف غرفة (Admin)
```

### Bookings
```
POST   /api/bookings            # إنشاء حجز
GET    /api/bookings/my-bookings # حجوزات المستخدم
GET    /api/bookings/:id        # عرض حجز محدد
GET    /api/bookings            # جميع الحجوزات (Staff)
PATCH  /api/bookings/:id/status # تحديث حالة الحجز
```

### Chat
```
POST   /api/chat                      # إنشاء session
GET    /api/chat/my-sessions          # جلسات المستخدم
GET    /api/chat/:id                  # جلسة محددة
POST   /api/chat/:sessionId/messages  # إرسال رسالة
PATCH  /api/chat/:id/data             # تحديث بيانات الضيف
PATCH  /api/chat/:id/assign           # تعيين موظف
PATCH  /api/chat/:id/close            # إغلاق الجلسة
GET    /api/chat/active/all           # جلسات نشطة (Staff)
```

---

## 🔧 Troubleshooting

### مشكلة: Backend لا يعمل

**الحل**:
```bash
# تأكد من تشغيل PostgreSQL
# تأكد من صحة DATABASE_URL في .env
# تحقق من السجلات (logs)
npm run dev
```

### مشكلة: Frontend لا يتصل بـ Backend

**الحل**:
```bash
# تأكد من أن VITE_API_URL صحيح في .env
# تأكد من تشغيل Backend على المنفذ الصحيح
# افحص Console في المتصفح
```

### مشكلة: Prisma errors

**الحل**:
```bash
cd backend
npm run prisma:generate
npm run prisma:push
```

---

## 🎨 Development Workflow

### إضافة ميزة جديدة:

1. **Backend**:
   - أضف Model في `prisma/schema.prisma`
   - نفذ `npm run prisma:push`
   - أنشئ Service في `src/services/`
   - أنشئ Controller في `src/controllers/`
   - أضف Routes في `src/routes/`

2. **Frontend**:
   - أضف API calls في `src/services/api.js`
   - أنشئ/عدّل Components/Pages
   - أضف Routes في `src/router/index.jsx`

---

## 📝 Development Notes

### Database Schema
- يستخدم UUID للـ IDs
- Relations محددة بـ Cascade
- Indexes على الحقول المهمة
- JSON fields للبيانات المرنة

### Security
- JWT tokens مع expiration
- bcryptjs لتشفير كلمات المرور
- CORS enabled
- Role-based authorization

### Performance
- Database indexing
- Pagination ready
- Efficient queries with Prisma

---

## 🚢 Production Deployment

### Backend:
```bash
cd backend
npm run build  # إذا كان هناك
npm start
```

### Frontend:
```bash
npm run build
# ارفع محتويات dist/ إلى server
```

### Environment Variables للإنتاج:
```env
DATABASE_URL="production-database-url"
JWT_SECRET="very-strong-production-secret"
NODE_ENV="production"
```

---

## 📞 Support & Contact

للمساعدة أو الاستفسارات:
- راجع Backend README: `backend/README.md`
- راجع API Documentation
- تحقق من Console logs

---

## ✅ Testing Checklist

- [ ] Backend يعمل على المنفذ 5000
- [ ] Frontend يعمل على المنفذ 5173
- [ ] PostgreSQL يعمل
- [ ] تم تنفيذ seed.js بنجاح
- [ ] يمكن تسجيل الدخول بحسابات Test
- [ ] يمكن إنشاء حجز جديد
- [ ] Reception Dashboard يعرض البيانات
- [ ] Chat system يعمل

---

**🎉 النظام الآن جاهز للاستخدام!**

تم إنشاء نظام فندق متكامل مع جميع المتطلبات المطلوبة.
