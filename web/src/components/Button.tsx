import Link from "next/link";
import type { ReactNode } from "react";

const base =
  "inline-flex items-center justify-center rounded-[var(--radius-lg)] px-5 py-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-60";

export function Button({
  children,
  href,
  variant = "primary",
  className = "",
  type,
  onClick,
}: {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
}) {
  const styles =
    variant === "primary"
      ? "bg-brand text-white hover:bg-brand/90"
      : variant === "secondary"
        ? "bg-white text-foreground ring-1 ring-border hover:bg-surface/60"
        : "bg-transparent text-foreground hover:bg-surface/60";

  const cls = `${base} ${styles} ${className}`;

  if (href) {
    return (
      <Link className={cls} href={href}>
        {children}
      </Link>
    );
  }

  return (
    <button className={cls} type={type ?? "button"} onClick={onClick}>
      {children}
    </button>
  );
}

