import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "DSA & System Design Visualizer Studio",
  description: "High-performance interactive 2D DSA visualizer studio with Shiki Tokyo-Night Code Runner and Hinglish step logic explanations",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} min-h-screen antialiased dark`}
    >
      <body className="min-h-screen flex flex-col bg-[#05070e] text-slate-100 font-sans overflow-x-hidden overflow-y-auto">
        {children}
      </body>
    </html>
  );
}
