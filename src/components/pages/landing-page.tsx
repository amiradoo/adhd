"use client";

import { CinematicHero } from "@/components/site/cinematic-hero";
import { CTASection } from "@/components/site/cta-section";
import { GlassCard } from "@/components/site/glass-card";
import { SectionShell } from "@/components/site/section-shell";
import { useLocale } from "@/components/providers/locale-provider";
import type { HeroMedia } from "@/lib/site-types";

export function LandingPage({ media }: { media: HeroMedia }) {
  const { copy } = useLocale();

  return (
    <>
      <CinematicHero hero={copy.landing.hero} media={media} chips={copy.landing.proofBadges} compact />

      <SectionShell id="offer">
        <GlassCard className="p-7 md:p-10">
          <p className="section-eyebrow">Offer stack</p>
          <h2 className="section-title mt-2">{copy.landing.offerTitle}</h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-stone-700">{copy.landing.offerBody}</p>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {copy.landing.offerPoints.map((point) => (
              <div key={point} className="rounded-2xl border border-white/60 bg-white/65 p-4 text-sm text-stone-700 shadow-[0_14px_32px_rgba(123,89,62,0.1)]">
                {point}
              </div>
            ))}
          </div>
        </GlassCard>
      </SectionShell>

      <CTASection
        title={copy.home.cta.title}
        body={copy.home.cta.body}
        primary={copy.landing.cta.primary}
        secondary={copy.landing.cta.secondary}
      />
    </>
  );
}
