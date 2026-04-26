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
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold tracking-tight">
              🎱 BingoFinder
            </Link>
            <nav className="text-sm text-purple-200">
              <Link href="/" className="hover:text-white">
                All States
              </Link>
            </nav>
          </div>
        </header>
        <div className="flex-1">{children}</div>
        <footer className="bg-gray-900 text-gray-400 text-sm py-8 px-4 mt-16">
          <div className="max-w-6xl mx-auto">
            <p className="mb-2 font-semibold text-white">BingoFinder</p>
            <p>
              The most trusted directory of bingo halls in the United States.
            </p>
            <p className="mt-4">
              &copy; {new Date().getFullYear()} BingoFinder. All rights
              reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
