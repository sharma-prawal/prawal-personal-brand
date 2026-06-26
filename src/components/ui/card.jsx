import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../lib/utils.js";

const Card = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "div";
  return (
    <Comp
      ref={ref}
      className={cn(
        "rounded-[var(--radius)] border border-[rgba(31,29,25,0.11)] bg-[var(--surface)] shadow-premium transition-all duration-300 ease-premium",
        className
      )}
      {...props}
    />
  );
});

Card.displayName = "Card";

export { Card };
