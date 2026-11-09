# Graph Report - Gift-Store  (2026-10-06)

## Corpus Check
- 167 files · ~184,161 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 24 file(s) not represented in the graph (top: .xml 10, (none) 3, .apk 2)

## Summary
- 935 nodes · 1792 edges · 70 communities (43 shown, 17 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- utils.ts
- react
- @prisma/client
- settings-client.tsx
- orders-client.tsx
- website/package.json
- dependencies
- cn
- 🔌 مرجع الـ Server Actions ونقاط الـ API | Actions & APIs Reference
- android-app/package.json
- shop-client.tsx
- src/auth.ts
- components.json
- Writing apps with Prisma Composer
- Writing apps with Prisma Composer
- Writing apps with Prisma Composer
- Writing apps with Prisma Composer
- prisma.ts
- next
- order-details-client.tsx
- compilerOptions
- 🎁 گِفتي بلس | Gifty Plus
- products-client.tsx
- admin-header.tsx
- scripts
- manifest.json
- users.ts
- 💼 دليل الإدارة والعمليات التنفيذية | Store Administration Guide
- devDependencies
- actions/orders.ts
- 📐 المعمارية البرمجية والهندسية | System Architecture
- ExampleInstrumentedTest.java
- 📱 دليل تطبيق الأندرويد الأصلي | Native Android App Guide
- 📱 تطبيق متجر گفتي بلس للأندرويد (GiftyPlus Mobile App)
- 2. الإعداد المحلي خطوة بخطوة (Local Setup)
- categories/page.tsx
- ⚙️ دليل التثبيت والنشر السحابي | Setup & Deployment Guide
- scripts
- app/layout.tsx
- contact/page.tsx
- vercel.json
- gradlew
- 🌐 موقع متجر گفتي بلس (Gift-Store Web Application)
- about/page.tsx
- gift-finder/page.tsx
- track-order/page.tsx
- com.getcapacitor.BridgeActivity
- check_images.ts
- get_lint_errors.ts
- hero-slides/page.tsx
- new/page.tsx
- rules/graphify.md
- workflows/graphify.md
- Gift-Store/AGENTS.md
- capacitor.config.ts
- website/AGENTS.md
- eslint.config.mjs
- prisma
- postcss.config.mjs
- { GET, POST }

## God Nodes (most connected - your core abstractions)
1. `cn()` - 111 edges
2. `react` - 69 edges
3. `lucide-react` - 53 edges
4. `prisma` - 30 edges
5. `Button()` - 26 edges
6. `framer-motion` - 25 edges
7. `sonner` - 24 edges
8. `@prisma/client` - 24 edges
9. `useMounted()` - 22 edges
10. `useCartStore` - 21 edges

## Surprising Connections (you probably didn't know these)
- `RootLayout()` --calls--> `cn()`  [EXTRACTED]
  Gift-Store/website/src/app/layout.tsx → Gift-Store/website/src/lib/utils.ts
- `DropdownMenuSubTrigger()` --calls--> `cn()`  [EXTRACTED]
  Gift-Store/website/src/components/ui/dropdown-menu.tsx → Gift-Store/website/src/lib/utils.ts
- `DropdownMenuSubContent()` --calls--> `cn()`  [EXTRACTED]
  Gift-Store/website/src/components/ui/dropdown-menu.tsx → Gift-Store/website/src/lib/utils.ts
- `DropdownMenuCheckboxItem()` --calls--> `cn()`  [EXTRACTED]
  Gift-Store/website/src/components/ui/dropdown-menu.tsx → Gift-Store/website/src/lib/utils.ts
- `DropdownMenuRadioItem()` --calls--> `cn()`  [EXTRACTED]
  Gift-Store/website/src/components/ui/dropdown-menu.tsx → Gift-Store/website/src/lib/utils.ts

## Import Cycles
- None detected.

## Communities (70 total, 17 thin omitted)

### Community 0 - "utils.ts"
Cohesion: 0.06
Nodes (61): getPublicStoreSettings(), AdminLayoutClient(), CartPage(), FavoritesClient(), metadata, Product, Category, CATEGORY_FALLBACKS (+53 more)

### Community 1 - "react"
Cohesion: 0.07
Nodes (42): createProduct(), updateProduct(), Category, OrderDetailsModalProps, paymentMethodMap, paymentStatusMap, statusConfig, EditProductClient() (+34 more)

### Community 2 - "@prisma/client"
Cohesion: 0.05
Nodes (25): prisma, prisma, prisma, validImages, prisma, prisma, defaultImages, imagesMap (+17 more)

### Community 3 - "settings-client.tsx"
Cohesion: 0.09
Nodes (33): createHeroSlide(), CreateHeroSlideInput, DEFAULT_SLIDES, deleteHeroSlide(), ensureDefaultSlidesExist(), getHeroSlides(), HeroSlideData, reorderHeroSlides() (+25 more)

### Community 4 - "orders-client.tsx"
Cohesion: 0.10
Nodes (24): deleteOrder(), OrderData, OrdersClient(), statusConfig, statusFilters, AdminSidebar(), roleLabels, SidebarGroup (+16 more)

### Community 5 - "website/package.json"
Cohesion: 0.06
Nodes (30): @capacitor/android, @capacitor/app, @capacitor/cli, @capacitor/core, @capacitor/splash-screen, @capacitor/status-bar, name, private (+22 more)

### Community 6 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @auth/prisma-adapter, @base-ui/react, bcryptjs, @capacitor/android, @capacitor/app, @capacitor/cli, @capacitor/core (+22 more)

### Community 7 - "cn"
Cohesion: 0.12
Nodes (25): StatCard(), StatCardProps, Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage() (+17 more)

### Community 8 - "🔌 مرجع الـ Server Actions ونقاط الـ API | Actions & APIs Reference"
Cohesion: 0.07
Nodes (26): 1. إجراءات متجر الزبائن, 2. إجراءات لوحة الإدارة, 3. نقاط الـ API المتخصصة, 4. مكتبة المساعدات والدوال الذكية, `cleanIraqiWhatsAppNumber(rawNumber: string): string`, `createHeroSlide(data: CreateSlideInput)` / `updateHeroSlideOrder(slides: { id: string; order: number }[])`, `createOrder(data: CreateOrderInput)`, `createProduct(formData: ProductFormData)` (+18 more)

### Community 9 - "android-app/package.json"
Cohesion: 0.09
Nodes (22): dependencies, @capacitor/android, @capacitor/app, @capacitor/cli, @capacitor/core, @capacitor/splash-screen, @capacitor/status-bar, description (+14 more)

### Community 10 - "shop-client.tsx"
Cohesion: 0.14
Nodes (17): getPublicHeroSlides(), getCategories(), getArabicSearchVariants(), getProducts(), getTopProducts(), searchProducts(), dynamic, StoreHome() (+9 more)

### Community 11 - "src/auth.ts"
Cohesion: 0.09
Nodes (12): dynamic, FormattedUser, UsersClient(), ALLOWED_MIME_TYPES, { handlers, signIn, signOut, auth }, next-auth, Session, User (+4 more)

### Community 12 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 13 - "Writing apps with Prisma Composer"
Cohesion: 0.10
Nodes (19): Anatomy of a service, Builds are yours, Databases, Deploy config, Deploying, Driving deploys from code, Object Storage, Production pitfalls (+11 more)

### Community 14 - "Writing apps with Prisma Composer"
Cohesion: 0.10
Nodes (19): Anatomy of a service, Builds are yours, Databases, Deploy config, Deploying, Driving deploys from code, Object Storage, Production pitfalls (+11 more)

### Community 15 - "Writing apps with Prisma Composer"
Cohesion: 0.10
Nodes (19): Anatomy of a service, Builds are yours, Databases, Deploy config, Deploying, Driving deploys from code, Object Storage, Production pitfalls (+11 more)

### Community 16 - "Writing apps with Prisma Composer"
Cohesion: 0.10
Nodes (19): Anatomy of a service, Builds are yours, Databases, Deploy config, Deploying, Driving deploys from code, Object Storage, Production pitfalls (+11 more)

### Community 17 - "prisma.ts"
Cohesion: 0.13
Nodes (4): dynamic, dynamic, dynamic, prisma

### Community 18 - "next"
Cohesion: 0.11
Nodes (8): nextConfig, AdminLoginClient(), metadata, faqs, metadata, metadata, metadata, next

### Community 19 - "order-details-client.tsx"
Cohesion: 0.18
Nodes (14): getOrderDetails(), updateOrderStatus(), updateOrderTracking(), updatePaymentStatus(), OrderDetailsClient(), paymentMethodMap, paymentStatusMap, statusConfig (+6 more)

### Community 20 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 21 - "🎁 گِفتي بلس | Gifty Plus"
Cohesion: 0.11
Nodes (18): 1. استنساخ المشروع (Clone Repository), 2. تثبيت الحزم (Install Dependencies), 3. إعداد متغيرات البيئة (Environment Variables), 4. مزامنة قاعدة البيانات وتوليد عميل Prisma, 5. تشغيل بيئة التطوير المحلية, 🔒 الأمان وحماية البيانات (Security), 🚀 البدء السريع والتثبيت (Quick Start), 🛠️ البنية التقنية (Tech Stack) (+10 more)

### Community 22 - "products-client.tsx"
Cohesion: 0.18
Nodes (14): deleteProduct(), deleteProducts(), ProductModal(), ProductsClient(), ProductWithCategory, Checkbox(), Table(), TableBody() (+6 more)

### Community 23 - "admin-header.tsx"
Cohesion: 0.16
Nodes (13): ADMIN_SEARCH_INDEX, AdminHeader(), AdminSearchDestination, normalizeArabicText(), sidebarGroups, Sheet(), SheetContent(), SheetDescription() (+5 more)

### Community 24 - "scripts"
Cohesion: 0.14
Nodes (13): description, name, private, scripts, app:build, app:sync, build, dev (+5 more)

### Community 25 - "manifest.json"
Cohesion: 0.14
Nodes (13): background_color, categories, description, dir, display, icons, lang, name (+5 more)

### Community 26 - "users.ts"
Cohesion: 0.18
Nodes (8): ADMIN_ROLES, changePassword(), createStaffUser(), deleteStaffUser(), STAFF_VIEW_ROLES, updateProfile(), dynamic, ProfileClient()

### Community 27 - "💼 دليل الإدارة والعمليات التنفيذية | Store Administration Guide"
Cohesion: 0.15
Nodes (13): 1. لوحة المؤشرات والتحليلات, 2. إدارة المنتجات بالنافذة العائمة, 3. دورة حياة الطلبات وإشعارات WhatsApp, 4. محرك إعدادات المتجر الشامل, 5. استوديو شرائح السلايدر التفاعلي, 6. إدارة المستخدمين والأدوار, 🌟 أبرز مميزات قسم السيو والنظام:, إضافة منتج جديد: (+5 more)

### Community 28 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, eslint, eslint-config-next, prisma, @prisma/client, tailwindcss, @tailwindcss/postcss, ts-node (+5 more)

### Community 29 - "actions/orders.ts"
Cohesion: 0.23
Nodes (11): cleanWhatsAppNumber(), createOrderAction(), createWhatsAppOrderAction(), generateOrderNumber(), trackOrderPublicAction(), WhatsAppOrderInput, WhatsAppOrderItemInput, getStepIndex() (+3 more)

### Community 30 - "📐 المعمارية البرمجية والهندسية | System Architecture"
Cohesion: 0.17
Nodes (12): 1. نظرة عامة على المعمارية (Architectural Overview), 2. هيكلية المسارات (Route Hierarchy & Separation), 3. مخطط علاقات قاعدة البيانات (Entity Relationship Diagram - ERD), 4. نموذج تدفق البيانات وإجراءات السيرفر (Data Flow & Server Actions), 5. إدارة الحالة في واجهة المستخدم (State Management Strategy), 6. نظام الألوان وهوية التصميم (Design System & Color Tokens), 7. أمان النظام والصلاحيات (Security & RBAC), أ. واجهة المتجر `src/app/(store)` (+4 more)

### Community 31 - "ExampleInstrumentedTest.java"
Cohesion: 0.33
Nodes (5): androidx.test.ext.junit.runners.AndroidJUnit4, ExampleInstrumentedTest, ExampleUnitTest, org.junit.runner.RunWith, org.junit.Test

### Community 32 - "📱 دليل تطبيق الأندرويد الأصلي | Native Android App Guide"
Cohesion: 0.22
Nodes (9): الطريقة الأولى: عبر سطر الأوامر (Command Line), الطريقة الثانية: عبر برنامج Android Studio (موصى بها للمطورين), 🌐 تثبيت PWA البديل السريع (بدون ملف APK), تطبيق متجر گِفتي بلس للأندرويد (Gifty Plus Android Application), 📱 دليل تطبيق الأندرويد الأصلي | Native Android App Guide, 🛠️ كيفية استخراج ملف الـ APK وتثبيته على الهاتف, 📲 كيفية تثبيت التطبيق على هاتف العميل أو المدير, 🌟 ميزات تطبيق الأندرويد (+1 more)

### Community 33 - "📱 تطبيق متجر گفتي بلس للأندرويد (GiftyPlus Mobile App)"
Cohesion: 0.25
Nodes (7): 1. فتح المشروع في Android Studio, 2. إعادة تجميع وبناء ملف الـ APK عبر السطر البرمجي, 3. مزامنة التغييرات, 📱 تطبيق متجر گفتي بلس للأندرويد (GiftyPlus Mobile App), 🚀 كيفية تثبيت التطبيق على هاتفك فوراً, 🛠️ للمطورين: كيفية فتح المشروع وإعادة البناء, 📦 محتويات المجلد

### Community 34 - "2. الإعداد المحلي خطوة بخطوة (Local Setup)"
Cohesion: 0.25
Nodes (8): 2. الإعداد المحلي خطوة بخطوة (Local Setup), خطوة 1: استنساخ المستودع, خطوة 2: تثبيت الحزم البرمجية, خطوة 3: إعداد متغيرات البيئة (`.env`), خطوة 4: تشغيل قاعدة البيانات محلياً عبر Docker (اختياري), خطوة 5: مزامنة مخطط قاعدة البيانات, خطوة 6: إضافة البيانات التجريبية (Database Seeding), خطوة 7: تشغيل خادم التطوير

### Community 35 - "categories/page.tsx"
Cohesion: 0.32
Nodes (5): createCategory(), deleteCategory(), updateCategory(), CategoriesClient(), dynamic

### Community 36 - "⚙️ دليل التثبيت والنشر السحابي | Setup & Deployment Guide"
Cohesion: 0.29
Nodes (6): 1. المتطلبات الأساسية (Prerequisites), 3. النشر على منصة Vercel السحابية (Vercel Production Deployment), 4. قائمة التحقق قبل الإطلاق الفعلي (Production Launch Checklist), خطوات النشر:, ⚙️ دليل التثبيت والنشر السحابي | Setup & Deployment Guide, منصة گِفتي بلس (Gifty Plus Deployment & DevOps Manual)

### Community 37 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, dev, lint, postinstall, start

### Community 38 - "app/layout.tsx"
Cohesion: 0.33
Nodes (4): alexandria, readex, RootLayout(), viewport

### Community 39 - "contact/page.tsx"
Cohesion: 0.40
Nodes (3): ContactForm(), dynamic, metadata

### Community 40 - "vercel.json"
Cohesion: 0.40
Nodes (4): buildCommand, framework, outputDirectory, $schema

### Community 41 - "gradlew"
Cohesion: 0.83
Nodes (3): gradlew script, die(), warn()

### Community 43 - "🌐 موقع متجر گفتي بلس (Gift-Store Web Application)"
Cohesion: 0.50
Nodes (3): 🚀 أوامر التشغيل السريع, 📦 محتويات المجلد, 🌐 موقع متجر گفتي بلس (Gift-Store Web Application)

## Knowledge Gaps
- **442 isolated node(s):** `config`, `name`, `version`, `private`, `description` (+437 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 531 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **17 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `utils.ts`, `@prisma/client`, `settings-client.tsx`, `categories/page.tsx`, `website/package.json`, `orders-client.tsx`, `contact/page.tsx`, `cn`, `shop-client.tsx`, `order-details-client.tsx`, `products-client.tsx`, `admin-header.tsx`, `users.ts`, `actions/orders.ts`?**
  _High betweenness centrality (0.092) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `react` to `utils.ts`, `@prisma/client`, `settings-client.tsx`, `orders-client.tsx`, `website/package.json`, `contact/page.tsx`, `cn`, `shop-client.tsx`, `about/page.tsx`, `next`, `order-details-client.tsx`, `products-client.tsx`, `admin-header.tsx`, `actions/orders.ts`?**
  _High betweenness centrality (0.063) - this node is a cross-community bridge._
- **Why does `cn()` connect `cn` to `utils.ts`, `react`, `settings-client.tsx`, `orders-client.tsx`, `app/layout.tsx`, `shop-client.tsx`, `order-details-client.tsx`, `products-client.tsx`, `admin-header.tsx`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._
- **What connects `config`, `name`, `version` to the rest of the system?**
  _442 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `utils.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05798319327731093 - nodes in this community are weakly interconnected._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.07377295995182175 - nodes in this community are weakly interconnected._
- **Should `@prisma/client` be split into smaller, more focused modules?**
  _Cohesion score 0.04698581560283688 - nodes in this community are weakly interconnected._