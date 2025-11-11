import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/providers/AppProviders";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { AppBackground } from "@/components/backgrounds/AppBackground";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Liquid Ether FC | Football Commerce",
  description:
    "Immersive football e-commerce experience with Liquid Ether by React Bits, curated kits, account auth, cart, and Google Sheets powered orders.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AppProviders>
          <AppBackground />
          <div className="site-content">
            <SiteHeader />
            <div className="site-shell">
              <div className="page-container">{children}</div>
            </div>
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
