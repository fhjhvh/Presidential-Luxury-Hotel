# دليل نشر المشروع (قاعدة البيانات + الباك إند + الفرونت إند)

هذا الدليل ينشر المشروع مجاناً على ثلاث منصّات:

| الطبقة | المنصّة | الرابط |
|--------|---------|--------|
| قاعدة البيانات MySQL | **Aiven** | https://aiven.io |
| الباك إند (Node/Express) | **Render** | https://render.com |
| الفرونت إند (React/Vite) | **Vercel** | https://vercel.com |

> ⚠️ مهم: ادفع هذه الملفات الجديدة (`vercel.json` و `render.yaml` و هذا الدليل) إلى مستودع GitHub أولاً، لأن Render و Vercel يسحبان الكود من GitHub.

---

## الخطوة 0: رفع التعديلات إلى GitHub

```bash
git add vercel.json render.yaml DEPLOYMENT_AR.md
git commit -m "Add deployment config for Render + Vercel"
git push
```

---

## الخطوة 1: قاعدة البيانات على Aiven

1. سجّل دخول إلى https://aiven.io ثم **Create service**.
2. اختر **MySQL** → الخطة المجانية **Free plan** → اختر مزوّداً ومنطقة قريبة منك.
3. انتظر حتى تتحول الحالة إلى **Running** (دقيقتان تقريباً).
4. من صفحة الخدمة، انسخ **Service URI**. سيكون بهذا الشكل:
   ```
   mysql://avnadmin:كلمة_المرور@HOST:PORT/defaultdb?ssl-mode=REQUIRED
   ```
5. **عدّل الرابط لـ Prisma**: استبدل النهاية `?ssl-mode=REQUIRED` بـ `?sslaccept=accept_invalid_certs`.
   النتيجة النهائية (هذه هي قيمة `DATABASE_URL` التي ستضعها في Render):
   ```
   mysql://avnadmin:كلمة_المرور@HOST:PORT/defaultdb?sslaccept=accept_invalid_certs
   ```

> سبب التعديل: Prisma لا يفهم `ssl-mode`، ويحتاج `sslaccept` لتفعيل الاتصال المشفّر مع Aiven.

---

## الخطوة 2: الباك إند على Render

1. سجّل دخول إلى https://render.com بحساب GitHub.
2. **New +** → **Blueprint** → اختر مستودع `Presidential-Luxury-Hotel`.
   - سيقرأ Render ملف `render.yaml` تلقائياً وينشئ خدمة باسم `hotel-backend`.
   - (بديل يدوي: **New + → Web Service**، Root Directory = `backend`،
     Build Command = `npm install && npx prisma generate && npx prisma migrate deploy`،
     Start Command = `npm start`.)
3. عند طلب متغيّرات البيئة، أدخِل:
   - `DATABASE_URL` = الرابط المعدّل من الخطوة 1.
   - `JWT_SECRET` = سيُولّد تلقائياً (أو اكتب نصاً عشوائياً طويلاً).
   - `OPENAI_API_KEY` = مفتاح OpenAI إن كنت تريد ميزة المحادثة الذكية، وإلا اتركه فارغاً.
   - الباقي (`JWT_EXPIRES_IN`, `NODE_ENV`) مضبوط مسبقاً.
4. اضغط **Deploy / Apply**. سيُنفّذ البناء و migrations (إنشاء الجداول) تلقائياً.
5. بعد نجاح النشر، انسخ رابط الخدمة، مثل:
   ```
   https://hotel-backend-xxxx.onrender.com
   ```
6. **تعبئة البيانات الأولية (مرة واحدة فقط):** من صفحة الخدمة في Render افتح تبويب **Shell** ونفّذ:
   ```bash
   node prisma/seed.js
   ```
   سيُنشئ المستخدمين والغرف والطوابق التجريبية.

> ملاحظة: الخطة المجانية في Render "تنام" بعد فترة خمول، فأول طلب بعد النوم قد يستغرق ~30 ثانية.

---

## الخطوة 3: الفرونت إند على Vercel

1. سجّل دخول إلى https://vercel.com بحساب GitHub.
2. **Add New → Project** → اختر مستودع `Presidential-Luxury-Hotel`.
3. الإعدادات (يكتشفها Vercel تلقائياً لأنه Vite):
   - Framework Preset: **Vite**
   - Root Directory: `.` (جذر المستودع — اتركه كما هو)
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. أضِف متغيّر بيئة **Environment Variable**:
   - الاسم: `VITE_API_URL`
   - القيمة: رابط Render مع `/api` في النهاية، مثل:
     ```
     https://hotel-backend-xxxx.onrender.com/api
     ```
5. اضغط **Deploy**. بعد ثوانٍ ستحصل على رابط مثل:
   ```
   https://presidential-luxury-hotel.vercel.app
   ```
   هذا هو رابط الموقع (نطاق مجاني من Vercel).

> إن غيّرت `VITE_API_URL` لاحقاً، يجب إعادة النشر (Redeploy) لأن Vite يحقن المتغيّر وقت البناء.

---

## الخطوة 4: التحقق من العمل

1. افتح رابط Vercel.
2. سجّل الدخول ببيانات الاختبار (بعد تشغيل seed):
   - مدير: `admin@hotel.com` / `password123`
   - استقبال: `reception@hotel.com` / `password123`
   - نزيل: `guest@example.com` / `password123`
3. تأكد من ظهور الغرف والحجوزات. إن ظهر خطأ شبكة، راجع أن `VITE_API_URL` صحيح وأن خدمة Render تعمل.

---

## ترتيب النشر الصحيح
```
Aiven (قاعدة البيانات)  →  Render (الباك + DATABASE_URL)  →  Vercel (الفرونت + VITE_API_URL)
```
لأن كل طبقة تحتاج رابط الطبقة التي قبلها.
