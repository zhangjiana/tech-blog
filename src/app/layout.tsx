import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "前端架构师 - 专注大型前端项目的架构设计与工程实践",
  description: "分享9年前端开发经验，涵盖React、Vue、微前端、工程化等领域的实战案例与技术洞察",
  keywords: ["前端架构", "React", "Vue", "微前端", "工程化", "性能优化"],
  authors: [{ name: "前端架构师" }],
  creator: "前端架构师",
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://frontend-architect.dev",
    title: "前端架构师 - 专注大型前端项目的架构设计与工程实践",
    description: "分享9年前端开发经验，涵盖React、Vue、微前端、工程化等领域的实战案例与技术洞察",
    siteName: "前端架构师博客",
  },
  twitter: {
    card: "summary_large_image",
    title: "前端架构师 - 专注大型前端项目的架构设计与工程实践",
    description: "分享9年前端开发经验，涵盖React、Vue、微前端、工程化等领域的实战案例与技术洞察",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
