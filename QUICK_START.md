# ⚡ Quick Start Guide

## تشغيل المشروع في 5 دقائق

### 1️⃣ PostgreSQL Setup (دقيقة واحدة)

```sql
-- افتح PostgreSQL CLI أو pgAdmin وقم بتنفيذ:
CREATE DATABASE hotel_db;
```

### 2️⃣ Backend Setup (دقيقتان)

```bash
cd backend

# تثبيت المكتبات
npm install

# إنشاء ملف .env
echo 'DATABASE_URL="postgresql://YOUR_USER:YOUR_PASS@localhost:5432/hotel_db?schema=public"
JWT_SECRET="super-secret-jwt-key-change-me"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV="development"' > .env

# إعداد قاعدة البيانات
npm run prisma:generate
npm run prisma:push
node prisma/seed.js

# تشغيل Backend
npm run dev
```

**✅ Backend يعمل الآن على: http://localhost:5000**

### 3️⃣ Frontend Setup (دقيقة واحدة)

```bash
# في terminal جديد، ارجع للمجلد الرئيسي
cd ..

# تثبيت المكتبات
npm install

# إنشاء ملف .env
echo "VITE_API_URL=http://localhost:5000/api" > .env

# تشغيل Frontend
npm run dev
```

**✅ Frontend يعمل الآن على: http://localhost:5173**

---

## 🎯 جرب النظام الآن!

### 1. تسجيل دخول كـ Guest
```
Email: guest@example.com
Password: password123
```
- اذهب إلى صفحة "Book Now" (احجز الآن)
- أجب عن الأسئلة
- شاهد الغرف المقترحة بناءً على تفضيلاتك
- احجز غرفة واحصل على خصم 20% تلقائي!

### 2. تسجيل دخول كـ Reception Staff
```
Email: reception@hotel.com
Password: password123
```
- اذهب إلى: http://localhost:5173/dashboard/reception
- شاهد المحادثات النشطة
- أدر الحجوزات المعلقة
- تواصل مع الضيوف

### 3. تسجيل دخول كـ Admin
```
Email: admin@hotel.com
Password: password123
```
- تحكم كامل بالنظام
- إدارة الغرف
- عرض جميع الحجوزات

---

## 🔥 الميزات الرئيسية

### ✨ للنزلاء:
- خصم 20% لأول زيارة (تلقائي)
- خصم 10% للنزلاء العائدين (تلقائي)
- فلترة ذكية للغرف حسب التفضيلات
- نظام حجز سهل وسريع

### 💼 لموظفي الاستقبال:
- Dashboard متكامل
- محادثة مباشرة مع النزلاء
- عرض تفضيلات كل نزيل
- إدارة الحجوزات

### 🛠️ للمطورين:
- REST API كامل
- Authentication & Authorization
- Role-based access control
- PostgreSQL + Prisma ORM
- React + Vite

---

## 📚 Next Steps

- اقرأ `PROJECT_SETUP.md` للتفاصيل الكاملة
- اقرأ `backend/README.md` لمعرفة المزيد عن API
- استكشف الكود في `src/` و `backend/src/`

---

**🎊 مبروك! النظام يعمل الآن بنجاح!**
