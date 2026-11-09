# Graph Report - Gift-Store  (2026-11-09)

## Corpus Check
- 150 files · ~168,667 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: .ico 2, (none) 1, .prisma 1)

## Summary
- 860 nodes · 1662 edges · 60 communities (39 shown, 18 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- react
- orders-client.tsx
- fix-images.ts
- settings-client.tsx
- dropdown-menu.tsx
- website/package.json
- dependencies
- cn
- 🔌 مرجع الـ Server Actions ونقاط الـ API | Actions & APIs Reference
- 🚀 البدء السريع والتثبيت (Quick Start)
- (store)/page.tsx
- src/auth.ts
- components.json
- Writing apps with Prisma Composer
- Writing apps with Prisma Composer
- Writing apps with Prisma Composer
- Writing apps with Prisma Composer
- prisma.ts
- next
- about/page.tsx
- compilerOptions
- 🎁 گِفتي بلس | Gifty Plus
- admin-login/page.tsx
- button.tsx
- Gift-Store/package.json
- manifest.json
- profile-client.tsx
- 💼 دليل الإدارة والعمليات التنفيذية | Store Administration Guide
- devDependencies
- actions/orders.ts
- 📐 المعمارية البرمجية والهندسية | System Architecture
- 2. الإعداد المحلي خطوة بخطوة (Local Setup)
- ⚙️ دليل التثبيت والنشر السحابي | Setup & Deployment Guide
- scripts
- app/layout.tsx
- vercel.json
- dashboard-client.tsx
- 🌐 موقع متجر گفتي بلس (Gift-Store Web Application)
- shop-client.tsx
- check_images.ts
- get_lint_errors.ts
- hero-slides/page.tsx
- new/page.tsx
- rules/graphify.md
- workflows/graphify.md
- Gift-Store/AGENTS.md
- website/AGENTS.md
- eslint.config.mjs
- prisma
- postcss.config.mjs
- { GET, POST }
- users/page.tsx
- assign-valid-images.ts
- audit-db.ts
- inspect-categories.mjs
- inspect-live.mjs
- inspect-product.mjs

## God Nodes (most connected - your core abstractions)
1. `cn()` - 107 edges
2. `react` - 65 edges
3. `lucide-react` - 49 edges
4. `prisma` - 30 edges
5. `Button()` - 28 edges
6. `@prisma/client` - 24 edges
7. `sonner` - 22 edges
8. `framer-motion` - 21 edges
9. `next` - 18 edges
10. `useMounted()` - 16 edges

## Surprising Connections (you probably didn't know these)
- `RootLayout()` --calls--> `cn()`  [EXTRACTED]
  Gift-Store/website/src/app/layout.tsx → Gift-Store/website/src/lib/utils.ts
- `DialogOverlay()` --calls--> `cn()`  [EXTRACTED]
  Gift-Store/website/src/components/ui/dialog.tsx → Gift-Store/website/src/lib/utils.ts
- `DropdownMenuSubTrigger()` --calls--> `cn()`  [EXTRACTED]
  Gift-Store/website/src/components/ui/dropdown-menu.tsx → Gift-Store/website/src/lib/utils.ts
- `DropdownMenuSubContent()` --calls--> `cn()`  [EXTRACTED]
  Gift-Store/website/src/components/ui/dropdown-menu.tsx → Gift-Store/website/src/lib/utils.ts
- `DropdownMenuCheckboxItem()` --calls--> `cn()`  [EXTRACTED]
  Gift-Store/website/src/components/ui/dropdown-menu.tsx → Gift-Store/website/src/lib/utils.ts

## Import Cycles
- None detected.

## Communities (60 total, 18 thin omitted)

### Community 0 - "react"
Cohesion: 0.05
Nodes (50): getPublicStoreSettings(), AdminLayoutClient(), LoginClient(), metadata, CartPage(), FavoritesClient(), metadata, GiftFinderClient() (+42 more)

### Community 1 - "orders-client.tsx"
Cohesion: 0.08
Nodes (35): createCategory(), deleteCategory(), updateCategory(), deleteOrder(), deleteProduct(), deleteProducts(), CategoriesClient(), Category (+27 more)

### Community 2 - "fix-images.ts"
Cohesion: 0.40
Nodes (3): defaultImages, imagesMap, prisma

### Community 3 - "settings-client.tsx"
Cohesion: 0.09
Nodes (33): createHeroSlide(), CreateHeroSlideInput, DEFAULT_SLIDES, deleteHeroSlide(), ensureDefaultSlidesExist(), getHeroSlides(), HeroSlideData, reorderHeroSlides() (+25 more)

### Community 4 - "dropdown-menu.tsx"
Cohesion: 0.11
Nodes (19): AdminSidebar(), roleLabels, SidebarGroup, sidebarGroups, SidebarItem, Badge(), badgeVariants, DropdownMenu() (+11 more)

### Community 5 - "website/package.json"
Cohesion: 0.06
Nodes (33): name, private, version, @auth/prisma-adapter, @base-ui/react, @capacitor/android, @capacitor/app, @capacitor/cli (+25 more)

### Community 6 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @auth/prisma-adapter, @base-ui/react, bcryptjs, @capacitor/android, @capacitor/app, @capacitor/cli, @capacitor/core (+22 more)

### Community 7 - "cn"
Cohesion: 0.05
Nodes (61): prisma, prisma, prisma, prisma, prisma, prisma, getOrderDetails(), updateOrderStatus() (+53 more)

### Community 8 - "🔌 مرجع الـ Server Actions ونقاط الـ API | Actions & APIs Reference"
Cohesion: 0.07
Nodes (26): 1. إجراءات متجر الزبائن, 2. إجراءات لوحة الإدارة, 3. نقاط الـ API المتخصصة, 4. مكتبة المساعدات والدوال الذكية, `cleanIraqiWhatsAppNumber(rawNumber: string): string`, `createHeroSlide(data: CreateSlideInput)` / `updateHeroSlideOrder(slides: { id: string; order: number }[])`, `createOrder(data: CreateOrderInput)`, `createProduct(formData: ProductFormData)` (+18 more)

### Community 9 - "🚀 البدء السريع والتثبيت (Quick Start)"
Cohesion: 0.29
Nodes (7): 1. استنساخ المشروع (Clone Repository), 2. تثبيت الحزم (Install Dependencies), 3. إعداد متغيرات البيئة (Environment Variables), 4. مزامنة قاعدة البيانات وتوليد عميل Prisma, 5. تشغيل بيئة التطوير المحلية, 🚀 البدء السريع والتثبيت (Quick Start), المتطلبات الأساسية

### Community 10 - "(store)/page.tsx"
Cohesion: 0.22
Nodes (11): getPublicHeroSlides(), getCategories(), getArabicSearchVariants(), getProducts(), getTopProducts(), searchProducts(), dynamic, StoreHome() (+3 more)

### Community 11 - "src/auth.ts"
Cohesion: 0.13
Nodes (8): ALLOWED_MIME_TYPES, { handlers, signIn, signOut, auth }, next-auth, Session, User, config, bcryptjs, next-auth

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
Cohesion: 0.11
Nodes (7): dynamic, dynamic, dynamic, dynamic, dynamic, dynamic, prisma

### Community 18 - "next"
Cohesion: 0.10
Nodes (7): nextConfig, faqs, metadata, metadata, metadata, metadata, next

### Community 20 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 21 - "🎁 گِفتي بلس | Gifty Plus"
Cohesion: 0.18
Nodes (11): 🔒 الأمان وحماية البيانات (Security), 🛠️ البنية التقنية (Tech Stack), ✨ المميزات الرئيسية (Key Highlights), 📄 حقوق النشر والترخيص (License), 🛡️ لوحة التحكم والإدارة التنفيذية (Executive Admin Suite), منصة التجارة الإلكترونية المتكاملة للهدايا الفاخرة في العراق, 📌 نبذة عن المشروع (About The Project), 📁 هيكلية المجلدات الرئيسية (Project Structure) (+3 more)

### Community 23 - "button.tsx"
Cohesion: 0.13
Nodes (14): ADMIN_SEARCH_INDEX, AdminHeader(), AdminSearchDestination, normalizeArabicText(), Button(), buttonVariants, Sheet(), SheetContent() (+6 more)

### Community 24 - "Gift-Store/package.json"
Cohesion: 0.17
Nodes (11): description, name, private, scripts, build, dev, lint, postinstall (+3 more)

### Community 25 - "manifest.json"
Cohesion: 0.14
Nodes (13): background_color, categories, description, dir, display, icons, lang, name (+5 more)

### Community 26 - "profile-client.tsx"
Cohesion: 0.10
Nodes (23): ADMIN_ROLES, changePassword(), createStaffUser(), deleteStaffUser(), STAFF_VIEW_ROLES, updateProfile(), ProfileClient(), ProfileClientProps (+15 more)

### Community 27 - "💼 دليل الإدارة والعمليات التنفيذية | Store Administration Guide"
Cohesion: 0.15
Nodes (13): 1. لوحة المؤشرات والتحليلات, 2. إدارة المنتجات بالنافذة العائمة, 3. دورة حياة الطلبات وإشعارات WhatsApp, 4. محرك إعدادات المتجر الشامل, 5. استوديو شرائح السلايدر التفاعلي, 6. إدارة المستخدمين والأدوار, 🌟 أبرز مميزات قسم السيو والنظام:, إضافة منتج جديد: (+5 more)

### Community 28 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, eslint, eslint-config-next, prisma, @prisma/client, tailwindcss, @tailwindcss/postcss, ts-node (+5 more)

### Community 29 - "actions/orders.ts"
Cohesion: 0.17
Nodes (13): cleanWhatsAppNumber(), createOrderAction(), createWhatsAppOrderAction(), generateOrderNumber(), trackOrderPublicAction(), WhatsAppOrderInput, WhatsAppOrderItemInput, dynamic (+5 more)

### Community 30 - "📐 المعمارية البرمجية والهندسية | System Architecture"
Cohesion: 0.17
Nodes (12): 1. نظرة عامة على المعمارية (Architectural Overview), 2. هيكلية المسارات (Route Hierarchy & Separation), 3. مخطط علاقات قاعدة البيانات (Entity Relationship Diagram - ERD), 4. نموذج تدفق البيانات وإجراءات السيرفر (Data Flow & Server Actions), 5. إدارة الحالة في واجهة المستخدم (State Management Strategy), 6. نظام الألوان وهوية التصميم (Design System & Color Tokens), 7. أمان النظام والصلاحيات (Security & RBAC), أ. واجهة المتجر `src/app/(store)` (+4 more)

### Community 34 - "2. الإعداد المحلي خطوة بخطوة (Local Setup)"
Cohesion: 0.25
Nodes (8): 2. الإعداد المحلي خطوة بخطوة (Local Setup), خطوة 1: استنساخ المستودع, خطوة 2: تثبيت الحزم البرمجية, خطوة 3: إعداد متغيرات البيئة (`.env`), خطوة 4: تشغيل قاعدة البيانات محلياً عبر Docker (اختياري), خطوة 5: مزامنة مخطط قاعدة البيانات, خطوة 6: إضافة البيانات التجريبية (Database Seeding), خطوة 7: تشغيل خادم التطوير

### Community 36 - "⚙️ دليل التثبيت والنشر السحابي | Setup & Deployment Guide"
Cohesion: 0.20
Nodes (6): 1. المتطلبات الأساسية (Prerequisites), 3. النشر على منصة Vercel السحابية (Vercel Production Deployment), 4. قائمة التحقق قبل الإطلاق الفعلي (Production Launch Checklist), خطوات النشر:, ⚙️ دليل التثبيت والنشر السحابي | Setup & Deployment Guide, منصة گِفتي بلس (Gifty Plus Deployment & DevOps Manual)

### Community 37 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, dev, lint, postinstall, start

### Community 38 - "app/layout.tsx"
Cohesion: 0.40
Nodes (3): alexandria, RootLayout(), viewport

### Community 40 - "vercel.json"
Cohesion: 0.40
Nodes (4): buildCommand, framework, outputDirectory, $schema

### Community 42 - "dashboard-client.tsx"
Cohesion: 0.16
Nodes (10): AdminDashboardHome(), containerVariants, DashboardStats, itemVariants, dynamic, RecentOrders(), statusMap, data (+2 more)

### Community 43 - "🌐 موقع متجر گفتي بلس (Gift-Store Web Application)"
Cohesion: 0.50
Nodes (3): 🚀 أوامر التشغيل السريع, 📦 محتويات المجلد, 🌐 موقع متجر گفتي بلس (Gift-Store Web Application)

### Community 45 - "shop-client.tsx"
Cohesion: 0.24
Nodes (6): Category, normalizeArabic(), Product, ShopClient(), ShopClientProps, SortOption

### Community 72 - "users/page.tsx"
Cohesion: 0.40
Nodes (3): dynamic, FormattedUser, UsersClient()

### Community 74 - "audit-db.ts"
Cohesion: 0.67
Nodes (3): checkUrl(), main(), prisma

## Knowledge Gaps
- **403 isolated node(s):** `name`, `version`, `private`, `description`, `workspaces` (+398 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 484 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **18 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `orders-client.tsx`, `settings-client.tsx`, `dropdown-menu.tsx`, `website/package.json`, `cn`, `dashboard-client.tsx`, `(store)/page.tsx`, `shop-client.tsx`, `prisma.ts`, `button.tsx`, `profile-client.tsx`, `actions/orders.ts`?**
  _High betweenness centrality (0.102) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `react` to `orders-client.tsx`, `settings-client.tsx`, `dropdown-menu.tsx`, `website/package.json`, `cn`, `dashboard-client.tsx`, `shop-client.tsx`, `next`, `about/page.tsx`, `button.tsx`, `profile-client.tsx`, `actions/orders.ts`?**
  _High betweenness centrality (0.069) - this node is a cross-community bridge._
- **Why does `cn()` connect `cn` to `react`, `orders-client.tsx`, `settings-client.tsx`, `dropdown-menu.tsx`, `app/layout.tsx`, `shop-client.tsx`, `button.tsx`, `profile-client.tsx`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _403 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.05339506172839506 - nodes in this community are weakly interconnected._
- **Should `orders-client.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08325624421831637 - nodes in this community are weakly interconnected._
- **Should `settings-client.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09009009009009009 - nodes in this community are weakly interconnected._