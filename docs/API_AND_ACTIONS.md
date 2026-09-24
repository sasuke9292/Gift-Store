# 🔌 مرجع الـ Server Actions ونقاط الـ API | Actions & APIs Reference
### منصة گِفتي بلس (Gifty Plus Backend Reference)

تعتمد المنصة على معمارية **Next.js Server Actions** للعمليات التفاعلية وإجراءات تعديل وتحديث البيانات (Mutations)، مع استخدام مسارات الـ API للوظائف المتخصصة كرفع الملفات والتوثيق الأمني.

---

## 📑 فهرس المحتويات
1. [إجراءات متجر الزبائن (Storefront Actions)](#1-إجراءات-متجر-الزبائن)
2. [إجراءات لوحة الإدارة (Admin Server Actions)](#2-إجراءات-لوحة-الإدارة)
3. [نقاط الـ API المتخصصة (API Route Handlers)](#3-نقاط-الـ-api-المتخصصة)
4. [مكتبة المساعدات والدوال الذكية (Utilities & Helpers)](#4-مكتبة-المساعدات-والدوال-الذكية)

---

## 1. إجراءات متجر الزبائن

### أ. إدارة الطلبات والتسوق (`src/app/actions/orders.ts`)

#### `createOrder(data: CreateOrderInput)`
- **الوظيفة:** تسجيل طلب جديد للزبون عبر المتجر (سواء طلب عبر الموقع أو طلب موجه لواتساب).
- **المدخلات:**
  ```typescript
  interface CreateOrderInput {
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    province: string;          // المحافظة
    area: string;              // المنطقة أو العنوان التفصيلي
    notes?: string;            // ملاحظات الزبون أو كارت الإهداء
    deliveryType: 'DELIVERY' | 'PICKUP';
    paymentMethod: 'COD' | 'ZAIN_CASH' | 'FIB' | 'WHATSAPP';
    items: {
      productId: string;
      quantity: number;
      price: number;
      customOptions?: any;     // خيارات الحفر بالاسم والتغليف
    }[];
  }
  ```
- **المخرجات:**
  ```typescript
  { success: boolean; orderId?: string; orderNumber?: string; error?: string }
  ```
- **السلوك الداخلي:**
  - التحقق من توفر كميات المخزون في جدول `Inventory`.
  - توليد رقم طلب تسلسلي فريد بصيغة أنيقة (مثال: `#ORD-2609-1234`).
  - حساب تكلفة الشحن المناسبة لمحافظة الزبون بناءً على إعدادات المتجر الحالية.
  - إرسال بريد أو إشعار تنبيه للإدارة في حال تفعيل الإشعارات.

#### `trackOrder(query: { orderNumber?: string; phone?: string })`
- **الوظيفة:** استعلام فوري للزبون عن حالة ومسار طلبه في صفحة `/track-order`.
- **المخرجات:** تفاصيل الطلب وتاريخه ومرحلة التوصيل الحالية وسجل التتبع دون كشف أي بيانات حساسة.

---

## 2. إجراءات لوحة الإدارة

### أ. إدارة المنتجات بالنافذة العائمة (`src/app/actions/admin/products.ts`)

#### `createProduct(formData: ProductFormData)`
- **الوظيفة:** إنشاء منتج جديد مباشرة من النافذة العائمة.
- **التحقق:** التأكد من تفرد الـ `SKU`، وتوليد `slug` فريد من اسم المنتج.
- **التحديث التلقائي:** تشغيل `revalidatePath('/admin/products')` و `revalidatePath('/shop')`.

#### `updateProduct(id: string, formData: Partial<ProductFormData>)`
- **الوظيفة:** تحديث بيانات المنتج وصوره وحالته ومخزونه مع المزامنة اللحظية.

#### `deleteProduct(id: string)`
- **الوظيفة:** حذف المنتج بأمان وفك ارتباطه مع مراعاة الحفاظ على أرشيف الطلبات السابقة.

---

### ب. إدارة إعدادات المتجر والواجهة (`src/app/actions/admin/settings.ts`)

#### `getStoreSettings()`
- **الوظيفة:** جلب سجل إعدادات المتجر الحالي من قاعدة البيانات (السجل الافتراضي `id: "default"`).

#### `updateStoreSettings(settings: SettingsData)`
- **الوظيفة:** حفظ وتحديث كامل إعدادات المتجر، والواجهة، والـ SEO، وقنوات التواصل، وأجور الشحن.
- **الأمان:** التحقق من صلاحيات جلسة الأدمن عبر `auth()`.
- **إعادة التحقق اللحظية (Cache Invalidation):**
  ```typescript
  revalidatePath('/', 'layout');
  revalidatePath('/admin/settings');
  revalidatePath('/checkout');
  ```

---

### ج. دورة حياة الطلبات والواتساب (`src/app/actions/admin/orders.ts`)

#### `updateOrderStatus(orderId: string, status: OrderStatus, notes?: string)`
- **الوظيفة:** تحديث حالة الطلب (مثال: من `CONFIRMED` إلى `SHIPPED`).
- **المخرجات:** تحديث فوري لحالة الطلب مع حفظ تاريخ التحديث وتسجيل مدخل في سجل التدقيق `AuditLog`.

---

### د. استوديو السلايدر التفاعلي (`src/app/actions/admin/hero-slides.ts`)

#### `createHeroSlide(data: CreateSlideInput)` / `updateHeroSlideOrder(slides: { id: string; order: number }[])`
- **الوظيفة:** إضافة وترتيب شرائح السلايدر التفاعلي بالواجهة مع تحديث الترتيب الفوري بالسحب والإفلات أو أزرار الأسهم.

---

## 3. نقاط الـ API المتخصصة

### مسار رفع الصور والوسائط (`POST /api/upload`)
- **الملف:** `src/app/api/upload/route.ts`
- **الوظيفة:** استقبال ملفات الصور للمنتجات، الشعار، الفافيكون، وشرائح السلايدر.
- **المعالجة:**
  - التحقق من نوع الملف وحجمه (يدعم: `image/jpeg`, `image/png`, `image/webp`).
  - حفظ الملف باسم مشفر وآمن، وإرجاع الرابط الدائم `url` لاستخدامه في قاعدة البيانات.

### مسار التوثيق والمصادقة (`/api/auth/[...nextauth]`)
- **الملف:** `src/app/api/auth/[...nextauth]/route.ts`
- **الوظيفة:** إدارة عمليات تسجيل الدخول والخروج وإنشاء الجلسات الآمنة وتحديثها عبر **NextAuth.js v5**.

---

## 4. مكتبة المساعدات والدوال الذكية

### منسق أرقام ورسائل WhatsApp (`src/lib/whatsapp.ts`)

#### `cleanIraqiWhatsAppNumber(rawNumber: string): string`
- **الوظيفة:** معالجة وتصحيح الأرقام العراقية المدخلة من الزبائن وتحويلها تلقائياً إلى الصيغة الدولية المعيارية لواتساب:
  ```typescript
  cleanIraqiWhatsAppNumber("0770 123 4567") => "9647701234567"
  cleanIraqiWhatsAppNumber("+964 780 000 0000") => "9647800000000"
  ```

#### `getWhatsAppStatusMessage(params)` & `getWhatsAppStatusUrl(params)`
- **الوظيفة:** صياغة قوالب رسائل رسمية وراقية باللغة العربية تبين رقم الطلب واسم الزبون وتحديث حالته بدقة متناهية، وتوليد رابط `https://wa.me/...` قابل للنقر المباشر لفتح محادثة واتساب جاهزة للإرسال.
