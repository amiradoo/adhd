import { motion } from "framer-motion";

import { GlassCard } from "@/components/site/glass-card";
import type { TestimonialItem } from "@/lib/site-types";

export function TestimonialCards({ items }: { items: TestimonialItem[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item, index) => (
        <motion.div
          key={`${item.author}-${index}`}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45, delay: index * 0.06 }}
        >
          <GlassCard className="h-full p-6">
            <p className="text-base leading-relaxed text-stone-800">&ldquo;{item.quote}&rdquo;</p>
            <div className="mt-4 border-t border-stone-300/60 pt-4">
              <p className="text-sm font-semibold text-stone-900">{item.author}</p>
              <p className="text-xs tracking-[0.16em] text-stone-600 uppercase">{item.role}</p>
            </div>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  );
}
