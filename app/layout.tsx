import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "../components/theme-provider"
import Sidebar from "../components/sidebar"
import TopBar from "../components/top-bar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "Bitmap",
    description: "디지털 게임 배포 플랫폼",
}

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="ko" suppressHydrationWarning>
        <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <div className="flex flex-col h-screen">
                <TopBar />
                <div className="flex flex-1 overflow-hidden">
                    <Sidebar />
                    <main className="flex-1 overflow-auto">
                        {children}
                    </main>
                </div>
            </div>
        </ThemeProvider>
        </body>
        </html>
    )
}