"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

export type GameFormState = {
  error?: string;
} | null;

const createGameSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(120),
  court_id: z.string().uuid("Select a court"),
  start_time: z.string().refine((value) => !Number.isNaN(Date.parse(value)), "Enter a valid start time"),
  max_players: z.coerce.number().int().min(2).max(100),
  visibility: z.enum(["open", "invite_only"]),
  skill_level: z.enum(["beginner", "intermediate", "advanced", "pro"]).nullable(),
  notes: z.string().trim().max(2000).nullable(),
});

export async function createGame(
  _prevState: GameFormState,
  formData: FormData,
): Promise<GameFormState> {
  const parsed = createGameSchema.safeParse({
    title: formData.get("title"),
    court_id: formData.get("court_id"),
    start_time: formData.get("start_time"),
    max_players: formData.get("max_players"),
    visibility: formData.get("visibility"),
    skill_level: formData.get("skill_level") || null,
    notes: formData.get("notes") || null,
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

  const { error } = await supabase.from("games").insert({
    title: parsed.data.title,
    court_id: parsed.data.court_id,
    host_id: user.id,
    start_time: new Date(parsed.data.start_time).toISOString(),
    max_players: parsed.data.max_players,
    visibility: parsed.data.visibility,
    skill_level: parsed.data.skill_level,
    notes: parsed.data.notes,
  });

  if (error) {
    return { error: "Unable to create this game. Please try again." };
  }

  redirect("/dashboard/games");
}
