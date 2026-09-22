import type { Metadata, Viewport } from "next";
import { Alexandria, Readex_Pro } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import { prisma } from "@/lib/prisma";

const alexandria = Alexandria({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

const readex = Readex_Pro({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-readex",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#C9A96E",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await prisma.storeSettings.findUnique({ where: { id: 'default' } }).catch(() => null);
  const storeName = settings?.storeName || 'گِفتي بلس | Gifty Plus';
  const title = settings?.metaTitle || `${storeName} — متجر الهدايا الفاخرة في العراق`;
  const description = settings?.metaDescription || settings?.storeDescription || 'الوجهة الأولى لاختيار وتنسيق الهدايا الفاخرة والمخصصة في العراق. تشكيلة حصرية من العطور والساعات وبوكسات الهدايا مع تغليف ملكي مجاني وتوصيل سريع لكافة المحافظات.';
  
  const keywords = settings?.metaKeywords 
    ? settings.metaKeywords.split(',').map(k => k.trim()) 
    : [
        "متجر هدايا",
        "هدايا العراق",
        "هدايا بغداد",
        "توصيل هدايا",
        "عطور فاخرة",
        "ساعات رجالية",
        "هدايا نسائية",
        "بوكسات مناسبات",
        "هدايا تخرج",
        "گفتي بلس",
        "Gifty Plus",
      ];

  return {
    metadataBase: new URL(process.env.NEXTAUTH_URL || 'https://gift-store-rl7i-three.vercel.app'),
    title: {
      default: title,
      template: `%s | ${storeName}`,
    },
    description,
    keywords,
    icons: settings?.faviconUrl ? [{ rel: 'icon', url: settings.faviconUrl }] : undefined,
    authors: [{ name: "Gifty Plus Team" }],
    creator: storeName,
    publisher: storeName,
    formatDetection: {
      telephone: true,
      address: true,
      email: true,
    },
    openGraph: {
      type: "website",
      locale: "ar_IQ",
      url: "/",
      siteName: storeName,
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: storeName,
      description: settings?.storeSlogan || description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await prisma.storeSettings.findUnique({ where: { id: 'default' } }).catch(() => null);
  const storeName = settings?.storeName || 'گِفتي بلس | Gifty Plus';
  const storePhone = settings?.storePhone || '+9647701234567';
  const storeAddress = settings?.storeAddress || 'بغداد، المنصور، شارع 14 رمضان';

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "OnlineStore",
    name: storeName,
    description: settings?.storeDescription || "المتجر الأول للهدايا الفاخرة والمخصصة في العراق",
    url: process.env.NEXTAUTH_URL || "https://gift-store-rl7i-three.vercel.app",
    priceRange: "د.ع 10,000 - د.ع 500,000",
    address: {
      "@type": "PostalAddress",
      streetAddress: storeAddress,
      addressLocality: "بغداد",
      addressCountry: "IQ",
    },
    telephone: storePhone.replace(/\s+/g, ''),
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
        opens: "09:00",
        closes: "22:00",
      },
    ],
  };

  return (
    <html
      lang="ar"
      dir="rtl"
      suppressHydrationWarning
      className={cn(alexandria.variable, readex.variable, "font-sans")}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col antialiased text-stone-900 bg-[#FAFAF8] selection:bg-[#C9A96E]/20 selection:text-[#8C6838]">
        {children}
        <Toaster position="top-center" richColors dir="rtl" />
      </body>
    </html>
  );
}
