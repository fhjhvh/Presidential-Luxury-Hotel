# 🚀 خطوات تفعيل لوحة التحكم الإدارية

## 📋 الخطوات السريعة

### 1️⃣ تطبيق Migration لقاعدة البيانات

افتح terminal في مجلد المشروع وقم بتنفيذ:

```bash
cd backend
npx prisma migrate dev --name add_admin_panel_tables
npx prisma generate
```

هذا سيقوم بـ:
- ✅ إضافة جدول Floor (الطوابق)
- ✅ إضافة جدول Feature (الميزات)
- ✅ إضافة جدول FoodItem (الطعام)
- ✅ تحديث جدول Room بحقول جديدة

---

### 2️⃣ تشغيل الـ Backend

```bash
cd backend
npm run dev
```

يجب أن تظهر الرسالة:
```
✅ Database connected successfully
🚀 Server running on http://localhost:5000
```

---

### 3️⃣ تشغيل الـ Frontend

في terminal جديد:

```bash
npm run dev
```

يجب أن يفتح على:
```
http://localhost:5173
```

---

### 4️⃣ الدخول للوحة التحكم

1. **افتح المتصفح على**: `http://localhost:5173/admin-control-panel`

2. **إذا لم تكن مسجل دخول**:
   - سيتم تحويلك للـ Login
   - سجل دخول بحساب Admin

3. **إنشاء حساب Admin (إذا لم يكن موجود)**:
   
   يمكنك إنشاء حساب admin مباشرة من قاعدة البيانات:

   ```bash
   cd backend
   npx prisma studio
   ```

   ثم:
   - افتح جدول `User`
   - أضف مستخدم جديد
   - اختر Role: `ADMIN`
   - أدخل email وpassword (سيتم تشفيره تلقائياً)

   **أو استخدم هذا الكود في seed.js**:

   ```javascript
   // أضف هذا في backend/prisma/seed.js
   const admin = await prisma.user.create({
     data: {
       email: 'admin@hotel.com',
       password: await bcrypt.hash('admin123', 10),
       role: 'ADMIN',
       firstName: 'Super',
       lastName: 'Admin'
     }
   });
   ```

   ثم نفذ:
   ```bash
   npx prisma db seed
   ```

---

## 🎯 الوصول السريع

### الروابط المباشرة:

- **لوحة التحكم الإدارية**: `http://localhost:5173/admin-control-panel`
- **الصفحة الرئيسية**: `http://localhost:5173/`
- **تسجيل الدخول**: `http://localhost:5173/login`

---

## ✅ التحقق من التثبيت

### تأكد أن كل شيء يعمل:

1. ✅ Backend يعمل على port 5000
2. ✅ Frontend يعمل على port 5173
3. ✅ قاعدة البيانات متصلة
4. ✅ Migration تم تطبيقها
5. ✅ يمكنك الوصول للوحة التحكم

### اختبار APIs:

افتح Postman أو استخدم curl:

```bash
# Test Floors API
curl http://localhost:5000/api/floors

# Test Features API
curl http://localhost:5000/api/features

# Test Food API
curl http://localhost:5000/api/food
```

---

## 🔧 حل المشاكل الشائعة

### مشكلة: لا يمكن تطبيق Migration

**الحل**:
```bash
cd backend
npx prisma migrate reset
npx prisma migrate dev
npx prisma generate
```

---

### مشكلة: "Cannot connect to database"

**الحل**:
1. تأكد أن PostgreSQL يعمل
2. تحقق من `.env` في مجلد backend:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/hotel_db"
   JWT_SECRET="your-secret-key"
   ```

---

### مشكلة: "Unauthorized" عند الوصول للوحة التحكم

**الحل**:
1. تأكد أنك مسجل دخول
2. تأكد أن الـ role هو `ADMIN`
3. امسح الـ localStorage وسجل دخول مجدداً

---

## 📱 الاستخدام الأول

### بعد تسجيل الدخول كـ Admin:

1. **أضف أول طابق**:
   - اذهب لـ Floors
   - اضغط "Add New Floor"
   - أدخل: Floor Number: 1, Name: "Ground Floor"
   - احفظ

2. **أضف أول غرفة**:
   - اذهب لـ Rooms
   - اضغط "Add New Room"
   - أدخل البيانات الأساسية
   - احفظ

3. **أضف ميزة**:
   - اذهب لـ Features
   - اضغط "Add New Feature"
   - مثلاً: Name: "WiFi", Icon: "📶", Category: "room"
   - احفظ

4. **أضف صنف طعام**:
   - اذهب لـ Food & Dining
   - اضغط "Add New Item"
   - مثلاً: Name: "Grilled Salmon", Price: 29.99
   - احفظ

---

## 🎉 تم التفعيل بنجاح!

الآن لديك:
- ✅ لوحة تحكم إدارية كاملة
- ✅ إدارة الطوابق والغرف
- ✅ إدارة الميزات والخدمات
- ✅ إدارة الطعام والمطاعم
- ✅ عرض المستخدمين والحجوزات
- ✅ Dashboard مع إحصائيات

**كل شيء جاهز للاستخدام والتقييم الأكاديمي! 🚀**

---

## 📞 ملاحظات مهمة

1. **كل البيانات محفوظة في قاعدة البيانات**
   - لا فقدان بيانات عند إعادة التشغيل

2. **لا حاجة لتعديل الكود أبداً**
   - كل شيء يُدار من لوحة التحكم

3. **نظام الصلاحيات محمي**
   - Admin فقط يمكنه الوصول

4. **التصميم احترافي وفاخر**
   - يليق بنظام إدارة فندق حقيقي

**استمتع باستخدام نظام إدارة الفندق الاحترافي! 🏨✨**
