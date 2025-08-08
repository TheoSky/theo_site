import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const cyberBadgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
        tech: "border-cyber-cyan/30 bg-cyber-cyan/10 text-cyber-cyan shadow-sm hover:bg-cyber-cyan/20 backdrop-blur-sm",
        glow: "border-cyber-purple/30 bg-cyber-purple/10 text-cyber-purple shadow-lg hover:shadow-cyber-glow backdrop-blur-sm",
        neon: "border-cyber-pink/30 bg-cyber-pink/10 text-cyber-pink shadow-sm hover:bg-cyber-pink/20 backdrop-blur-sm animate-pulse-glow",
        gradient: "border-transparent bg-gradient-to-r from-cyber-cyan/20 via-cyber-purple/20 to-cyber-pink/20 text-foreground shadow-lg backdrop-blur-sm"
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface CyberBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cyberBadgeVariants> {}

function CyberBadge({ className, variant, ...props }: CyberBadgeProps) {
  return (
    <div className={cn(cyberBadgeVariants({ variant }), className)} {...props} />
  )
}

export { CyberBadge, cyberBadgeVariants }