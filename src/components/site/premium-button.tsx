import Link from "next/link";

import { cn } from "@/lib/cn";

type PremiumButtonProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "soft" | "ghost";
};

const variantClassNames: Record<NonNullable<PremiumButtonProps["variant"]>, string> = {
  primary: "premium-btn premium-btn-primary",
  soft: "premium-btn premium-btn-soft",
  ghost: "premium-btn premium-btn-ghost",
};

export function PremiumButton({ href, children, className, variant = "primary" }: PremiumButtonProps) {
  return (
    <Link href={href} className={cn(variantClassNames[variant], className)}>
      {children}
    </Link>
  );
}
