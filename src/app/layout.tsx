import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MoveQuest",
  description: "Gameful fitness motivation for college students",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
