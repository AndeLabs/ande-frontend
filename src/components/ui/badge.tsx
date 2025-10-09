import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80 shadow-sm hover:shadow-md",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm hover:shadow-md",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80 shadow-sm hover:shadow-md",
        outline: "text-foreground border-current hover:bg-current/10",

        /* Variantes Ande Labs */
        "ande-primary":
          "border-transparent bg-ande-blue text-white hover:bg-ande-blue/90 shadow-md hover:shadow-lg",
        "ande-secondary":
          "border-transparent bg-ande-orange text-white hover:bg-ande-orange/90 shadow-md hover:shadow-lg",
        "ande-lavender":
          "border-transparent bg-ande-lavender/20 text-gray-800 hover:bg-ande-lavender/30 border-ande-lavender/30",
        "ande-peach":
          "border-transparent bg-ande-peach/20 text-gray-800 hover:bg-ande-peach/30 border-ande-peach/40",
        "ande-outline-primary":
          "text-ande-blue border-ande-blue hover:bg-ande-blue hover:text-white hover:border-transparent",
        "ande-outline-secondary":
          "text-ande-orange border-ande-orange hover:bg-ande-orange hover:text-white hover:border-transparent",
        "ande-gradient":
          "border-transparent ande-gradient-primary text-white shadow-md hover:shadow-lg hover:scale-105",
        "ande-success":
          "border-transparent bg-green-500 text-white hover:bg-green-600 shadow-md hover:shadow-lg",
        "ande-warning":
          "border-transparent bg-ande-orange text-white hover:bg-ande-orange/90 shadow-md hover:shadow-lg",
        "ande-ghost":
          "text-ande-gray hover:bg-ande-peach/20 hover:text-gray-800",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0.5 text-xs",
        md: "px-3 py-1 text-sm",
        lg: "px-4 py-1.5 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  )
)
Badge.displayName = "Badge"

export { Badge, badgeVariants }
