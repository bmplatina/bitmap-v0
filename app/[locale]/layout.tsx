import type React from "react";
import { Suspense } from "react";
import type { Metadata } from "next";
import { AuthProvider } from "@/lib/AuthContext";
import { Inter } from "next/font/google";
import "./globals.css";
import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "@/components/common/theme-provider";
import { TokenHandler } from "@/components/common/token-handler";
import Sidebar from "@/components/common/sidebar/sidebar";
import TopBar from "@/components/common/sidebar/top-bar";
import localFont from "next/font/local";

const inter = Inter({ subsets: ["latin"] });

// 폰트 설정
const pretendard = localFont({
  src: "./fonts/Pretendard/PretendardVariable.woff2", // 경로 확인 필요
  display: "swap",
  variable: "--font-pretendard", // CSS 변수 선언
  weight: "45 920",
});

export const metadata: Metadata = {
  title: "Bitmap",
  description: "디지털 게임 배포 플랫폼",
};

export default function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  return (
    <html lang={locale} suppressHydrationWarning>
      {/* <body className={`${pretendard.variable} font-sans antialiased`} suppressHydrationWarning>*/}
      <body suppressHydrationWarning>
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
                    <div className="sticky top-0 z-50 bg-background w-full">
                      <TopBar />
                    </div>
                    <div className="flex flex-1">
                      <div className="sticky top-12 h-[calc(100vh-3rem)] hidden md:block">
                        <Sidebar />
                      </div>
                      <main className="flex-1 w-full pb-10">{children}</main>
                    </div>
                  </div>
                  <Suspense fallback={null}>
                    <TokenHandler />
                  </Suspense>
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
