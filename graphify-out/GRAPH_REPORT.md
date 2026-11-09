# Graph Report - Gift-Store  (2026-11-09)

## Corpus Check
- 129 files · ~148,040 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: .ico 2, .example 1, (none) 1)

## Summary
- 734 nodes · 1556 edges · 43 communities (31 shown, 12 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c7a6a378`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- react
- product-client.tsx
- settings-client.tsx
- categories/page.tsx
- users.ts
- package.json
- 🔌 مرجع الـ Server Actions ونقاط الـ API | Actions & APIs Reference
- order-details-modal.tsx
- cn
- dependencies
- components.json
- src/auth.ts
- devDependencies
- Writing apps with Prisma Composer
- compilerOptions
- prisma.ts
- scripts
- users/page.tsx
- next
- (store)/page.tsx
- manifest.json
- 💼 دليل الإدارة والعمليات التنفيذية | Store Administration Guide
- gift-finder/page.tsx
- actions/orders.ts
- 📐 المعمارية البرمجية والهندسية | System Architecture
- 🎁 گِفتي بلس | Gifty Plus
- shop-client.tsx
- 2. الإعداد المحلي خطوة بخطوة (Local Setup)
- about/page.tsx
- ⚙️ دليل التثبيت والنشر السحابي | Setup & Deployment Guide
- 🚀 البدء السريع والتثبيت (Quick Start)
- upload/route.ts
- prisma
- app/layout.tsx
- hero-slides/page.tsx
- new/page.tsx
- vercel.json
- eslint.config.mjs
- postcss.config.mjs
- { GET, POST }
- dashboard-client.tsx
- rules/graphify.md
- workflows/graphify.md

## God Nodes (most connected - your core abstractions)
1. `cn()` - 107 edges
2. `react` - 66 edges
3. `lucide-react` - 49 edges
4. `prisma` - 30 edges
5. `Button()` - 28 edges
6. `sonner` - 22 edges
7. `framer-motion` - 21 edges
8. `next` - 18 edges
9. `@prisma/client` - 18 edges
10. `useMounted()` - 16 edges

## Surprising Connections (you probably didn't know these)
- `RootLayout()` --calls--> `cn()`  [EXTRACTED]
  src/app/layout.tsx → src/lib/utils.ts
- `StatCard()` --calls--> `cn()`  [EXTRACTED]
  src/components/admin/stat-card.tsx → src/lib/utils.ts
- `CardDescription()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/card.tsx → src/lib/utils.ts
- `CardAction()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/card.tsx → src/lib/utils.ts
- `CardFooter()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/card.tsx → src/lib/utils.ts

## Import Cycles
- None detected.

## Communities (43 total, 12 thin omitted)

### Community 0 - "react"
Cohesion: 0.07
Nodes (39): framer-motion, lucide-react, react, sonner, createProduct(), updateProduct(), Category, NewProductClient() (+31 more)

### Community 1 - "product-client.tsx"
Cohesion: 0.06
Nodes (51): @radix-ui/react-tabs, zustand, getArabicSearchVariants(), searchProducts(), CartPage(), FavoritesClient(), metadata, Category (+43 more)

### Community 2 - "settings-client.tsx"
Cohesion: 0.08
Nodes (36): @radix-ui/react-switch, createHeroSlide(), CreateHeroSlideInput, DEFAULT_SLIDES, deleteHeroSlide(), ensureDefaultSlidesExist(), getHeroSlides(), HeroSlideData (+28 more)

### Community 3 - "categories/page.tsx"
Cohesion: 0.32
Nodes (5): createCategory(), deleteCategory(), updateCategory(), CategoriesClient(), dynamic

### Community 4 - "users.ts"
Cohesion: 0.24
Nodes (7): ADMIN_ROLES, changePassword(), createStaffUser(), deleteStaffUser(), STAFF_VIEW_ROLES, updateProfile(), ProfileClient()

### Community 5 - "package.json"
Cohesion: 0.08
Nodes (23): description, name, private, version, @base-ui/react, date-fns, eslint, eslint-config-next (+15 more)

### Community 6 - "🔌 مرجع الـ Server Actions ونقاط الـ API | Actions & APIs Reference"
Cohesion: 0.07
Nodes (26): 1. إجراءات متجر الزبائن, 2. إجراءات لوحة الإدارة, 3. نقاط الـ API المتخصصة, 4. مكتبة المساعدات والدوال الذكية, `cleanIraqiWhatsAppNumber(rawNumber: string): string`, `createHeroSlide(data: CreateSlideInput)` / `updateHeroSlideOrder(slides: { id: string; order: number }[])`, `createOrder(data: CreateOrderInput)`, `createProduct(formData: ProductFormData)` (+18 more)

### Community 7 - "order-details-modal.tsx"
Cohesion: 0.05
Nodes (51): prisma, @prisma/client, checkUrl(), main(), prisma, prisma, deleteOrder(), getOrderDetails() (+43 more)

### Community 8 - "cn"
Cohesion: 0.06
Nodes (59): class-variance-authority, clsx, tailwind-merge, deleteProduct(), deleteProducts(), AdminLayoutClient(), OrderData, statusConfig (+51 more)

### Community 9 - "dependencies"
Cohesion: 0.08
Nodes (24): dependencies, @auth/prisma-adapter, @base-ui/react, bcryptjs, class-variance-authority, clsx, date-fns, framer-motion (+16 more)

### Community 10 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 11 - "src/auth.ts"
Cohesion: 0.15
Nodes (8): @auth/prisma-adapter, bcryptjs, next-auth, { handlers, signIn, signOut, auth }, next-auth, Session, User, config

### Community 12 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, eslint, eslint-config-next, prisma, @prisma/client, tailwindcss, @tailwindcss/postcss, ts-node (+5 more)

### Community 13 - "Writing apps with Prisma Composer"
Cohesion: 0.10
Nodes (19): Anatomy of a service, Builds are yours, Databases, Deploy config, Deploying, Driving deploys from code, Object Storage, Production pitfalls (+11 more)

### Community 14 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 15 - "prisma.ts"
Cohesion: 0.12
Nodes (6): dynamic, EditProductClient(), dynamic, dynamic, dynamic, prisma

### Community 16 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, dev, lint, postinstall, start

### Community 17 - "users/page.tsx"
Cohesion: 0.40
Nodes (3): dynamic, FormattedUser, UsersClient()

### Community 18 - "next"
Cohesion: 0.13
Nodes (6): nextConfig, next, faqs, metadata, metadata, metadata

### Community 19 - "(store)/page.tsx"
Cohesion: 0.25
Nodes (9): getPublicHeroSlides(), getCategories(), getProducts(), getTopProducts(), dynamic, StoreHome(), dynamic, metadata (+1 more)

### Community 20 - "manifest.json"
Cohesion: 0.14
Nodes (13): background_color, categories, description, dir, display, icons, lang, name (+5 more)

### Community 21 - "💼 دليل الإدارة والعمليات التنفيذية | Store Administration Guide"
Cohesion: 0.15
Nodes (13): 1. لوحة المؤشرات والتحليلات, 2. إدارة المنتجات بالنافذة العائمة, 3. دورة حياة الطلبات وإشعارات WhatsApp, 4. محرك إعدادات المتجر الشامل, 5. استوديو شرائح السلايدر التفاعلي, 6. إدارة المستخدمين والأدوار, 🌟 أبرز مميزات قسم السيو والنظام:, إضافة منتج جديد: (+5 more)

### Community 23 - "actions/orders.ts"
Cohesion: 0.17
Nodes (13): cleanWhatsAppNumber(), createOrderAction(), createWhatsAppOrderAction(), generateOrderNumber(), trackOrderPublicAction(), WhatsAppOrderInput, WhatsAppOrderItemInput, dynamic (+5 more)

### Community 24 - "📐 المعمارية البرمجية والهندسية | System Architecture"
Cohesion: 0.17
Nodes (12): 1. نظرة عامة على المعمارية (Architectural Overview), 2. هيكلية المسارات (Route Hierarchy & Separation), 3. مخطط علاقات قاعدة البيانات (Entity Relationship Diagram - ERD), 4. نموذج تدفق البيانات وإجراءات السيرفر (Data Flow & Server Actions), 5. إدارة الحالة في واجهة المستخدم (State Management Strategy), 6. نظام الألوان وهوية التصميم (Design System & Color Tokens), 7. أمان النظام والصلاحيات (Security & RBAC), أ. واجهة المتجر `src/app/(store)` (+4 more)

### Community 25 - "🎁 گِفتي بلس | Gifty Plus"
Cohesion: 0.18
Nodes (11): 🔒 الأمان وحماية البيانات (Security), 🛠️ البنية التقنية (Tech Stack), ✨ المميزات الرئيسية (Key Highlights), 📄 حقوق النشر والترخيص (License), 🛡️ لوحة التحكم والإدارة التنفيذية (Executive Admin Suite), منصة التجارة الإلكترونية المتكاملة للهدايا الفاخرة في العراق, 📌 نبذة عن المشروع (About The Project), 📁 هيكلية المجلدات الرئيسية (Project Structure) (+3 more)

### Community 26 - "shop-client.tsx"
Cohesion: 0.24
Nodes (6): Category, normalizeArabic(), Product, ShopClient(), ShopClientProps, SortOption

### Community 27 - "2. الإعداد المحلي خطوة بخطوة (Local Setup)"
Cohesion: 0.25
Nodes (8): 2. الإعداد المحلي خطوة بخطوة (Local Setup), خطوة 1: استنساخ المستودع, خطوة 2: تثبيت الحزم البرمجية, خطوة 3: إعداد متغيرات البيئة (`.env`), خطوة 4: تشغيل قاعدة البيانات محلياً عبر Docker (اختياري), خطوة 5: مزامنة مخطط قاعدة البيانات, خطوة 6: إضافة البيانات التجريبية (Database Seeding), خطوة 7: تشغيل خادم التطوير

### Community 29 - "⚙️ دليل التثبيت والنشر السحابي | Setup & Deployment Guide"
Cohesion: 0.20
Nodes (6): 1. المتطلبات الأساسية (Prerequisites), 3. النشر على منصة Vercel السحابية (Vercel Production Deployment), 4. قائمة التحقق قبل الإطلاق الفعلي (Production Launch Checklist), خطوات النشر:, ⚙️ دليل التثبيت والنشر السحابي | Setup & Deployment Guide, منصة گِفتي بلس (Gifty Plus Deployment & DevOps Manual)

### Community 30 - "🚀 البدء السريع والتثبيت (Quick Start)"
Cohesion: 0.29
Nodes (7): 1. استنساخ المشروع (Clone Repository), 2. تثبيت الحزم (Install Dependencies), 3. إعداد متغيرات البيئة (Environment Variables), 4. مزامنة قاعدة البيانات وتوليد عميل Prisma, 5. تشغيل بيئة التطوير المحلية, 🚀 البدء السريع والتثبيت (Quick Start), المتطلبات الأساسية

### Community 33 - "app/layout.tsx"
Cohesion: 0.40
Nodes (3): alexandria, RootLayout(), viewport

### Community 42 - "dashboard-client.tsx"
Cohesion: 0.16
Nodes (10): recharts, AdminDashboardHome(), containerVariants, DashboardStats, itemVariants, dynamic, RecentOrders(), statusMap (+2 more)

## Knowledge Gaps
- **318 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+313 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 381 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `product-client.tsx`, `settings-client.tsx`, `categories/page.tsx`, `package.json`, `order-details-modal.tsx`, `cn`, `dashboard-client.tsx`, `prisma.ts`, `(store)/page.tsx`, `actions/orders.ts`, `shop-client.tsx`?**
  _High betweenness centrality (0.135) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `react` to `product-client.tsx`, `settings-client.tsx`, `package.json`, `order-details-modal.tsx`, `cn`, `dashboard-client.tsx`, `next`, `actions/orders.ts`, `shop-client.tsx`, `about/page.tsx`?**
  _High betweenness centrality (0.089) - this node is a cross-community bridge._
- **Why does `cn()` connect `cn` to `react`, `app/layout.tsx`, `settings-client.tsx`, `product-client.tsx`, `order-details-modal.tsx`, `shop-client.tsx`?**
  _High betweenness centrality (0.081) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _318 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.07326007326007326 - nodes in this community are weakly interconnected._
- **Should `product-client.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.057342657342657345 - nodes in this community are weakly interconnected._
- **Should `settings-client.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08194905869324474 - nodes in this community are weakly interconnected._