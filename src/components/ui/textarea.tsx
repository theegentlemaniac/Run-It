import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { fieldClassName } from "@/components/ui/input";

export const Textarea = forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  function Textarea({ className, ...props }, ref) {
    return <textarea ref={ref} className={cn(fieldClassName, "resize-y", className)} {...props} />;
  },
);
