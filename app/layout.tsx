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
  title: "3D System Design & DSA Visualizer",
  description: "Interactive 3D isometric system architecture & algorithm visualizer inspired by Krishna Chaitanya",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased dark`}
    >
      <body className="min-h-screen flex flex-col bg-[#05070e] text-slate-100 overflow-x-hidden overflow-y-auto">
        {children}
      </body>
    </html>
  );
}
