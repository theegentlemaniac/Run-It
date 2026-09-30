"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signUpWithPassword, signInWithGoogle } from "@/features/auth/actions";

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(signUpWithPassword, null);

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-4 py-16 dark:bg-black">
      <div className="w-full max-w-sm space-y-6 rounded-xl border border-black/[.08] bg-white p-8 shadow-sm dark:border-white/[.145] dark:bg-zinc-950">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Create your account
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Join the run. Find courts and games near you.
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

        <div className="flex items-center gap-3 text-xs uppercase text-zinc-400">
          <span className="h-px flex-1 bg-black/[.08] dark:bg-white/[.145]" />
          or
          <span className="h-px flex-1 bg-black/[.08] dark:bg-white/[.145]" />
        </div>

        <form action={formAction} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label htmlFor="first_name" className="text-sm font-medium">
                First name
              </label>
              <input
                id="first_name"
                name="first_name"
                required
                maxLength={80}
                autoComplete="given-name"
                className="w-full rounded-md border border-black/[.08] bg-transparent px-3 py-2 text-sm outline-none focus:border-foreground dark:border-white/[.145]"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="last_name" className="text-sm font-medium">
                Last name
              </label>
              <input
                id="last_name"
                name="last_name"
                required
                maxLength={80}
                autoComplete="family-name"
                className="w-full rounded-md border border-black/[.08] bg-transparent px-3 py-2 text-sm outline-none focus:border-foreground dark:border-white/[.145]"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label htmlFor="date_of_birth" className="text-sm font-medium">
              Date of birth
            </label>
            <input
              id="date_of_birth"
              name="date_of_birth"
              type="date"
              required
              autoComplete="bday"
              className="w-full rounded-md border border-black/[.08] bg-transparent px-3 py-2 text-sm outline-none focus:border-foreground dark:border-white/[.145]"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="position" className="text-sm font-medium">
              Position
            </label>
            <select
              id="position"
              name="position"
              required
              defaultValue=""
              className="w-full rounded-md border border-black/[.08] bg-transparent px-3 py-2 text-sm outline-none focus:border-foreground dark:border-white/[.145]"
            >
              <option value="" disabled>Select a position</option>
              {["PG", "SG", "SF", "PF", "C"].map((position) => (
                <option key={position} value={position}>{position}</option>
              ))}
            </select>
          </div>
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
              minLength={8}
              autoComplete="new-password"
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
            {pending ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-foreground">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
