import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Tajawal } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import PwaRegister from "@/components/PwaRegister";

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700", "800", "900"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "B-Fix Software | AI Store",
    template: "%s | B-Fix Software",
  },
  description:
    "متجر B-Fix Software: أدوات البرمجة، إيجار الأدوات، اشتراكات الذكاء الاصطناعي، شحن الألعاب، حسابات ببجي، بطائق إلكترونية، تسويق، توثيق وبرمجة المواقع والتطبيقات.",
  applicationName: "B-Fix Store",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "B-Fix Store",
  },
  icons: {
    apple: "/icons/apple-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#070A12",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={tajawal.variable}>
      <body className="antialiased">
        <div className="mx-auto min-h-dvh w-full max-w-md md:max-w-2xl lg:max-w-5xl">
          <Header />
          <main className="safe-bottom px-4">{children}</main>
        </div>
        <BottomNav />
        <PwaRegister />
      </body>
    </html>
  );
}
