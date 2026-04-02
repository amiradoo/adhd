"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import { useLocale } from "@/components/providers/locale-provider";
import { CTASection } from "@/components/site/cta-section";
import { FeatureGrid } from "@/components/site/feature-grid";
import { GlassCard } from "@/components/site/glass-card";
import { PremiumButton } from "@/components/site/premium-button";
import { SectionShell } from "@/components/site/section-shell";
import type { HeroMedia } from "@/lib/site-types";

export function AboutPage({ media }: { media: HeroMedia }) {
  const { copy } = useLocale();

  return (
    <>
      <SectionShell className="pt-32 md:pt-36">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <GlassCard className="p-7 md:p-10">
            <p className="section-eyebrow">{copy.about.hero.eyebrow}</p>
            <h1 className="section-title mt-2">{copy.about.hero.title}</h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-stone-700">{copy.about.hero.subtitle}</p>
            <PremiumButton href={copy.about.hero.primaryCta.href} className="mt-7 inline-flex">
              {copy.about.hero.primaryCta.label}
            </PremiumButton>
          </GlassCard>

          <motion.div
            className="relative overflow-hidden rounded-[24px] border border-white/45 bg-white/30"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45 }}
          >
            <div className="relative h-[340px] md:h-full md:min-h-[420px]">
              <Image src={media.heroPosterSrc} alt="About ADHD Girls Club" fill className="object-cover" />
            </div>
          </motion.div>
        </div>
      </SectionShell>

      <SectionShell>
        <div className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
          <GlassCard className="p-7 md:p-8">
            <h2 className="section-title">{copy.about.storyTitle}</h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-stone-700 md:text-base">
              {copy.about.storyBody.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-7 md:p-8">
            <h3 className="text-2xl font-semibold text-stone-900">{copy.about.timelineTitle}</h3>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-stone-700 md:text-base">
              {copy.about.timelineItems.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 block h-1.5 w-1.5 rounded-full bg-amber-700/70" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </GlassCard>
        </div>
      </SectionShell>

      <SectionShell>
        <div className="section-heading">
          <p className="section-eyebrow">Method</p>
          <h2 className="section-title">{copy.about.pillarsTitle}</h2>
        </div>
        <FeatureGrid items={copy.about.pillars} />
      </SectionShell>

      <CTASection title={copy.about.cta.title} body={copy.about.cta.body} primary={copy.about.cta.primary} />
    </>
  );
}
