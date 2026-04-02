"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { getSiteCopy } from "@/lib/site-copy";
import type { Locale, SiteCopy } from "@/lib/site-types";

type LocaleContextValue = {
  locale: Locale;
  copy: SiteCopy;
  setLocale: (nextLocale: Locale) => void;
  toggleLocale: () => void;
  isReady: boolean;
};

const LOCALE_STORAGE_KEY = "adhd-girls-club-locale";

const LocaleContext = createContext<LocaleContextValue | null>(null);

function readBrowserLocale(): Locale {
  if (typeof window === "undefined") return "nl";

  const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
  if (stored === "nl" || stored === "en") return stored;

  const browserLocale = window.navigator.language.toLowerCase();
  return browserLocale.startsWith("nl") ? "nl" : "en";
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(readBrowserLocale);

  useEffect(() => {
    if (typeof window === "undefined") return;

    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo<LocaleContextValue>(() => {
    return {
      locale,
      copy: getSiteCopy(locale),
      setLocale: (nextLocale) => setLocaleState(nextLocale),
      toggleLocale: () => setLocaleState((prev) => (prev === "nl" ? "en" : "nl")),
      isReady: true,
    };
  }, [locale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const context = useContext(LocaleContext);

  if (!context) {
    throw new Error("useLocale must be used inside LocaleProvider.");
  }

  return context;
}
