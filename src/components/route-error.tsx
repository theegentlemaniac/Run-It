"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangleIcon } from "@/components/ui/icons";

/**
 * Shared route error boundary UI. Next.js remounts the closest `error.tsx`
 * when a Server Component in that route segment throws (for example, a
 * Supabase/Postgres error from a `queries.ts` helper), so this renders a
 * recoverable state instead of the default full-page dev overlay / blank
 * production error page.
 */
export function RouteError({
  error,
  reset,
  title,
}: {
  error: Error & { digest?: string };
  reset: () => void;
  title: string;
}) {
  useEffect(() => {
    // The thrown message is already a safe, user-facing string (the real
    // Supabase/Postgres error is logged server-side where it was caught).
    // Logging here just surfaces the digest for correlating with server
    // logs.
    console.error("Route error boundary caught:", error.digest ?? error.message);
  }, [error]);

  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-surface/50 px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 text-red-500">
        <AlertTriangleIcon size={24} />
      </div>
      <h3 className="font-display text-lg tracking-wide text-foreground">{title}</h3>
      <p className="max-w-sm text-sm text-muted">
        {error.message || "Something went wrong. Please try again."}
      </p>
      <Button onClick={reset} size="sm">
        Try again
      </Button>
    </div>
  );
}
