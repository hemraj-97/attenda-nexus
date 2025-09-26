import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_0_20px_hsl(var(--primary)/0.4)] active:scale-[0.98]",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:shadow-[0_0_20px_hsl(var(--destructive)/0.4)]",
        outline: "border border-glass-border bg-glass/50 text-foreground hover:bg-glass hover:border-primary/50 backdrop-blur-xl",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "text-foreground hover:bg-glass/50 hover:backdrop-blur-xl",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary-glow",
        neon: "bg-gradient-to-r from-neon-cyan to-neon-purple text-primary-foreground font-semibold hover:shadow-[0_0_30px_hsl(var(--neon-cyan)/0.6)] hover:scale-105 active:scale-[0.98]",
        glass: "bg-glass/30 backdrop-blur-xl border border-glass-border text-foreground hover:bg-glass/50 hover:border-primary/30 hover:shadow-[0_0_20px_hsl(var(--primary)/0.2)]",
        hero: "bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold tracking-wide hover:shadow-[0_0_40px_hsl(var(--primary)/0.8)] hover:scale-105 active:scale-[0.98] animate-glow",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 rounded-lg px-4 text-xs",
        lg: "h-14 rounded-xl px-10 text-base font-semibold",
        icon: "h-11 w-11",
        hero: "h-16 px-12 text-lg font-bold",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
});
Button.displayName = "Button";

export { Button, buttonVariants };