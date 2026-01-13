import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SnapDx - Instant Orthopedic Insights",
  description: "AI-powered educational platform for medical students and orthopedic residents. Learn faster, diagnose smarter.",
  keywords: ["orthopedics", "medical education", "AI", "fracture classification", "medical students"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
