"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

import { GlassCard } from "@/components/site/glass-card";
import { PremiumButton } from "@/components/site/premium-button";
import { cn } from "@/lib/cn";
import type { HeroCopy, HeroMedia } from "@/lib/site-types";

type CinematicHeroProps = {
  hero: HeroCopy;
  media: HeroMedia;
  chips?: string[];
  compact?: boolean;
};

export function CinematicHero({ hero, media, chips = [], compact = false }: CinematicHeroProps) {
  const heroRef = useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const query = window.matchMedia("(max-width: 767px)");

    const update = (event?: MediaQueryListEvent) => {
      setIsMobile(event ? event.matches : query.matches);
    };

    update();
    query.addEventListener("change", update);

    return () => {
      query.removeEventListener("change", update);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const motionValues = useMemo(() => {
    if (reduceMotion) {
      return {
        videoY: 0,
        foregroundY: 0,
        scale: 1,
        overlayStart: 0.4,
        overlayEnd: 0.5,
      };
    }

    if (isMobile) {
      return {
        videoY: -48,
        foregroundY: -72,
        scale: 1.04,
        overlayStart: 0.22,
        overlayEnd: 0.52,
      };
    }

    return {
      videoY: -120,
      foregroundY: -220,
      scale: 1.1,
      overlayStart: 0.22,
      overlayEnd: 0.62,
    };
  }, [isMobile, reduceMotion]);

  const videoY = useTransform(scrollYProgress, [0, 1], [0, motionValues.videoY]);
  const foregroundY = useTransform(scrollYProgress, [0, 1], [0, motionValues.foregroundY]);
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, motionValues.scale]);
  const overlayOpacity = useTransform(
    scrollYProgress,
    [0, 1],
    [motionValues.overlayStart, motionValues.overlayEnd],
  );

  const showVideo = media.heroVideoSrc !== null;
  const showFloating = reduceMotion !== true && media.uiElementSrcs.length > 0;

  return (
    <section
      ref={heroRef}
      className={cn("hero-shell", compact ? "hero-shell-compact" : "hero-shell-default")}
    >
      <div className="hero-background">
        {showVideo ? (
          <motion.video
            key={media.heroVideoSrc}
            className="hero-video"
            style={{ y: videoY, scale: videoScale }}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={media.heroPosterSrc}
          >
            <source src={media.heroVideoSrc ?? undefined} type="video/mp4" />
          </motion.video>
        ) : (
          <motion.div
            className="hero-image-fallback"
            style={{
              y: videoY,
              scale: videoScale,
              backgroundImage: `url(${media.heroPosterSrc})`,
            }}
          />
        )}

        <motion.div className="hero-overlay" style={{ opacity: overlayOpacity }} />
        <div className="grain-overlay" />

        {showFloating
          ? media.uiElementSrcs.slice(0, 3).map((src, index) => (
              <motion.div
                key={src + index}
                className={cn("floating-accent", `floating-accent-${index + 1}`)}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5 + index, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              >
                <Image src={src} alt="" width={180} height={180} />
              </motion.div>
            ))
          : null}
      </div>

      <div className="hero-content">
        <div className="hero-grid">
          <motion.div style={{ y: foregroundY }} className="order-2 md:order-1">
            <GlassCard className="hero-glass-panel">
              <p className="hero-eyebrow">{hero.eyebrow}</p>
              <h1 className="hero-title">{hero.title}</h1>
              <p className="hero-subtitle">{hero.subtitle}</p>

              {chips.length > 0 ? (
                <div className="hero-chips">
                  {chips.map((chip) => (
                    <span key={chip} className="hero-chip">
                      {chip}
                    </span>
                  ))}
                </div>
              ) : null}

              <div className="mt-7 flex flex-wrap gap-3">
                <PremiumButton href={hero.primaryCta.href}>{hero.primaryCta.label}</PremiumButton>
                {hero.secondaryCta ? (
                  <PremiumButton href={hero.secondaryCta.href} variant="soft">
                    {hero.secondaryCta.label}
                  </PremiumButton>
                ) : null}
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            style={{ y: foregroundY }}
            className="relative order-1 h-[320px] w-full overflow-hidden rounded-[26px] border border-white/35 bg-white/20 shadow-[0_40px_70px_rgba(87,56,37,0.2)] md:order-2 md:h-[520px]"
          >
            {media.foregroundSrc ? (
              <Image
                src={media.foregroundSrc}
                alt="ADHD Girls Club visual"
                fill
                sizes="(max-width: 767px) 100vw, 45vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.9),rgba(236,212,193,0.45)_55%,rgba(203,157,125,0.3))] p-8 text-center text-stone-700">
                <div>
                  <p className="text-xs font-semibold tracking-[0.22em] uppercase">ADHD Girls Club</p>
                  <p className="mt-3 text-lg font-semibold">Voeg een afbeelding toe in /public/foregrounds</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
