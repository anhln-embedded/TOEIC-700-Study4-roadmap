import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TOEIC 700+ Study4 Roadmap | Lộ trình 8 tuần",
  description: "TOEIC 700+ Study4 Roadmap: lộ trình 8 tuần với 20 đề TOEIC LR Collection 3–4, liên kết trực tiếp, đồng hồ 120 phút và cẩm nang 43 dạng câu hỏi.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="h-full">
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-full flex flex-col bg-[var(--background)] text-stone-800 font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
