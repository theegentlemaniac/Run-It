import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { fieldClassName } from "@/components/ui/input";

export const Select = forwardRef<HTMLSelectElement, React.ComponentProps<"select">>(
  function Select({ className, ...props }, ref) {
    return (
      <select ref={ref} className={cn(fieldClassName, "appearance-none", className)} {...props} />
    );
  },
);
