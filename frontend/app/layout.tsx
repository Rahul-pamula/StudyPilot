import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "StudyPilot — AI-Powered Learning Assistant",
  description: "Explain concepts, summarize lectures, and generate adaptive study schedules.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-white text-slate-900 antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
