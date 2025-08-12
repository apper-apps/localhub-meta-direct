import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-lg bg-white shadow-card hover:shadow-card-hover transition-all duration-200",
        className
      )}
      {...props}
    />
  );
});

Card.displayName = "Card";

export default Card;