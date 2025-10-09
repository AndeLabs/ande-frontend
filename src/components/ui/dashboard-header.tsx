import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ReactNode } from "react";

interface DashboardHeaderProps {
  title: string;
  description?: string;
  badge?: string;
  badgeVariant?: "default" | "success" | "warning" | "error";
  actions?: ReactNode;
  className?: string;
  background?: "default" | "gradient" | "muted";
}

const backgroundClasses = {
  default: "",
  gradient: "bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-lg p-6 mb-8",
  muted: "bg-muted/50 rounded-lg p-6 mb-8",
};

const badgeVariantClasses = {
  default: "border-blue-500 text-blue-400 bg-blue-500/10",
  success: "border-green-500 text-green-400 bg-green-500/10",
  warning: "border-orange-500 text-orange-400 bg-orange-500/10",
  error: "border-red-500 text-red-400 bg-red-500/10",
};

export function DashboardHeader({
  title,
  description,
  badge,
  badgeVariant = "default",
  actions,
  className,
  background = "default",
}: DashboardHeaderProps) {
  return (
    <div className={cn("container mx-auto px-4 py-8", className)}>
      <div className={cn("flex items-center justify-between", background)}>
        <div className="flex-1">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold ande-gradient-text">
                {title}
              </h1>
              {description && (
                <p className="text-lg text-ande-gray mt-2">
                  {description}
                </p>
              )}
            </div>
            {badge && (
              <Badge variant="outline" className={badgeVariantClasses[badgeVariant]}>
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                {badge}
              </Badge>
            )}
          </div>
        </div>
        {actions && (
          <div className="flex items-center space-x-3">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}