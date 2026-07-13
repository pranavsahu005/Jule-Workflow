import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hexatom — Crevr Color Tool | Curated Color Palette Catalog",
  description: "Browse 1,000+ curated color palettes. Instantly copy HEX, CSS variables, Tailwind configuration, or AI agent styling instructions. No confusing wizards, just design inspiration.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans">
        <Navbar />
        <main className="flex-grow flex flex-col">
          {children}
        </main>

        {/* Quiet, Neutral Footer */}
        <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <div>
              <span className="font-bold text-slate-800 tracking-tight">HEXATOM</span>
              <span className="text-xs text-slate-500 block">Crevr Color Tool © {new Date().getFullYear()}. Built for designers, developers & AI agents.</span>
            </div>

            <div className="flex gap-6 text-sm text-slate-500">
              <Link href="/browse" className="hover:text-indigo-600 transition-colors font-medium">Explore Catalog</Link>
              <Link href="/generator" className="hover:text-indigo-600 transition-colors font-medium">Combination Generator</Link>
              <Link href="/extractor" className="hover:text-indigo-600 transition-colors font-medium">Image Extractor</Link>
              <Link href="/favorites" className="hover:text-indigo-600 transition-colors font-medium">My Favorites</Link>
              <Link href="/admin" className="hover:text-indigo-600 transition-colors font-semibold border-l pl-6 border-slate-200">Staff Portal</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
