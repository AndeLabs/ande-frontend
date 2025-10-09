import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SectionWrapperProps {
  children: ReactNode;
  id?: string;
  className?: string;
  variant?: "default" | "compact" | "wide";
  padding?: "sm" | "md" | "lg" | "xl";
  background?: "default" | "muted" | "gradient" | "primary";
}

const variantClasses = {
  default: "container mx-auto px-4",
  compact: "container mx-auto px-4 max-w-4xl",
  wide: "container mx-auto px-4 max-w-7xl",
};

const paddingClasses = {
  sm: "py-8",
  md: "py-12",
  lg: "py-16 md:py-24",
  xl: "py-20 md:py-32",
};

const backgroundClasses = {
  default: "",
  muted: "bg-muted/50",
  gradient: "bg-gradient-to-br from-primary/5 via-background to-secondary/5",
  primary: "bg-primary/5",
};

export function SectionWrapper({
  children,
  id,
  className,
  variant = "default",
  padding = "lg",
  background = "default",
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={cn(
        "w-full",
        variantClasses[variant],
        paddingClasses[padding],
        backgroundClasses[background],
        className
      )}
    >
      {children}
    </section>
  );
}