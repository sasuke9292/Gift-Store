<div align="center">

# 🎁 گِفتي بلس | Gifty Plus
### منصة التجارة الإلكترونية المتكاملة للهدايا الفاخرة في العراق
**The Premier Luxury Gifting E-Commerce Platform in Iraq**

[![Next.js](https://img.shields.io/badge/Next.js-16.3.3%20Turbopack-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Android](https://img.shields.io/badge/Android-Native%20APK-3DDC84?style=for-the-badge&logo=android)](./android)
[![Deployment](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel)](https://gift-store-rl7i-three.vercel.app)

[🌐 معاينة المتجر المباشرة (Live Demo)](https://gift-store-rl7i-three.vercel.app) • [📱 تطبيق الأندرويد (Android App)](./docs/ANDROID_APP_GUIDE.md) • [🔐 لوحة تحكم الإدارة (Admin Panel)](https://gift-store-rl7i-three.vercel.app/admin) • [📖 التوثيق الشامل (Docs)](./docs)

---

</div>

## 📌 نبذة عن المشروع (About The Project)

**گِفتي بلس (Gifty Plus)** هو متجر إلكتروني فاخر تم بناؤه بأحدث تقنيات الويب الحديثة (Next.js 16 مع محرك Turbopack و React 19) ليكون الوجهة الأولى لتنسيق واختيار الهدايا الراقية في العراق.

يجمع المشروع بين **تجربة واجهة عملاء ساحرة واستثنائية (Storefront)** تعتمد على الأناقة الملكية والسرعة الفائقة، و**لوحة تحكم إدارية تنفيذية متكاملة (Executive Admin Suite)** تتيح للمدير التحكم الكامل والفوري في أدق تفاصيل المتجر: المنتجات، الطلبات، السلايدر، المحتوى، بوابات الدفع المحلية (زين كاش، FIB، الدفع عند الاستلام)، وربط الواتساب الذكي للطلب والإشعارات.

---

## ✨ المميزات الرئيسية (Key Highlights)

### 🛍️ واجهة المتجر وتجربة الزبون (Storefront Experience)
- **سلايدر تفاعلي فاخر (Hero Showcase Slider):** عرض جذاب لأحدث التشكيلات والشارات الترويجية مع تحكم كامل بالصور والعناوين من لوحة الإدارة.
- **دليل الإهداء والمهدى له (Curated Gifting Personas):** تصنيفات مخصصة للهدايا (هدايا لها، هدايا له، مناسبات وأفراح، هدايا مخصصة ومحفورة بالاسم).
- **مكتشف الهدايا الذكي (Smart Gift Finder):** أداة مساعدة تفاعلية ترشد الزبون لاختيار الهدية المثالية بناءً على المناسبة، الشخص، والميزانية.
- **تخصيص الهدايا والتغليف الملكي:** خيارات كتابة كارت إهداء بكلمات الزبون وتحديد نوع التغليف والإكسسوارات.
- **تتبع فوري ومباشر للطلبات (`/track-order`):** نظام بحث فوري برقم الطلب ورقم الهاتف يوضح حالة الشحنة بدقة.
- **نظام الطلب المباشر عبر واتساب:** تحويل محتويات السلة وتفاصيل الزبون والعنوان تلقائياً إلى رسالة واتساب منسقة وموجهة لرقم المتجر مع تنسيق الأرقام العراقية الدولية تلقائياً (`+964`).
- **بوابات الدفع المحلية العراقية:** دعم الدفع عند الاستلام (COD)، محفظة زين كاش (ZainCash)، والمصرف العراقي الأول (FIB).
- **تصميم متجاوب وسريع (Mobile-First Luxury UI):** شريط تنقل سفلي ذكي للهواتف، سلة مشتريات عائمة، ومؤثرات حركية فائقة النعومة بـ Framer Motion.

### 🛡️ لوحة التحكم والإدارة التنفيذية (Executive Admin Suite)
- **لوحة مؤشرات تحليلية فورية (Analytics Dashboard):** إحصائيات المبيعات، نمو الطلبات، متوسط قيمة السلة، ومخططات بيانية تفاعلية بـ Recharts.
- **إدارة المنتجات بنافذة عائمة (Floating Modal Product CRUD):** إضافة وتعديل وحذف المنتجات ورفع الصور وإدارة المخزون من نفس التبويب بنافذة منبثقة تفاعلية دون مغادرة الصفحة أو إعادة التحميل.
- **إدارة الطلبات والشحن الذكي:** فلترة شاملة لحالات الطلب (قيد المراجعة، تم التأكيد، جاري التجهيز، تم الشحن، مكتمل، ملغى، مرتجع).
- **إشعارات واتساب بنقرة زر (1-Click WhatsApp Status Updates):** توليد رسائل حالة الطلب المهنية والمخصصة باسم الزبون ورقم طلبه وإرسالها فوراً لواتساب العميل.
- **محرك إعدادات المتجر المبوب والمطور (Categorized 2-Column Settings):**
  - **واجهة المتجر والمظهر:** الهوية، اللوجو، الفافيكون، السلايدر، الإهداء، الترويسة، القوائم، والفوتر.
  - **المبيعات والشحن:** حدود الشحن المجاني وتكاليف التوصيل لبغداد والمحافظات.
  - **التواصل وقنوات البيع:** إعدادات WhatsApp، بيانات الهاتف وساعات العمل، وروابط السوشيال ميديا.
  - **محركات البحث والنظام:** معاينة حية لنتائج بحث Google (Live SERP Preview)، سحابة الكلمات المفتاحية، وتنبيهات نواقص المخزون.
- **نظام صلاحيات متعدد الأدوار (RBAC):** `SUPER_ADMIN`, `ADMIN`, `MANAGER`, `SALES`, `WAREHOUSE`, `SUPPORT`, `EDITOR`, `CUSTOMER`.

---

## 🛠️ البنية التقنية (Tech Stack)

| المجال | التقنية | الاستخدام |
| :--- | :--- | :--- |
| **Framework** | [Next.js 16.3.3](https://nextjs.org/) | App Router، Server Components، Server Actions، محرك Turbopack السريع |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) | أمان البيانات والأنماط الصارمة في كامل أجزاء النظام |
| **UI Library** | [React 19](https://react.dev/) | مكتبة الواجهات البرمجية الأحدث عالمياً |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + Vanilla CSS | تنسيق عصري بنظام ألوان ملكي كحلي وذهبي مع خطوط Google العربية |
| **Components** | [shadcn/ui](https://ui.shadcn.com/) + Radix UI | عناصر واجهة مستخدم قياسية سهلة الوصول (Accessible Components) |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) | انتقالات تفاعلية ناعمة للسلايدر، النوافذ العائمة، والسلة |
| **Database & ORM** | [Prisma 5.22](https://www.prisma.io/) + [PostgreSQL](https://www.postgresql.org/) | قاعدة بيانات علائقية قوية مع استعلامات Prisma السريعة |
| **Authentication** | [NextAuth.js v5 (Auth.js Beta)](https://authjs.dev/) | توثيق آمن متعدد الجلسات مع تشفير BcryptJS وجداول مستخدمين |
| **State Management**| [Zustand 5](https://zustand-demo.pmnd.rs/) | إدارة حالة سلة المشتريات والمفضلة مع الحفظ المحلي (LocalStorage Persistence) |
| **Charts** | [Recharts](https://recharts.org/) | رسوم بيانية تفاعلية لإيرادات ومبيعات لوحة التحكم |
| **Notifications** | [Sonner](https://sonner.emilkowal.ski/) | إشعارات Toast سريعة وجمالية لكافة العمليات |
| **Hosting & CI/CD** | [Vercel](https://vercel.com/) | استضافة سحابية عالمية ونشر فوري عبر Git |

---

## 📁 هيكلية المجلدات الرئيسية (Project Structure)

تم تنظيم المشروع إلى مجلدين رئيسيين منفصلين لسهولة التطوير والإدارة:

```text
Gift-Store/
├── 📱 android-app/             # مجلد تطبيق الأندرويد الكامل (Mobile App)
│   ├── GiftyPlus.apk          # ملف التطبيق الجاهز للتثبيت المباشر على أي هاتف (5.41 MB)
│   ├── android/               # مشروع Android Studio الأصلي الكامل (Native Gradle Project)
│   ├── capacitor.config.ts    # إعدادات محرك Capacitor ومعرف الحزمة iq.giftstore.app
│   ├── package.json           # أوامر بناء وتجميع ومزامنة التطبيق
│   └── README.md              # دليل تثبيت وبناء وتشغيل تطبيق الأندرويد
│
├── 🌐 website/                # مجلد موقع المتجر الإلكتروني الكامل (Web Application)
│   ├── src/                   # كود الواجهات والمكونات وصفحات الـ App Router (Next.js 16)
│   │   ├── app/               # صفحات المتجر ولوحة تحكم المشرف والإعدادات
│   │   ├── components/        # مكتبة مكونات الواجهة وتجربة المستخدم
│   │   └── lib/               # إدارة الحالة (Zustand)، الاتصال بقاعدة البيانات (Prisma)
│   ├── public/                # الوسائط والصور وأيقونات PWA وملف manifest.json
│   ├── prisma/                # مخطط قاعدة البيانات PostgreSQL ونصوص التهيئة (Seed)
│   ├── next.config.ts         # إعدادات إطار العمل Next.js
│   ├── package.json           # حزم واعتمادات موقع الويب
│   └── README.md              # دليل تشغيل وتطوير ونشر الموقع
│
├── 📖 docs/                   # التوثيق المعماري الشامل والأدلة الإدارية
├── package.json               # إدارة الـ Workspaces الشاملة لربط الموقع والتطبيق
├── vercel.json                # ملف توجيه النشر التلقائي لسحابة Vercel
└── GiftyPlus.apk              # ملف التطبيق في المسار الرئيسي للوصول السريع
```

---

## 🚀 البدء السريع والتثبيت (Quick Start)

### المتطلبات الأساسية
- **Node.js** الإصدار 18.18+ أو 20+
- **PostgreSQL** قاعدة بيانات شغالة محلياً أو سحابياً (مثل Neon أو Supabase)
- **Git** مثبت على جهازك

### 1. استنساخ المشروع (Clone Repository)
```bash
git clone https://github.com/sasuke9292/Gift-Store.git
cd Gift-Store
```

### 2. تثبيت الحزم (Install Dependencies)
```bash
npm install
```

### 3. إعداد متغيرات البيئة (Environment Variables)
قم بإنشاء ملف `.env` في المجلد الرئيسي واملأ المتغيرات التالية:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/gift_store?schema=public"
AUTH_SECRET="your-ultra-secure-random-secret-key"
NEXTAUTH_SECRET="your-ultra-secure-random-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. مزامنة قاعدة البيانات وتوليد عميل Prisma
```bash
npx prisma db push
npx prisma generate
```

*(اختياري) لملء قاعدة البيانات بالبيانات الأولية:*
```bash
npx prisma db seed
```

### 5. تشغيل بيئة التطوير المحلية
```bash
npm run dev
```
افتح المتصفح على [http://localhost:3000](http://localhost:3000) لمشاهدة المتجر، أو [http://localhost:3000/admin](http://localhost:3000/admin) للوحة التحكم.

---

## 📚 وثائق التوثيق المتخصصة (Documentation Index)

للاطلاع على أدق التفاصيل الهندسية والتشغيلية، يرجى مراجعة ملفات التوثيق داخل مجلد `docs/`:

- 📱 **[دليل تطبيق الأندرويد الأصلي (ANDROID_APP_GUIDE.md)](./docs/ANDROID_APP_GUIDE.md):**
  شرح بنية تطبيق الأندرويد (`android/`)، بناء ملف الـ APK، التثبيت على الهاتف، وفتح المشروع في Android Studio.
- 📐 **[دليل المعمارية البرمجية (ARCHITECTURE.md)](./docs/ARCHITECTURE.md):**
  تفصيل بنية التطبيق، دورة حياة البيانات، ومخطط الكيانات العلائقي (ERD) بالتفصيل.
- 💼 **[دليل إدارة المتجر والعمليات (ADMIN_GUIDE.md)](./docs/ADMIN_GUIDE.md):**
  دليل مصور يشرح كيفية إدارة المنتجات بالبوكس العائم، متابعة الطلبات وإرسال إشعارات الواتساب، وضبط إعدادات المتجر والسيو.
- ⚙️ **[دليل التثبيت والنشر السحابي (SETUP_AND_DEPLOYMENT.md)](./docs/SETUP_AND_DEPLOYMENT.md):**
  خطوات مفصلة لبيئات الإنتاج، إعداد Vercel، ضبط قواعد بيانات PostgreSQL السحابية، وفحص الأداء.
- 🔌 **[دليل الـ Server Actions والخدمات (API_AND_ACTIONS.md)](./docs/API_AND_ACTIONS.md):**
  شرح مفصل لكافة الدوال البرمجية (Server Actions)، آليات التحقق من المدخلات، ومنطق دوال الواتساب والعملات.

---

## 🔒 الأمان وحماية البيانات (Security)
- حماية مسارات الإدارة عبر **NextAuth Middleware** للتحقق من هوية وصلاحيات المستخدمين.
- تشفير كلمات المرور باستخدام خوارزمية **BcryptJS** أحادية الاتجاه مع Salts آمنة.
- حماية ضد هجمات SQL Injection من خلال طبقة الاستعلامات البارامترية في **Prisma ORM**.
- فلترة وتطهير كافة مدخلات النماذج لمنع هجمات Cross-Site Scripting (XSS).

---

## 📄 حقوق النشر والترخيص (License)
جميع الحقوق محفوظة © 2026 لمشروع **گِفتي بلس | Gifty Plus**.
طور بكل إتقان واحترافية ليقدم أرقى معايير التجارة الإلكترونية المعاصرة.
