import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Sidebar from "@/components/sidebar"
import TopBar from "@/components/top-bar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "게임 ESD 플랫폼",
  description: "디지털 게임 배포 플랫폼",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <div className="flex flex-col h-screen">
            {/* 상단 바 */}
            <TopBar />

            {/* 메인 콘텐츠 영역 */}
            <div className="flex flex-1 overflow-hidden">
              {/* 사이드바 */}
              <Sidebar />

              {/* 라우터 뷰 */}
              <main className="flex-1 overflow-auto">{children}</main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
