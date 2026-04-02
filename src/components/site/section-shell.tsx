import { cn } from "@/lib/cn";

export function SectionShell({
  children,
  id,
  className,
  innerClassName,
}: {
  children: React.ReactNode;
  id?: string;
  className?: string;
  innerClassName?: string;
}) {
  return (
    <section id={id} className={cn("section-shell", className)}>
      <div className={cn("section-shell-inner", innerClassName)}>{children}</div>
    </section>
  );
}
