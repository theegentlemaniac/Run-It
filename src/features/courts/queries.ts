import { createClient } from "@/lib/supabase/server";

export async function getCourts() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("courts")
    .select("*")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Unable to load courts");
  }

  return data;
}

export async function getCourtById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("courts")
    .select("*")
    .eq("id", id)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) {
    throw new Error("Unable to load court");
  }

  return data;
}

export async function getCourtReviews(courtId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("court_reviews")
    .select("*")
    .eq("court_id", courtId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Unable to load court reviews");
  }

  return data;
}
