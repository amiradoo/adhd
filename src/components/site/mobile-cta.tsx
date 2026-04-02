"use client";

import { PremiumButton } from "@/components/site/premium-button";
import { useLocale } from "@/components/providers/locale-provider";

export function MobileCTA() {
  const { copy } = useLocale();

  return (
    <div className="mobile-cta-wrap md:hidden">
      <div className="mobile-cta-bar">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-600">{copy.common.badge}</p>
        <PremiumButton href="/landing" className="w-full justify-center">
          {copy.common.stickyCta}
        </PremiumButton>
      </div>
    </div>
  );
}
