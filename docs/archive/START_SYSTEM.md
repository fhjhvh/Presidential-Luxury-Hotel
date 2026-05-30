# دليل تشغيل النظام الكامل - حل جميع المشاكل

## 🔴 المشكلة الحالية

1. **خطأ "Failed to fetch" عند إضافة غرفة** ← Backend غير مشغل
2. **الخيارات في صفحة "احجز الآن" تظهر كروابط** ← تم التحقق - هي buttons صحيحة
3. **قاعدة البيانات غير موجودة** ← يجب إعدادها

---

## ✅ الحل الكامل (اتبع الترتيب بالضبط)

### الخطوة 1: تثبيت PostgreSQL (قاعدة البيانات)

#### الطريقة السهلة - استخدام SQLite (موصى بها للتطوير):

لا تحتاج تثبيت شيء! فقط اتبع الخطوات التالية.

#### الطريقة البديلة - PostgreSQL:

1. حمّل من: https://www.postgresql.org/download/windows/
2. ثبّته مع pgAdmin
3. احفظ كلمة المرور التي تدخلها

---

### الخطوة 2: إنشاء ملف .env للـ Backend

**في مجلد `backend`** أنشئ ملف جديد اسمه `.env` وضع فيه:

#### إذا كنت تستخدم SQLite (سهل - موصى به):
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="hotel-luxury-secret-key-2024-production-12345"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV="development"
```

#### إذا كنت تستخدم PostgreSQL:
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/hotel_system_db?schema=public"
JWT_SECRET="hotel-luxury-secret-key-2024-production-12345"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV="development"
```

**⚠️ مهم جداً:** غيّر `YOUR_PASSWORD` بكلمة مرور PostgreSQL الخاصة بك

---

### الخطوة 3: إعداد PostgreSQL (إذا كنت تستخدمه)

افتح **PowerShell** أو **CMD** واكتب:

```bash
# افتح PostgreSQL
psql -U postgres

# أدخل كلمة المرور
# ثم أنشئ قاعدة البيانات
CREATE DATABASE hotel_system_db;

# تحقق من الإنشاء
\l

# اخرج
\q
```

**إذا استخدمت SQLite:** اقفز هذه الخطوة.

---

### الخطوة 4: تثبيت dependencies للـ Backend

افتح **PowerShell** أو **CMD** في مجلد المشروع:

```bash
cd backend
npm install
```

انتظر حتى تنتهي التثبيت (قد يأخذ دقائق).

---

### الخطوة 5: إعداد Prisma (قاعدة البيانات)

**في مجلد backend:**

```bash
# 1. توليد Prisma Client
npx prisma generate

# 2. إنشاء الجداول في قاعدة البيانات
npx prisma db push
```

**يجب أن ترى:**
```
✔ Generated Prisma Client
✔ Database synchronized successfully
```

**إذا ظهر خطأ:**
- تحقق من DATABASE_URL في `.env`
- تحقق من PostgreSQL يعمل (إذا كنت تستخدمه)
- تأكد أنك في مجلد `backend`

---

### الخطوة 6: إضافة بيانات تجريبية (مهم!)

**في مجلد backend:**

```bash
node prisma/seed.js
```

**يجب أن ترى:**
```
Database seeded successfully!
✓ Admin user created
✓ Staff users created
✓ Guest user created
✓ Floors created
✓ Rooms created
```

**هذا سيضيف:**
- مستخدم Admin: `admin@hotel.com` / `admin123`
- موظفين
- 5 طوابق
- 50+ غرفة

---

### الخطوة 7: تشغيل الـ Backend ⭐

**في terminal جديد (مجلد backend):**

```bash
npm run dev
```

**يجب أن ترى:**
```
Server running on port 5000
✓ Database connected successfully
```

**اترك هذا Terminal مفتوح! لا تغلقه.**

**إذا ظهر خطأ:**
- `Port 5000 already in use` → غيّر PORT في `.env` إلى 5001
- `Database connection failed` → تحقق من DATABASE_URL
- `Cannot find module` → شغّل `npm install` مرة أخرى

---

### الخطوة 8: تشغيل الـ Frontend

**افتح terminal جديد** (اترك Backend يعمل):

في مجلد المشروع الرئيسي:

```bash
npm run dev
```

**يجب أن ترى:**
```
VITE ready in X ms
Local: http://localhost:3003/
```

---

### الخطوة 9: اختبار النظام ✅

افتح المتصفح: **http://localhost:3003**

#### اختبار 1: تسجيل الدخول
```
1. اضغط Sign In
2. Email: admin@hotel.com
3. Password: admin123
4. اضغط Login
5. يجب أن تدخل لوحة التحكم
```

#### اختبار 2: إضافة غرفة
```
1. Dashboard → Rooms
2. اضغط + Add New Room
3. املأ:
   - Room Number: 505
   - Floor: 5
   - Type: Suite
   - Capacity: 4
   - Base Price: 800
4. اضغط Create Room
5. يجب أن تظهر الغرفة فوراً (بدون خطأ "Failed to fetch")
```

#### اختبار 3: صفحة احجز الآن
```
1. افتح /booking
2. اضغط Let's Begin
3. اختر عدد الضيوف → يجب أن تظهر أزرار (1, 2, 3, 4, 5, 6+)
4. اختر نوع الإقامة → أزرار (Luxury, Family, Business, Quiet)
5. الخيارات يجب أن تكون أزرار وليس روابط
```

---

## 🔧 حل المشاكل الشائعة

### ❌ "Failed to fetch" عند إضافة غرفة

**السبب:** Backend غير مشغل  
**الحل:** 
```bash
cd backend
npm run dev
```

### ❌ "Connection refused" أو "ECONNREFUSED"

**السبب:** Backend غير يعمل أو على port مختلف  
**الحل:**
1. تأكد Backend يعمل (`npm run dev` في مجلد backend)
2. تحقق من PORT في `backend/.env` (يجب 5000)
3. تحقق من VITE_API_URL في `.env` الرئيسي (يجب `http://localhost:5000/api`)

### ❌ "Database does not exist"

**السبب:** PostgreSQL - قاعدة البيانات غير موجودة  
**الحل:**
```bash
psql -U postgres
CREATE DATABASE hotel_system_db;
\q
```

**أو استخدم SQLite:**
غيّر DATABASE_URL في `backend/.env` إلى:
```
DATABASE_URL="file:./dev.db"
```

### ❌ "Prisma Client not generated"

**الحل:**
```bash
cd backend
npx prisma generate
```

### ❌ الخيارات في صفحة الحجز تظهر كروابط

**هذا خطأ بصري!** الخيارات هي buttons فعلاً، لكن CSS قد يجعلها تبدو كروابط.

**التحقق:**
- افتح DevTools (F12)
- انقر على خيار
- في Elements يجب أن ترى `<button class="option-button">`

**إذا كانت `<a>` بدلاً من `<button>`:**
الكود تم تعديله بالفعل ليستخدم `motion.button` وليس روابط.

---

## 📊 بيانات تسجيل الدخول (بعد seed)

### Admin (صلاحيات كاملة):
```
Email: admin@hotel.com
Password: admin123
```

### موظف استقبال:
```
Email: reception@hotel.com
Password: staff123
```

### ضيف عادي:
```
Email: guest@hotel.com
Password: guest123
```

---

## 🎯 ترتيب التشغيل دائماً

### كل مرة تريد تشغيل النظام:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
npm run dev
```

**افتح المتصفح:** http://localhost:3003

---

## ✅ التحقق من نجاح الإعداد

- [ ] Backend يعمل على port 5000
- [ ] Frontend يعمل على port 3003
- [ ] يمكنك تسجيل الدخول كـ admin
- [ ] يمكنك فتح Dashboard
- [ ] يمكنك إضافة غرفة **بدون** خطأ "Failed to fetch"
- [ ] صفحة /booking تعرض الخيارات كأزرار
- [ ] يمكنك رؤية الغرف والطوابق

---

## 📝 ملاحظات مهمة

1. **يجب تشغيل Backend أولاً** قبل Frontend
2. **لا تغلق terminal Backend** وإلا سيظهر "Failed to fetch"
3. **البيانات التجريبية** تضيف 50+ غرفة و 5 طوابق
4. **استخدم SQLite للتطوير** - أسهل بكثير من PostgreSQL

---

## 🆘 إذا مازالت المشكلة موجودة

### خطوات التشخيص:

1. **تأكد Backend يعمل:**
   - افتح http://localhost:5000/api في المتصفح
   - يجب أن ترى شيء (وليس خطأ)

2. **تحقق من Console:**
   - افتح DevTools (F12) في المتصفح
   - انظر للأخطاء في Console
   - انظر للأخطاء في Network tab

3. **تحقق من Terminal Backend:**
   - هل يوجد أخطاء؟
   - هل يقول "Database connected successfully"؟

4. **تحقق من الملفات:**
   - `backend/.env` موجود؟
   - `.env` في المجلد الرئيسي موجود؟
   - DATABASE_URL صحيح؟

---

**بعد اتباع جميع الخطوات بالترتيب، كل شيء سيعمل بشكل صحيح! 🎉**
