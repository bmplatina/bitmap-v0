import type React from "react";
import type { Metadata } from "next";
import { AuthProvider } from "@/lib/AuthContext";
import NextToploader from "nextjs-toploader";
import "./globals.css";
import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "@/components/common/theme-provider";
import TokenHandler from "@/components/common/token-handler";
import Sidebar from "@/components/common/sidebar/sidebar";
import TopBar from "@/components/common/sidebar/top-bar";
import Footer from "@/components/common/footer";
import { pretendard } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Bitmap",
  description: "디지털 게임 배포 플랫폼",
  icons: {
    icon: "/Bitmap/AppIcon.ico",
    apple: [
      { url: "/Bitmap/AppIcon_1024.png" }, // public/apple-touch-icon.png
      {
        url: "/Bitmap/AppIcon_128.png",
        sizes: "128x128",
        type: "image/png",
      },
      {
        url: "/Bitmap/AppIcon_64.png",
        sizes: "64x64",
        type: "image/png",
      },
    ],
  },
  appleWebApp: {
    capable: true,
    title: "Bitmap",
    statusBarStyle: "default",
  },
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  return (
    <html lang={locale} suppressHydrationWarning>
      {/* <body className={`${pretendard.variable} font-sans antialiased`} suppressHydrationWarning>*/}
      <body suppressHydrationWarning>
        <NextToploader showSpinner={false} />
        <NextIntlClientProvider>
          <AuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Theme>
                <div
                  className={`${pretendard.variable} font-pretendard font-sans antialiased`}
                >
                  <div className="flex flex-col min-h-screen">
                    <div className="sticky top-0 z-50 w-full">
                      <TokenHandler />
                      <TopBar />
                    </div>
                    <div className="flex flex-1">
                      <aside className="sticky top-12 h-[calc(100vh-48px)] hidden md:block self-start z-30">
                        <Sidebar />
                      </aside>
                      <main className="flex-1 w-full pb-10">
                        {children}
                        <Footer />
                      </main>
                    </div>
                  </div>
                </div>
                {/* 클라이언트 사이드 로직(토큰 처리)은 별도 컴포넌트로 유지 */}
              </Theme>
            </ThemeProvider>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
