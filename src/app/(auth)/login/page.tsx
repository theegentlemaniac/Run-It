"use client";

import { useActionState } from "react";
import Link from "next/link";
import {
  signInWithDemoAccount,
  signInWithPassword,
  signInWithGoogle,
} from "@/features/auth/actions";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(signInWithPassword, null);
  const [demoState, demoFormAction, demoPending] = useActionState(
    signInWithDemoAccount,
    null,
  );

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-4 py-16 dark:bg-black">
      <div className="w-full max-w-sm space-y-6 rounded-xl border border-black/[.08] bg-white p-8 shadow-sm dark:border-white/[.145] dark:bg-zinc-950">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Sign in to find your next run.
          </p>
        </div>

        <form action={signInWithGoogle}>
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-full border border-black/[.08] px-5 py-2.5 text-sm font-medium transition-colors hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-white/[.06]"
          >
            Continue with Google
          </button>
        </form>

        {/* Never expose demo login in production. */}
        {process.env.NODE_ENV !== "production" && (
          <form action={demoFormAction} className="space-y-2">
            <button
              type="submit"
              disabled={demoPending}
              className="w-full rounded-full border border-dashed border-black/[.2] px-5 py-2.5 text-sm font-medium transition-colors hover:bg-black/[.04] disabled:opacity-60 dark:border-white/[.25] dark:hover:bg-white/[.06]"
            >
              {demoPending ? "Signing in…" : "Demo login (dev only)"}
            </button>
            {demoState?.error && (
              <p role="alert" className="text-center text-sm text-red-600 dark:text-red-400">
                {demoState.error}
              </p>
            )}
          </form>
        )}

        <div className="flex items-center gap-3 text-xs uppercase text-zinc-400">
          <span className="h-px flex-1 bg-black/[.08] dark:bg-white/[.145]" />
          or
          <span className="h-px flex-1 bg-black/[.08] dark:bg-white/[.145]" />
        </div>

        <form action={formAction} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full rounded-md border border-black/[.08] bg-transparent px-3 py-2 text-sm outline-none focus:border-foreground dark:border-white/[.145]"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-md border border-black/[.08] bg-transparent px-3 py-2 text-sm outline-none focus:border-foreground dark:border-white/[.145]"
            />
          </div>

          {state?.error && (
            <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-[#383838] disabled:opacity-60 dark:hover:bg-[#ccc]"
          >
            {pending ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-medium text-foreground">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
