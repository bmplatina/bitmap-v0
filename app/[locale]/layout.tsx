import type React from "react";
import type { Metadata } from "next";
import { AuthProvider } from "../../lib/AuthContext";
import { Inter } from "next/font/google";
import "./globals.css";
import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "../../components/theme-provider";
import Sidebar from "../../components/sidebar";
import TopBar from "../../components/top-bar";
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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
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
                  <div className="flex flex-col h-screen">
                    <TopBar />
                    <div className="flex flex-1 overflow-hidden">
                      <Sidebar />
                      <main className="flex-1 overflow-auto">{children}</main>
                    </div>
                  </div>
                </div>
              </Theme>
            </ThemeProvider>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
