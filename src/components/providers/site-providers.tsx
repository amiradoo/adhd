"use client";

import { LocaleProvider } from "@/components/providers/locale-provider";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";

export function SiteProviders({ children }: { children: React.ReactNode }) {
  return (
    <LocaleProvider>
      <SmoothScrollProvider>{children}</SmoothScrollProvider>
    </LocaleProvider>
  );
}
