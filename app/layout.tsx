import type { Metadata } from "next";
import { Noto_Serif_Thai, Noto_Sans_Mono } from "next/font/google";
import "./globals.css";

const fontApp = Noto_Serif_Thai({
  variable: "--font-app",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const fontAppMono = Noto_Sans_Mono({
  variable: "--font-app-mono",
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
        className={`${fontApp.variable} ${fontAppMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
