"use client";

import { CinematicHero } from "@/components/site/cinematic-hero";
import { CTASection } from "@/components/site/cta-section";
import { FeatureGrid } from "@/components/site/feature-grid";
import { SectionShell } from "@/components/site/section-shell";
import { TestimonialCards } from "@/components/site/testimonial-cards";
import { useLocale } from "@/components/providers/locale-provider";
import type { HeroMedia } from "@/lib/site-types";

export function HomePage({ media }: { media: HeroMedia }) {
  const { copy } = useLocale();

  return (
    <>
      <CinematicHero hero={copy.home.hero} media={media} chips={copy.home.stats} />

      <SectionShell>
        <div className="section-heading">
          <p className="section-eyebrow">{copy.common.badge}</p>
          <h2 className="section-title">{copy.home.featuresTitle}</h2>
        </div>
        <FeatureGrid items={copy.home.features} />
      </SectionShell>

      <SectionShell>
        <div className="section-heading">
          <p className="section-eyebrow">Social proof</p>
          <h2 className="section-title">{copy.home.testimonialsTitle}</h2>
        </div>
        <TestimonialCards items={copy.home.testimonials} />
      </SectionShell>

      <CTASection
        title={copy.home.cta.title}
        body={copy.home.cta.body}
        primary={copy.home.cta.primary}
        secondary={copy.home.cta.secondary}
      />
    </>
  );
}
