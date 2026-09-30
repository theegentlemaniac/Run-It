"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signUpWithPassword, signInWithGoogle } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { FormError } from "@/components/ui/form-error";
import { BasketballIcon, GoogleIcon } from "@/components/ui/icons";

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(signUpWithPassword, null);

  return (
    <div className="flex flex-1 items-center justify-center bg-surface/40 px-4 py-16">
      <div className="w-full max-w-sm space-y-6 rounded-2xl border border-border bg-surface p-8 shadow-sm">
        <div className="space-y-1 text-center">
          <Link href="/" className="mb-2 inline-flex items-center gap-2 font-display text-lg tracking-wide">
            <BasketballIcon className="text-accent" size={20} />
            RUN-IT
          </Link>
          <h1 className="font-display text-2xl tracking-wide">Create your account</h1>
          <p className="text-sm text-muted">Join the run. Find courts and games near you.</p>
        </div>

        <form action={signInWithGoogle}>
          <Button type="submit" variant="outline" className="w-full">
            <GoogleIcon />
            Continue with Google
          </Button>
        </form>

        <div className="flex items-center gap-3 text-xs uppercase text-muted">
          <span className="h-px flex-1 bg-border" />
          or
          <span className="h-px flex-1 bg-border" />
        </div>

        <form action={formAction} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="first_name">First name</Label>
              <Input
                id="first_name"
                name="first_name"
                required
                maxLength={80}
                autoComplete="given-name"
              />
            </div>
            <div>
              <Label htmlFor="last_name">Last name</Label>
              <Input
                id="last_name"
                name="last_name"
                required
                maxLength={80}
                autoComplete="family-name"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="date_of_birth">Date of birth</Label>
            <Input
              id="date_of_birth"
              name="date_of_birth"
              type="date"
              required
              autoComplete="bday"
            />
          </div>
          <div>
            <Label htmlFor="position">Position</Label>
            <Select id="position" name="position" required defaultValue="">
              <option value="" disabled>Select a position</option>
              {["PG", "SG", "SF", "PF", "C"].map((position) => (
                <option key={position} value={position}>{position}</option>
              ))}
            </Select>
          </div>
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
              minLength={8}
              autoComplete="new-password"
            />
          </div>

          <FormError message={state?.error} />

          <Button type="submit" pending={pending} className="w-full">
            {pending ? "Creating account…" : "Create account"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-foreground hover:text-accent">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

