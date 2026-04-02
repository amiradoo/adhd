"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

import { useLocale } from "@/components/providers/locale-provider";
import { LanguageSwitch } from "@/components/site/language-switch";
import { PremiumButton } from "@/components/site/premium-button";
import { cn } from "@/lib/cn";

export function SiteHeader() {
  const pathname = usePathname();
  const { copy } = useLocale();
  const [menuState, setMenuState] = useState({ open: false, path: pathname });
  const menuOpen = menuState.path === pathname ? menuState.open : false;

  const links = useMemo(
    () => [
      { href: "/", label: copy.nav.home },
      { href: "/about", label: copy.nav.about },
      { href: "/services", label: copy.nav.services },
      { href: "/contact", label: copy.nav.contact },
      { href: "/landing", label: copy.nav.landing },
    ],
    [copy.nav.about, copy.nav.contact, copy.nav.home, copy.nav.landing, copy.nav.services],
  );

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="site-brand">
          <span className="site-brand-mark" />
          <span>ADHD Girls Club</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={cn("site-nav-link", pathname === link.href && "site-nav-link-active")}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <LanguageSwitch />
          <PremiumButton href="/landing" className="hidden xl:inline-flex">
            {copy.common.stickyCta}
          </PremiumButton>
        </div>

        <button
          type="button"
          className="menu-toggle md:hidden"
          onClick={() => setMenuState({ open: !menuOpen, path: pathname })}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? copy.nav.closeMenu : copy.nav.openMenu}
        >
          <span className={cn("menu-line", menuOpen && "menu-line-top-open")} />
          <span className={cn("menu-line", menuOpen && "menu-line-middle-open")} />
          <span className={cn("menu-line", menuOpen && "menu-line-bottom-open")} />
        </button>
      </div>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.2 }}
            className="mobile-menu"
          >
            <div className="mobile-menu-links">
              {links.map((link) => (
                <Link key={link.href} href={link.href} className={cn("mobile-menu-link", pathname === link.href && "mobile-menu-link-active")}>
                  {link.label}
                </Link>
              ))}
            </div>
            <LanguageSwitch />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
