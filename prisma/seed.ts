import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Clearing database...')
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()
  
  console.log('Seeding database with realistic data...')

  // 1. Seed Categories with Images
  const categories = [
    { 
      name: 'هدايا رجالية', 
      slug: 'men', 
      isActive: true,
      image: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?auto=format&fit=crop&q=80&w=800',
    },
    { 
      name: 'هدايا نسائية', 
      slug: 'women', 
      isActive: true,
      image: 'https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d?auto=format&fit=crop&q=80&w=800',
    },
    { 
      name: 'هدايا أطفال', 
      slug: 'kids', 
      isActive: true,
      image: 'https://images.unsplash.com/photo-1560859254-809fa84742f3?auto=format&fit=crop&q=80&w=800',
    },
    { 
      name: 'مناسبات', 
      slug: 'occasions', 
      isActive: true,
      image: 'https://images.unsplash.com/photo-1530103862676-de8892ebe6c4?auto=format&fit=crop&q=80&w=800',
    },
    { 
      name: 'منتجات مخصصة', 
      slug: 'custom', 
      isActive: true,
      image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&q=80&w=800',
    },
    { 
      name: 'عروض حصرية', 
      slug: 'offers', 
      isActive: true,
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=800',
    },
    { 
      name: 'إلكترونيات تقنية', 
      slug: 'electronics', 
      isActive: true,
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=800',
    },
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
  }

  const dbCategories = await prisma.category.findMany()
  const getCatId = (name: string) => dbCategories.find(c => c.name === name)?.id || dbCategories[0].id

  // 2. Seed Products
  const products = [
    // Men
    {
      name: 'طقم محفظة وحزام جلد طبيعي فاخر',
      slug: 'men-wallet-belt-premium',
      description: 'طقم رجالي فاخر يتكون من محفظة وحزام مصنوعين من الجلد الطبيعي 100%. يأتي في علبة هدايا فخمة مناسبة للإهداء في جميع المناسبات. متوفر باللونين الأسود والبني.',
      price: 450,
      salePrice: 390,
      sku: 'PRD-MEN-001',
      categoryId: getCatId('هدايا رجالية'),
      isNew: true,
      isBestSeller: true,
      images: ['https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=800'],
      tags: ['جلد', 'طقم', 'محفظة', 'حزام'],
    },
    {
      name: 'عطر توم فورد عود وود للرجال',
      slug: 'tom-ford-oud-wood',
      description: 'عطر خشبي عطري للرجال يتميز بتركيبة قوية ومنعشة. هدية مثالية للرجل العصري ذو الذوق الرفيع.',
      price: 1850,
      sku: 'PRD-MEN-002',
      categoryId: getCatId('هدايا رجالية'),
      isNew: false,
      isBestSeller: true,
      images: ['https://images.unsplash.com/photo-1523293115678-d29061c0c660?auto=format&fit=crop&q=80&w=800'],
      tags: ['عطر', 'ماركة', 'توم فورد'],
    },
    {
      name: 'ساعة يد رجالية كلاسيكية رياضية',
      slug: 'men-classic-sport-watch',
      description: 'ساعة رجالية بتصميم يجمع بين الكلاسيكية والرياضية، مقاومة للماء مع سوار جلدي متين.',
      price: 850,
      salePrice: 700,
      sku: 'PRD-MEN-003',
      categoryId: getCatId('هدايا رجالية'),
      isNew: true,
      images: ['https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=800'],
      tags: ['ساعة', 'رجالي'],
    },
    {
      name: 'نظارات شمسية بولارايزد للرجال',
      slug: 'men-polarized-sunglasses',
      description: 'نظارات شمسية أصلية بعدسات مستقطبة (Polarized) توفر حماية 100% من الأشعة فوق البنفسجية.',
      price: 650,
      sku: 'PRD-MEN-004',
      categoryId: getCatId('هدايا رجالية'),
      isBestSeller: false,
      images: ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=800'],
      tags: ['نظارات', 'صيف'],
    },

    // Women
    {
      name: 'ساعة نسائية روز جولد مرصعة بالزركون',
      slug: 'women-rosegold-watch',
      description: 'ساعة نسائية بتصميم أنيق باللون الروز جولد مرصعة بأحجار الزركون اللامعة، تأتي مع علبة فاخرة وكيس هدايا.',
      price: 1200,
      salePrice: 950,
      sku: 'PRD-WOM-001',
      categoryId: getCatId('هدايا نسائية'),
      isNew: false,
      isBestSeller: true,
      images: ['https://images.unsplash.com/photo-1508656986657-3f3679f29197?auto=format&fit=crop&q=80&w=800'],
      tags: ['ساعة', 'نسائي', 'مجوهرات'],
    },
    {
      name: 'طقم عطور شرقية رومانسية',
      slug: 'oriental-romantic-perfumes',
      description: 'مجموعة من 3 عطور فاخرة بروائح الزهور والمسك والفانيليا، مصممة خصيصاً لتمنح إحساساً بالرومانسية.',
      price: 850,
      sku: 'PRD-WOM-002',
      categoryId: getCatId('هدايا نسائية'),
      isNew: true,
      images: ['https://images.unsplash.com/photo-1594035910387-fea47714263f?auto=format&fit=crop&q=80&w=800'],
      tags: ['عطر', 'طقم', 'زهور'],
    },
    {
      name: 'حقيبة يد جلدية أنيقة للسهرات',
      slug: 'women-leather-handbag',
      description: 'حقيبة يد نسائية مصنوعة من الجلد عالي الجودة بتصميم عصري يناسب السهرات والمناسبات الخاصة.',
      price: 550,
      sku: 'PRD-WOM-003',
      categoryId: getCatId('هدايا نسائية'),
      isBestSeller: false,
      images: ['https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&q=80&w=800'],
      tags: ['حقيبة', 'نسائي'],
    },
    {
      name: 'قلادة فضية عيار 925 بتصميم إنفينيتي',
      slug: 'silver-infinity-necklace',
      description: 'قلادة رائعة من الفضة الخالصة عيار 925 بتصميم علامة اللانهاية (Infinity) تعبر عن الحب الأبدي.',
      price: 450,
      salePrice: 380,
      sku: 'PRD-WOM-004',
      categoryId: getCatId('هدايا نسائية'),
      isNew: true,
      isBestSeller: true,
      images: ['https://images.unsplash.com/photo-1599643478514-4a42090885e3?auto=format&fit=crop&q=80&w=800'],
      tags: ['مجوهرات', 'فضة', 'قلادة'],
    },

    // Occasions
    {
      name: 'باقة ورد أحمر جوري فاخرة جداً',
      slug: 'red-roses-bouquet-premium',
      description: 'باقة ورد جوري أحمر طبيعي (50 وردة) مع تغليف فاخر وكارت إهداء مجاني وشريط حريري. مثالية للذكرى السنوية وعيد الحب.',
      price: 750,
      salePrice: 650,
      sku: 'PRD-OCC-001',
      categoryId: getCatId('مناسبات'),
      isBestSeller: true,
      images: ['https://images.unsplash.com/photo-1563241598-a2886f4a8e63?auto=format&fit=crop&q=80&w=800'],
      tags: ['ورد', 'حب', 'ذكرى'],
    },
    {
      name: 'كيكة الشوكولاتة والذهب قابلة للتخصيص',
      slug: 'gold-chocolate-cake',
      description: 'كيكة غنية بالشوكولاتة البلجيكية مزينة بورق الذهب الصالح للأكل. تكفي 8-10 أشخاص.',
      price: 600,
      sku: 'PRD-OCC-002',
      categoryId: getCatId('مناسبات'),
      isNew: true,
      images: ['https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800'],
      tags: ['كيك', 'حفلة'],
    },

    // Custom
    {
      name: 'صندوق هدايا خشبي محفور بالاسم',
      slug: 'custom-engraved-wooden-box',
      description: 'صندوق خشبي محفور بالليزر مع إمكانية كتابة اسم المهدى إليه أو رسالة خاصة. مبطن بالمخمل الأسود.',
      price: 350,
      sku: 'PRD-CUS-001',
      categoryId: getCatId('منتجات مخصصة'),
      isBestSeller: true,
      images: ['https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&q=80&w=800'],
      tags: ['خشب', 'مخصص', 'حفر'],
    },
    {
      name: 'كوب سيراميك سحري مطبوع بصورة',
      slug: 'magic-photo-mug',
      description: 'كوب سحري يظهر الصورة المطبوعة عليه عند سكب مشروب ساخن داخله.',
      price: 150,
      salePrice: 120,
      sku: 'PRD-CUS-002',
      categoryId: getCatId('منتجات مخصصة'),
      isNew: true,
      images: ['https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&q=80&w=800'],
      tags: ['كوب', 'طباعة', 'مخصص'],
    },
    
    // Kids
    {
      name: 'دب محشو عملاق (تيدي بير)',
      slug: 'giant-teddy-bear',
      description: 'دب محشو فائق النعومة بحجم 120 سم، هدية رائعة للأطفال ومحببة للجميع.',
      price: 500,
      sku: 'PRD-KID-001',
      categoryId: getCatId('هدايا أطفال'),
      isBestSeller: true,
      images: ['https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&q=80&w=800'],
      tags: ['دب', 'لعبة', 'أطفال'],
    },
    {
      name: 'لعبة تركيب المكعبات التعليمية',
      slug: 'educational-building-blocks',
      description: 'مجموعة مكعبات تركيب ملونة تساعد في تنمية مهارات الإبداع والتفكير الهندسي لدى الأطفال.',
      price: 250,
      sku: 'PRD-KID-002',
      categoryId: getCatId('هدايا أطفال'),
      isNew: true,
      images: ['https://images.unsplash.com/photo-1560859254-809fa84742f3?auto=format&fit=crop&q=80&w=800'],
      tags: ['لعبة', 'تعليمي'],
    },
    
    // Electronics
    {
      name: 'سماعات رأس لاسلكية مانعة للضوضاء',
      slug: 'wireless-noise-cancelling-headphones',
      description: 'سماعات بلوتوث مريحة توفر جودة صوت عالية مع ميزة العزل الذكي للضوضاء المحيطة.',
      price: 890,
      salePrice: 799,
      sku: 'PRD-ELE-001',
      categoryId: getCatId('إلكترونيات تقنية'),
      isNew: true,
      isBestSeller: true,
      images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800'],
      tags: ['إلكترونيات', 'سماعات'],
    },
    {
      name: 'شاحن لاسلكي متعدد الأجهزة',
      slug: 'multi-device-wireless-charger',
      description: 'منصة شحن أنيقة تشحن الهاتف الذكي والساعة والسماعات في آن واحد.',
      price: 290,
      sku: 'PRD-ELE-002',
      categoryId: getCatId('إلكترونيات تقنية'),
      isNew: true,
      images: ['https://images.unsplash.com/photo-1586942589578-1a5c68ff8efd?auto=format&fit=crop&q=80&w=800'],
      tags: ['شاحن', 'تقنية'],
    }
  ]

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: p,
    })
  }

  // 3. Admin User
  await prisma.user.upsert({
    where: { email: 'admin@admin.com' },
    update: {},
    create: {
      email: 'admin@admin.com',
      name: 'المدير العام',
      role: 'SUPER_ADMIN',
      password: 'Admin123', // In real app, this MUST be hashed
    }
  })

  // 4. Test Customer User
  await prisma.user.upsert({
    where: { email: 'customer@test.com' },
    update: {},
    create: {
      email: 'customer@test.com',
      name: 'أحمد العميل',
      role: 'CUSTOMER',
      password: 'password123', 
    }
  })

  console.log('Seeding complete. Inserted realistic data and images.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
