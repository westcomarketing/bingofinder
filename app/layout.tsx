import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "BingoFinder — Find Bingo Halls Near You",
    template: "%s | BingoFinder",
  },
  description:
    "Find bingo halls near you across all 50 US states. 500+ listings with hours, phone numbers, and directions.",
  metadataBase: new URL("https://bingofinder.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <header className="bg-purple-900 text-white">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
            <Link href="/" className="text-xl font-bold tracking-tight shrink-0">
              🎱 BingoFinder
            </Link>
            <nav className="flex items-center gap-4 text-sm text-purple-200 flex-wrap">
              <Link href="/search" className="hover:text-white">Search</Link>
              <Link href="/submit" className="hover:text-white hidden sm:inline">Submit a Hall</Link>
              <Link href="/" className="hover:text-white hidden sm:inline">Browse States</Link>
            </nav>
          </div>
        </header>
        <div className="flex-1">{children}</div>
        <footer className="bg-gray-900 text-gray-400 text-sm py-8 px-4 mt-16">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row gap-6 sm:gap-12">
            <div>
              <p className="mb-1 font-semibold text-white">BingoFinder</p>
              <p>The most trusted directory of bingo halls in the United States.</p>
              <p className="mt-3">&copy; {new Date().getFullYear()} BingoFinder. All rights reserved.</p>
            </div>
            <div className="flex gap-8 text-gray-300">
              <div className="space-y-1.5">
                <p className="font-semibold text-white text-xs uppercase tracking-wide">Directory</p>
                <Link href="/" className="block hover:text-white">Browse by State</Link>
                <Link href="/search" className="block hover:text-white">Search Halls</Link>
              </div>
              <div className="space-y-1.5">
                <p className="font-semibold text-white text-xs uppercase tracking-wide">Contribute</p>
                <Link href="/submit" className="block hover:text-white">Submit a Hall</Link>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
