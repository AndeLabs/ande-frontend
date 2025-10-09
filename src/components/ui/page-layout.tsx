import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

interface PageLayoutProps {
  children: ReactNode;
  variant?: "landing" | "dashboard" | "simple";
  className?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  background?: "default" | "muted" | "gradient";
}

const variantClasses = {
  landing: "flex flex-col min-h-dvh bg-background text-foreground",
  dashboard: "flex flex-col min-h-screen bg-background text-foreground",
  simple: "flex flex-col min-h-dvh bg-background text-foreground",
};

const backgroundClasses = {
  default: "",
  muted: "bg-muted/20",
  gradient: "bg-gradient-to-br from-background via-background to-primary/5",
};

export function PageLayout({
  children,
  variant = "simple",
  className,
  showHeader = true,
  showFooter = true,
  background = "default",
}: PageLayoutProps) {
  return (
    <div
      className={cn(
        variantClasses[variant],
        backgroundClasses[background],
        className
      )}
    >
      {showHeader && <Header />}
      <main className={cn("flex-1", variant === "landing" && "space-y-12 md:space-y-24 lg:space-y-32")}>
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
}