# ⚙️ دليل التثبيت والنشر السحابي | Setup & Deployment Guide
### منصة گِفتي بلس (Gifty Plus Deployment & DevOps Manual)

---

## 1. المتطلبات الأساسية (Prerequisites)

قبل البدء في تثبيت المشروع على بيئة التطوير المحلية أو إعداده للإنتاج، تأكد من توافر الأدوات التالية:
- **Node.js**: الإصدار `18.18.0` أو أعلى (يوصى بـ `Node.js 20.x LTS`).
- **npm** (أو `pnpm` / `bun`).
- **PostgreSQL**: الإصدار 14 أو أحدث (محلياً أو عبر سحابة مثل Neon أو Supabase).
- **Git** لإدارة الإصدارات.

---

## 2. الإعداد المحلي خطوة بخطوة (Local Setup)

### خطوة 1: استنساخ المستودع
```bash
git clone https://github.com/sasuke9292/Gift-Store.git
cd Gift-Store
```

### خطوة 2: تثبيت الحزم البرمجية
```bash
npm install
```

### خطوة 3: إعداد متغيرات البيئة (`.env`)
قم بنسخ أو إنشاء ملف `.env` في جذر المشروع، وقم بتعيين المتغيرات الأساسية:

```env
# رابط الاتصال بقاعدة بيانات PostgreSQL
DATABASE_URL="postgresql://postgres:password@localhost:5432/gift_store?schema=public"

# مفتاح التشفير لجلسات NextAuth (استخدم مفتاحاً عشوائياً قوياً)
AUTH_SECRET="your-ultra-secure-random-secret-key-32-characters-min"
NEXTAUTH_SECRET="your-ultra-secure-random-secret-key-32-characters-min"

# الرابط الأساسي للموقع في بيئة التطوير
NEXTAUTH_URL="http://localhost:3000"
```

> **ملاحظة أمان:** لا تقم أبداً بمشاركة ملف `.env` أو رفعه إلى مستودعات Git العامة.

### خطوة 4: تشغيل قاعدة البيانات محلياً عبر Docker (اختياري)
إذا لم يكن لديك خادم PostgreSQL مثبت محلياً، يمكنك استخدام ملف `docker-compose.yml` المرفق مع المشروع:
```bash
docker compose up -d
```

### خطوة 5: مزامنة مخطط قاعدة البيانات
قم بإنشاء وتحديث الجداول في قاعدة البيانات عبر Prisma:
```bash
# دفع المخطط وتطبيق التحديثات
npx prisma db push

# توليد عميل Prisma Client
npx prisma generate
```

### خطوة 6: إضافة البيانات التجريبية (Database Seeding)
لتعبئة قاعدة البيانات بمنتجات وتصنيفات وإعدادات افتراضية أولية:
```bash
npm run seed
# أو
npx ts-node prisma/seed.ts
```

### خطوة 7: تشغيل خادم التطوير
```bash
npm run dev
```
سيكون الموقع متاحاً على:
- المتجر: [http://localhost:3000](http://localhost:3000)
- لوحة الإدارة: [http://localhost:3000/admin](http://localhost:3000/admin)
- مستكشف Prisma Studio لإدارة البيانات بصرياً:
```bash
npx prisma studio
```

---

## 3. النشر على منصة Vercel السحابية (Vercel Production Deployment)

تعتبر منصة **Vercel** بيئة الاستضافة المثالية للمشروع حيث تم تحسينه خصيصاً لدعم Next.js 16 مع Turbopack.

### خطوات النشر:
1. **ربط المستودع:**
   - توجه إلى [Vercel Dashboard](https://vercel.com/dashboard).
   - اختر **"Add New Project"** واستورد مستودع `Gift-Store` من حساب GitHub الخاص بك.

2. **تكوين إعدادات البناء (Build Settings):**
   - **Framework Preset:** `Next.js`
   - **Build Command:** `prisma db push --accept-data-loss && next build` *(مضبوط مسبقاً في `package.json`)*
   - **Install Command:** `npm install`

3. **تعيين متغيرات البيئة في Vercel (Environment Variables):**
   أضف المتغيرات التالية في قسم **Settings > Environment Variables**:
   - `DATABASE_URL`: رابط الاتصال بقاعدة بياناتك السحابية (مثل Neon Postgres مع تفعيل اتصال Pooling `?sslmode=require`).
   - `AUTH_SECRET`: مفتاح تشفير أمني عشوائي.
   - `NEXTAUTH_SECRET`: نفس مفتاح `AUTH_SECRET`.
   - `NEXTAUTH_URL`: رابط موقعك المباشر في Vercel (مثال: `https://gift-store-rl7i-three.vercel.app`).

4. **إطلاق النشر (Deploy):**
   انقر على زر **Deploy**. ستقوم Vercel تلقائياً ببناء التطبيق ورفع حزم الـ Server Components وربط الـ Edge Middleware.

---

## 4. قائمة التحقق قبل الإطلاق الفعلي (Production Launch Checklist)

- [x] **تأمين كلمة مرور الأدمن:** تغيير كلمة المرور الافتراضية لحسابات المدراء.
- [x] **فحص الـ SSL والتشفير:** التأكد من سريان شهادة HTTPS على الرابط المخصص.
- [x] **ضبط بيانات المتجر والواتساب:** التأكد من وضع رقم الواتساب العراقي الصحيح في لوحة التحكم (`9647xxxxxxxxx`).
- [x] **مراجعة محركات البحث (SEO):** التحقق من ملء حقول `Meta Title` و `Meta Description` ورفع صورة الشعار ومفضلات المتصفح (Favicon).
- [x] **فحص أجور التوصيل:** تحديد أجور شحن بغداد والمحافظات وحد الشحن المجاني بما يطابق الاتفاق مع شركة التوصيل المحلية.
- [x] **فحص بوابات الدفع:** مراجعة أرقام التحويل لمحفظة زين كاش ومصرف FIB أو تفعيل الدفع عند الاستلام.
