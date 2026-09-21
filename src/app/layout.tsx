import type { Metadata, Viewport } from "next";
import { Alexandria, Readex_Pro } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";

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

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'https://gift-store-rl7i-three.vercel.app'),
  title: {
    default: "گِفتي بلس | Gifty Plus — متجر الهدايا الفاخرة في العراق",
    template: "%s | گِفتي بلس Gifty Plus",
  },
  description: "الوجهة الأولى لاختيار وتنسيق الهدايا الفاخرة والمخصصة في العراق. تشكيلة حصرية من العطور والساعات وبوكسات الهدايا مع تغليف ملكي مجاني وتوصيل سريع لكافة المحافظات.",
  keywords: [
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
  ],
  authors: [{ name: "Gifty Plus Team" }],
  creator: "Gifty Plus",
  publisher: "Gifty Plus Luxury",
  formatDetection: {
    telephone: true,
    address: true,
    email: true,
  },
  openGraph: {
    type: "website",
    locale: "ar_IQ",
    url: "/",
    siteName: "گِفتي بلس | Gifty Plus",
    title: "گِفتي بلس | Gifty Plus — متجر الهدايا الفاخرة",
    description: "الوجهة الأولى لاختيار وتنسيق الهدايا الفاخرة في العراق مع تغليف ملكي مجاني وتوصيل سريع.",
  },
  twitter: {
    card: "summary_large_image",
    title: "گِفتي بلس | Gifty Plus",
    description: "خلّي هديتك تحچي عنك ✨ أفخم الهدايا مع تغليف ملكي مجاني لكافة محافظات العراق.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "OnlineStore",
  name: "گِفتي بلس | Gifty Plus",
  description: "المتجر الأول للهدايا الفاخرة والمخصصة في العراق",
  url: "https://gift-store-rl7i-three.vercel.app",
  priceRange: "د.ع 10,000 - د.ع 500,000",
  address: {
    "@type": "PostalAddress",
    streetAddress: "المنصور، شارع 14 رمضان",
    addressLocality: "بغداد",
    addressCountry: "IQ",
  },
  telephone: "+9647701234567",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
      opens: "09:00",
      closes: "21:00",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
