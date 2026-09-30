"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

export type ProfileFormState = {
  error?: string;
} | null;

const profileSchema = z.object({
  full_name: z.string().trim().min(1, "Name is required").max(160),
  position: z.enum(["PG", "SG", "SF", "PF", "C"]),
  skill_rating: z.enum(["beginner", "intermediate", "advanced", "pro"]),
  bio: z.string().trim().max(2000).nullable(),
  looking_to_play: z.boolean(),
});

export async function updateProfile(
  _prevState: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const parsed = profileSchema.safeParse({
    full_name: formData.get("full_name"),
    position: formData.get("position"),
    skill_rating: formData.get("skill_rating"),
    bio: formData.get("bio") || null,
    looking_to_play: formData.get("looking_to_play") === "on",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: parsed.data.full_name,
      position: parsed.data.position,
      skill_rating: parsed.data.skill_rating,
      bio: parsed.data.bio,
      looking_to_play: parsed.data.looking_to_play,
    })
    .eq("id", user.id);

  if (error) {
    return { error: "Unable to update your profile. Please try again." };
  }

  redirect("/dashboard/profile");
}
