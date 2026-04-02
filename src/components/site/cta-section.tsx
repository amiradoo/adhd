import { motion } from "framer-motion";

import { PremiumButton } from "@/components/site/premium-button";
import { SectionShell } from "@/components/site/section-shell";
import type { LinkCta } from "@/lib/site-types";

export function CTASection({
  title,
  body,
  primary,
  secondary,
  id,
}: {
  title: string;
  body: string;
  primary: LinkCta;
  secondary?: LinkCta;
  id?: string;
}) {
  return (
    <SectionShell id={id}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.45 }}
        className="cta-surface"
      >
        <p className="text-xs font-semibold tracking-[0.22em] text-amber-700/80 uppercase">Next step</p>
        <h2 className="mt-2 text-3xl font-semibold leading-tight text-stone-900 md:text-4xl">{title}</h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-stone-700">{body}</p>

        <div className="mt-7 flex flex-wrap gap-3">
          <PremiumButton href={primary.href}>{primary.label}</PremiumButton>
          {secondary ? (
            <PremiumButton href={secondary.href} variant="soft">
              {secondary.label}
            </PremiumButton>
          ) : null}
        </div>
      </motion.div>
    </SectionShell>
  );
}
