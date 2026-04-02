import { cn } from "@/lib/cn";

export function GlassCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("glass-card", className)}>{children}</div>;
}
