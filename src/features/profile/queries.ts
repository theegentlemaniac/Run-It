import { createClient } from "@/lib/supabase/server";

export async function getProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    throw new Error("Unable to load profile");
  }
  if (!profile) {
    return null;
  }

  let homeCourtName: string | null = null;
  if (profile.home_court_id) {
    const { data: court, error: courtError } = await supabase
      .from("courts")
      .select("name")
      .eq("id", profile.home_court_id)
      .maybeSingle();
    if (courtError) {
      throw new Error("Unable to load profile");
    }
    homeCourtName = court?.name ?? null;
  }

  return { ...profile, home_court_name: homeCourtName };
}
