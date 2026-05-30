# إعداد قاعدة البيانات والـ Backend - حل خطأ Failed to fetch

## المشكلة الحالية

عند محاولة إضافة غرفة يظهر الخطأ: **"Failed to fetch"**

**السبب:** الـ Backend غير مشغّل أو قاعدة البيانات غير معدة.

---

## الحل الكامل (خطوة بخطوة)

### 1️⃣ إنشاء ملف .env للـ Backend

في مجلد `backend`، أنشئ ملف جديد اسمه `.env` (بدون أي امتداد) وضع فيه:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/hotel_system_db?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production-12345"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV="development"
```

**ملاحظات مهمة:**
- إذا كنت تستخدم PostgreSQL بكلمة مرور مختلفة، غيّر `postgres:postgres`
- إذا كان PostgreSQL على port مختلف، غيّر `5432`
- اسم قاعدة البيانات: `hotel_system_db`

---

### 2️⃣ تثبيت PostgreSQL

**إذا لم يكن PostgreSQL مثبت:**

#### على Windows:
1. حمّل PostgreSQL من: https://www.postgresql.org/download/windows/
2. ثبّته واحفظ كلمة المرور
3. افتح pgAdmin أو SQL Shell

#### بديل أسهل - استخدام SQLite (للتطوير):
إذا أردت حل سريع بدون PostgreSQL، غيّر `DATABASE_URL` في `.env`:

```env
DATABASE_URL="file:./dev.db"
```

---

### 3️⃣ إنشاء قاعدة البيانات

**إذا كنت تستخدم PostgreSQL:**

افتح PowerShell أو CMD وشغّل:

```bash
# افتح PostgreSQL Shell
psql -U postgres

# أنشئ قاعدة البيانات
CREATE DATABASE hotel_system_db;

# اخرج
\q
```

**إذا كنت تستخدم SQLite:**
لا تحتاج شيء - سيُنشأ الملف تلقائياً.

---

### 4️⃣ تثبيت dependencies للـ Backend

افتح Terminal في مجلد `backend`:

```bash
cd backend
npm install
```

---

### 5️⃣ تشغيل Prisma Migrations

```bash
# في مجلد backend
npx prisma generate
npx prisma db push
```

**إذا ظهر خطأ:**
- تأكد من أن PostgreSQL يعمل
- تأكد من صحة DATABASE_URL في `.env`
- تأكد من وجود قاعدة البيانات

---

### 6️⃣ (اختياري) إضافة بيانات تجريبية

```bash
# في مجلد backend
node prisma/seed.js
```

هذا سيضيف:
- مستخدم Admin
- موظفين
- غرف
- طوابق

---

### 7️⃣ تشغيل الـ Backend

```bash
# في مجلد backend
npm run dev
```

**يجب أن ترى:**
```
Server running on port 5000
Database connected successfully
```

**إذا ظهر خطأ:**
- تحقق من DATABASE_URL
- تحقق من أن PostgreSQL يعمل
- تحقق من Port 5000 غير مستخدم

---

### 8️⃣ تشغيل الـ Frontend

في terminal جديد (اترك Backend يعمل):

```bash
# في مجلد الرئيسي
npm run dev
```

---

## اختبار الإصلاح

### اختبار 1: تسجيل دخول Admin
```
Email: admin@hotel.com
Password: admin123
```

### اختبار 2: إضافة غرفة
```
1. Dashboard → Rooms → + Add New Room
2. املأ البيانات:
   - Room Number: 101
   - Floor: 1
   - Type: Deluxe
   - Capacity: 2
   - Base Price: 300
3. اضغط Create Room
```

**إذا نجح:** ستظهر الغرفة فوراً  
**إذا فشل:** سيظهر الخطأ الحقيقي (وليس "Failed to fetch")

---

## حل المشاكل الشائعة

### خطأ: "Failed to fetch"
**السبب:** Backend غير مشغل  
**الحل:** شغّل `npm run dev` في مجلد backend

### خطأ: "Connection refused"
**السبب:** PostgreSQL غير مشغل  
**الحل:** شغّل PostgreSQL service

### خطأ: "Database does not exist"
**السبب:** قاعدة البيانات غير موجودة  
**الحل:** أنشئ قاعدة البيانات كما في الخطوة 3

### خطأ: "Port 5000 already in use"
**السبب:** Port مستخدم من برنامج آخر  
**الحل:** غيّر PORT في backend/.env إلى 5001 وفي .env للـ frontend

---

## بيانات تسجيل الدخول بعد seed

### Admin:
- Email: admin@hotel.com
- Password: admin123

### Staff (Reception):
- Email: reception@hotel.com
- Password: staff123

### Guest:
- Email: guest@hotel.com
- Password: guest123

---

## ملخص سريع

```bash
# Terminal 1 - Backend
cd backend
npm install                    # مرة واحدة فقط
npx prisma generate           # مرة واحدة فقط
npx prisma db push            # مرة واحدة فقط
node prisma/seed.js           # مرة واحدة فقط (اختياري)
npm run dev                   # كل مرة تشتغل

# Terminal 2 - Frontend
npm run dev                   # كل مرة تشتغل
```

**الآن افتح:** http://localhost:3003

---

## تحقق من النجاح

✅ Backend يعمل على http://localhost:5000  
✅ Frontend يعمل على http://localhost:3003  
✅ يمكنك تسجيل الدخول  
✅ يمكنك إضافة غرفة بدون خطأ "Failed to fetch"  
✅ الخطأ الآن واضح ومفصّل إذا حدث

---

**بعد إتمام جميع الخطوات، خطأ "Failed to fetch" سيختفي.**
