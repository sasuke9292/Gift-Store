import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "گِفتي بلس | Gifty Plus — متجر الهدايا الفاخرة",
  description: "المتجر الأول للهدايا الفاخرة والمخصصة لكافة المناسبات. خلّي هديتك تحچي عنك.",
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
      <body className="min-h-full flex flex-col antialiased text-stone-900 bg-[#FAFAF8] selection:bg-[#C9A96E]/20 selection:text-[#8C6838]">
        {children}
        <Toaster position="top-center" richColors dir="rtl" />
      </body>
    </html>
  );
}
