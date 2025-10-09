import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SectionHeaderProps {
  badge?: string;
  title: string;
  description?: string;
  variant?: "default" | "center" | "left";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  badgeClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  children?: ReactNode;
}

const variantClasses = {
  default: "text-left",
  center: "text-center",
  left: "text-left",
};

const titleSizeClasses = {
  sm: "text-2xl font-bold",
  md: "text-3xl font-bold sm:text-4xl",
  lg: "text-4xl font-bold sm:text-5xl md:text-6xl",
  xl: "text-5xl font-bold sm:text-6xl md:text-7xl",
};

const descriptionSizeClasses = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
};

export function SectionHeader({
  badge,
  title,
  description,
  variant = "default",
  size = "lg",
  className,
  badgeClassName,
  titleClassName,
  descriptionClassName,
  children,
}: SectionHeaderProps) {
  return (
    <div className={cn("space-y-4", variantClasses[variant], className)}>
      {badge && (
        <span
          className={cn(
            "text-accent font-semibold text-sm uppercase tracking-wide",
            badgeClassName
          )}
        >
          {badge}
        </span>
      )}
      <h2
        className={cn(
          "font-headline tracking-tight text-foreground",
          titleSizeClasses[size],
          titleClassName
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "text-muted-foreground max-w-3xl",
            descriptionSizeClasses[size],
            descriptionClassName
          )}
        >
          {description}
        </p>
      )}
      {children}
    </div>
  );
}