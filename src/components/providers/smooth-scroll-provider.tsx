"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const lenis = new Lenis({
      duration: 1.08,
      smoothWheel: true,
      touchMultiplier: 1.05,
      syncTouch: false,
    });

    let animationFrame = 0;

    const raf = (time: number) => {
      lenis.raf(time);
      animationFrame = window.requestAnimationFrame(raf);
    };

    animationFrame = window.requestAnimationFrame(raf);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
