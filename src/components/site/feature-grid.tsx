import { motion } from "framer-motion";

import { GlassCard } from "@/components/site/glass-card";
import type { FeatureItem } from "@/lib/site-types";

export function FeatureGrid({ items }: { items: FeatureItem[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item, index) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45, delay: index * 0.05 }}
        >
          <GlassCard className="h-full p-6">
            {item.icon ? <p className="text-xs font-semibold tracking-[0.24em] text-amber-700/70">{item.icon}</p> : null}
            <h3 className="mt-3 text-xl font-semibold text-stone-900">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-stone-700">{item.description}</p>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  );
}
