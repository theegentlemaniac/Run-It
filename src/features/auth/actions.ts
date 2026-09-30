"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { z } from "zod";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { getAge } from "@/lib/date";
import type { Database } from "@/lib/supabase/types";

const credentialsSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const positions = ["PG", "SG", "SF", "PF", "C"] as const;
const signUpSchema = credentialsSchema.extend({
  first_name: z.string().trim().min(1, "First name is required").max(80),
  last_name: z.string().trim().min(1, "Last name is required").max(80),
  date_of_birth: z
    .string()
    .refine((date) => {
      const age = getAge(date);
      return age !== null && age >= 13 && age <= 100;
    }, "You must be between 13 and 100 years old"),
  position: z.enum(positions),
});

export type AuthFormState = {
  error?: string;
} | null;

export async function signUpWithPassword(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = signUpSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    first_name: formData.get("first_name"),
    last_name: formData.get("last_name"),
    date_of_birth: formData.get("date_of_birth"),
    position: formData.get("position"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = await createClient();
  const fullName = `${parsed.data.first_name} ${parsed.data.last_name}`;
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { full_name: fullName },
    },
  });

  if (error || !data.user) {
    return { error: error?.message ?? "Unable to create account." };
  }

  let profileClient = supabase;
  if (!data.session) {
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceRoleKey) {
      return {
        error: "Account created, but profile details could not be saved. Configure SUPABASE_SERVICE_ROLE_KEY and try again after confirming your email.",
      };
    }
    profileClient = createSupabaseClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      serviceRoleKey,
      { auth: { autoRefreshToken: false, persistSession: false } },
    );
  }
  const { error: profileError } = await profileClient
    .from("profiles")
    .update({
      position: parsed.data.position,
      date_of_birth: parsed.data.date_of_birth,
    })
    .eq("id", data.user.id);

  if (profileError) {
    return { error: "Account created, but profile details could not be saved." };
  }

  redirect(data.session ? "/dashboard" : "/login");
}

export async function signInWithPassword(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = credentialsSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard");
}

export async function signInWithDemoAccount(): Promise<AuthFormState> {
  const parsed = credentialsSchema.safeParse({
    email: process.env.DEMO_ACCOUNT_EMAIL,
    password: process.env.DEMO_ACCOUNT_PASSWORD,
  });

  if (!parsed.success) {
    return { error: "Demo login is not configured." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { error: "Unable to sign in with the demo account." };
  }

  redirect("/dashboard");
}

export async function signInWithGoogle() {
  const supabase = await createClient();

  // The redirect origin must come from a trusted, server-controlled
  // source. In production, `NEXT_PUBLIC_SITE_URL` is required; the
  // client-supplied `Origin` header is only trusted as a convenience
  // fallback in local development, since it could otherwise be used to
  // redirect the OAuth flow to an attacker-controlled origin.
  let origin = process.env.NEXT_PUBLIC_SITE_URL;
  if (!origin) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "NEXT_PUBLIC_SITE_URL must be set in production for OAuth redirects",
      );
    }
    origin = (await headers()).get("origin") ?? "http://localhost:3000";
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  if (data.url) {
    redirect(data.url);
  }
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
