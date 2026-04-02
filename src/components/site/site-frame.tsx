"use client";

import { MobileCTA } from "@/components/site/mobile-cta";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";

export function SiteFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="site-root">
      <SiteHeader />
      <main className="site-main">{children}</main>
      <SiteFooter />
      <MobileCTA />
    </div>
  );
}
