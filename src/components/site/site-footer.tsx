"use client";

import Link from "next/link";

import { useLocale } from "@/components/providers/locale-provider";

export function SiteFooter() {
  const { copy } = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div>
          <p className="text-sm font-semibold tracking-[0.2em] text-amber-700/80 uppercase">{copy.footer.brand}</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-stone-700">{copy.footer.blurb}</p>
          <p className="mt-6 text-xs text-stone-500">© {year} ADHD Girls Club</p>
        </div>

        <div>
          <p className="footer-title">{copy.footer.linksTitle}</p>
          <ul className="footer-list">
            <li>
              <Link href="/">{copy.nav.home}</Link>
            </li>
            <li>
              <Link href="/about">{copy.nav.about}</Link>
            </li>
            <li>
              <Link href="/services">{copy.nav.services}</Link>
            </li>
            <li>
              <Link href="/contact">{copy.nav.contact}</Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="footer-title">{copy.footer.legalTitle}</p>
          <ul className="footer-list">
            {copy.footer.legalItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <p className="footer-title">{copy.footer.contactTitle}</p>
          <ul className="footer-list">
            {copy.footer.contactItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
