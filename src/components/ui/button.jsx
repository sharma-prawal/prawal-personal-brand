import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils.js";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-extrabold transition-all duration-300 ease-premium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "border border-[rgba(13,89,76,0.8)] bg-[linear-gradient(135deg,var(--green),var(--green-deep))] px-5 text-white shadow-[0_0_0_1px_rgba(13,89,76,0.3),0_0_30px_rgba(13,89,76,0.25),0_12px_30px_rgba(0,0,0,0.4)] hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_rgba(13,89,76,0.4),0_0_50px_rgba(13,89,76,0.35),0_18px_40px_rgba(0,0,0,0.5)]",
        secondary:
          "border border-[rgba(255,255,255,0.20)] bg-[rgba(255,255,255,0.09)] px-5 text-ink shadow-[0_8px_24px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.14)] hover:-translate-y-0.5 hover:border-[rgba(201,151,47,0.35)] hover:bg-[rgba(255,255,255,0.13)] hover:shadow-[0_18px_42px_rgba(0,0,0,0.4)]",
        ghost:
          "px-0 text-ink hover:text-brand-green"
      },
      size: {
        default: "min-h-11",
        compact: "min-h-0 text-xs"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "default"
    }
  }
);

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size }), className)} ref={ref} {...props} />;
});

Button.displayName = "Button";

export { Button, buttonVariants };
