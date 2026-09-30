type ClassValue = string | number | false | null | undefined;

// Minimal classnames joiner — avoids adding clsx/tailwind-merge as a dependency.
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}
