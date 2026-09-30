"use client";

import { useActionState } from "react";
import Link from "next/link";
import {
  signInWithDemoAccount,
  signInWithPassword,
  signInWithGoogle,
} from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormError } from "@/components/ui/form-error";
import { BasketballIcon, GoogleIcon } from "@/components/ui/icons";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(signInWithPassword, null);
  const [demoState, demoFormAction, demoPending] = useActionState(
    signInWithDemoAccount,
    null,
  );

  return (
    <div className="flex flex-1 items-center justify-center bg-surface/40 px-4 py-16">
      <div className="w-full max-w-sm space-y-6 rounded-2xl border border-border bg-surface p-8 shadow-sm">
        <div className="space-y-1 text-center">
          <Link href="/" className="mb-2 inline-flex items-center gap-2 font-display text-lg tracking-wide">
            <BasketballIcon className="text-accent" size={20} />
            RUN-IT
          </Link>
          <h1 className="font-display text-2xl tracking-wide">Welcome back</h1>
          <p className="text-sm text-muted">Sign in to find your next run.</p>
        </div>

        <form action={signInWithGoogle}>
          <Button type="submit" variant="outline" className="w-full">
            <GoogleIcon />
            Continue with Google
          </Button>
        </form>

        {/* Never expose demo login in production. */}
        {process.env.NODE_ENV !== "production" && (
          <form action={demoFormAction} className="space-y-2">
            <Button
              type="submit"
              variant="outline"
              pending={demoPending}
              className="w-full border-dashed"
            >
              {demoPending ? "Signing in…" : "Demo login (dev only)"}
            </Button>
            <FormError message={demoState?.error} />
          </form>
        )}

        <div className="flex items-center gap-3 text-xs uppercase text-muted">
          <span className="h-px flex-1 bg-border" />
          or
          <span className="h-px flex-1 bg-border" />
        </div>

        <form action={formAction} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required autoComplete="email" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
            />
          </div>

          <FormError message={state?.error} />

          <Button type="submit" pending={pending} className="w-full">
            {pending ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-medium text-foreground hover:text-accent">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

