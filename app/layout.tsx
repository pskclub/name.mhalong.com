import type { Metadata } from "next";
import { Noto_Sans_Thai, Noto_Sans_Mono } from "next/font/google";
import "./globals.css";

const notoSansThai = Noto_Sans_Thai({
  variable: "--font-noto-sans-thai",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const notoSansMono = Noto_Sans_Mono({
  variable: "--font-noto-sans-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ดูดวงชื่อ-นามสกุล วันนี้ดวงเป็นยังไง? มาเช็กกับมหาหลง",
  description: "ถอดรหัสชีวิตจากชื่อและนามสกุลของคุณด้วยศาสตร์พยากรณ์โบราณ เช็กพลังตัวเลขและตัวอักษรที่เป็นมงคล เสริมดวงชะตาให้ราบรื่น พลิกชีวิตให้ปังกับมหาหลง",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${notoSansThai.variable} ${notoSansMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
