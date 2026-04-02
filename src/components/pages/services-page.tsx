"use client";

import { motion } from "framer-motion";

import { useLocale } from "@/components/providers/locale-provider";
import { CTASection } from "@/components/site/cta-section";
import { GlassCard } from "@/components/site/glass-card";
import { PremiumButton } from "@/components/site/premium-button";
import { SectionShell } from "@/components/site/section-shell";

export function ServicesPage() {
  const { copy } = useLocale();

  return (
    <>
      <SectionShell className="pt-32 md:pt-36">
        <GlassCard className="p-7 md:p-10">
          <p className="section-eyebrow">{copy.services.hero.eyebrow}</p>
          <h1 className="section-title mt-2">{copy.services.hero.title}</h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-stone-700">{copy.services.hero.subtitle}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <PremiumButton href={copy.services.hero.primaryCta.href}>{copy.services.hero.primaryCta.label}</PremiumButton>
            {copy.services.hero.secondaryCta ? (
              <PremiumButton href={copy.services.hero.secondaryCta.href} variant="soft">
                {copy.services.hero.secondaryCta.label}
              </PremiumButton>
            ) : null}
          </div>
        </GlassCard>
      </SectionShell>

      <SectionShell>
        <div className="grid gap-4 xl:grid-cols-3">
          {copy.services.products.map((product, index) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.45, delay: index * 0.06 }}
            >
              <GlassCard className="h-full p-6">
                <p className="text-xs font-semibold tracking-[0.18em] text-amber-700/80 uppercase">{copy.common.serviceLabel}</p>
                <h2 className="mt-2 text-2xl font-semibold text-stone-900">{product.name}</h2>
                <p className="mt-1 text-sm text-stone-700">{product.subtitle}</p>
                <p className="mt-5 text-3xl font-semibold text-stone-900">{product.price}</p>

                <ul className="mt-5 space-y-2 text-sm text-stone-700">
                  {product.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-2">
                      <span className="mt-2 block h-1.5 w-1.5 rounded-full bg-amber-700/70" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>

                <PremiumButton href="/contact" className="mt-6 w-full justify-center">
                  {product.cta}
                </PremiumButton>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </SectionShell>

      <SectionShell>
        <GlassCard className="p-7 md:p-9">
          <h3 className="section-title">{copy.services.valueTitle}</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {copy.services.valuePoints.map((point) => (
              <div key={point} className="rounded-2xl border border-white/60 bg-white/65 p-4 text-sm text-stone-700 shadow-[0_14px_32px_rgba(123,89,62,0.1)]">
                {point}
              </div>
            ))}
          </div>
        </GlassCard>
      </SectionShell>

      <CTASection
        title={copy.services.cta.title}
        body={copy.services.cta.body}
        primary={copy.services.cta.primary}
        secondary={copy.services.cta.secondary}
      />
    </>
  );
}
