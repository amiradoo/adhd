import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";

import { SiteProviders } from "@/components/providers/site-providers";
import { SiteFrame } from "@/components/site/site-frame";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ADHD Girls Club | Premium ADHD Quiz + E-book Flow",
  description:
    "Cinematic, mobile-first ADHD Girls Club website met type quiz, e-book funnel en premium zachte UX.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className={`${manrope.variable} ${playfair.variable} h-full antialiased`}>
      <body className="min-h-full">
        <SiteProviders>
          <SiteFrame>{children}</SiteFrame>
        </SiteProviders>
      </body>
    </html>
  );
}
