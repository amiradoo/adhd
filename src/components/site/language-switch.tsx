"use client";

import Image from "next/image";

import { useLocale } from "@/components/providers/locale-provider";
import { cn } from "@/lib/cn";
import type { Locale } from "@/lib/site-types";

function LocaleButton({
  code,
  icon,
  active,
  label,
  onSelect,
}: {
  code: Locale;
  icon: string;
  active: boolean;
  label: string;
  onSelect: (locale: Locale) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(code)}
      className={cn("locale-btn", active && "locale-btn-active")}
      aria-pressed={active}
      aria-label={label}
    >
      <Image src={icon} alt="" width={16} height={12} />
      <span>{code.toUpperCase()}</span>
    </button>
  );
}

export function LanguageSwitch() {
  const { locale, setLocale, copy } = useLocale();

  return (
    <div className="language-switch" role="group" aria-label={copy.language.label}>
      <LocaleButton
        code="nl"
        icon="/icons/flag-nl.svg"
        active={locale === "nl"}
        label={copy.language.nl}
        onSelect={setLocale}
      />
      <LocaleButton
        code="en"
        icon="/icons/flag-en.svg"
        active={locale === "en"}
        label={copy.language.en}
        onSelect={setLocale}
      />
    </div>
  );
}
