"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

export type CourtFormState = {
  error?: string;
} | null;

const optionalNumber = (schema: z.ZodNumber) =>
  z.preprocess(
    (value) => (value === "" || value === null ? undefined : Number(value)),
    schema.optional(),
  );

const addCourtSchema = z.object({
  name: z.string().trim().min(1, "Court name is required").max(120),
  address: z.string().trim().max(250).nullable(),
  surface: z.enum(["asphalt", "concrete", "wood", "rubber", "other"]).nullable(),
  hoop_count: optionalNumber(z.number().int().min(1).max(32767)),
  lighting: z.boolean(),
  indoor: z.boolean(),
  description: z.string().trim().max(2000).nullable(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export async function addCourt(
  _prevState: CourtFormState,
  formData: FormData,
): Promise<CourtFormState> {
  const parsed = addCourtSchema.safeParse({
    name: formData.get("name"),
    address: formData.get("address") || null,
    surface: formData.get("surface") || null,
    hoop_count: formData.get("hoop_count"),
    lighting: formData.get("lighting") === "on",
    indoor: formData.get("indoor") === "on",
    description: formData.get("description") || null,
    latitude: Number(formData.get("latitude")),
    longitude: Number(formData.get("longitude")),
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

  const { error } = await supabase.from("courts").insert({
    name: parsed.data.name,
    address: parsed.data.address || null,
    surface: parsed.data.surface,
    hoop_count: parsed.data.hoop_count ?? null,
    lighting: parsed.data.lighting,
    indoor: parsed.data.indoor,
    description: parsed.data.description || null,
    location: `SRID=4326;POINT(${parsed.data.longitude} ${parsed.data.latitude})`,
    source: "user_added",
    created_by: user.id,
  });

  if (error) {
    return { error: "Unable to add this court. Please try again." };
  }

  redirect("/dashboard/courts");
}

const addCourtReviewSchema = z.object({
  courtId: z.string().uuid(),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().trim().max(2000).nullable(),
  tags: z.array(z.string().trim().min(1).max(40)).max(10),
});

export async function addCourtReview(
  _prevState: CourtFormState,
  formData: FormData,
): Promise<CourtFormState> {
  const tagsValue = formData.get("tags");
  const parsed = addCourtReviewSchema.safeParse({
    courtId: formData.get("courtId"),
    rating: formData.get("rating"),
    comment: formData.get("comment") || null,
    tags:
      typeof tagsValue === "string" && tagsValue.trim()
        ? tagsValue.split(",").map((tag) => tag.trim()).filter(Boolean)
        : [],
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

  const { error } = await supabase.from("court_reviews").insert({
    court_id: parsed.data.courtId,
    user_id: user.id,
    rating: parsed.data.rating,
    comment: parsed.data.comment || null,
    tags: parsed.data.tags,
  });

  if (error?.code === "23505") {
    return { error: "You've already reviewed this court." };
  }

  if (error) {
    return { error: "Unable to submit your review. Please try again." };
  }

  redirect(`/dashboard/courts/${parsed.data.courtId}`);
}
