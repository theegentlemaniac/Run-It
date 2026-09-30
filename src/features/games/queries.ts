import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

async function addGameDetails<
  T extends { id: string; court_id: string },
>(games: T[]) {
  if (games.length === 0) {
    return games.map((game) => ({
      ...game,
      court_name: null as string | null,
      rsvp_count: 0,
    }));
  }

  const supabase = await createClient();
  const courtIds = [...new Set(games.map((game) => game.court_id))];
  const { data: courts, error: courtError } = await supabase
    .from("courts")
    .select("id, name")
    .in("id", courtIds);
  if (courtError) {
    throw new Error("Unable to load game courts");
  }

  const rsvpCounts = new Map<string, number>();
  let rsvpClient = supabase;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (serviceRoleKey) {
    // These game IDs were first selected through the user's RLS-scoped query.
    rsvpClient = createSupabaseClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      serviceRoleKey,
      { auth: { autoRefreshToken: false, persistSession: false } },
    );
  }
  const { data: rsvps, error: rsvpError } = await rsvpClient
    .from("game_rsvps")
    .select("game_id")
    .in("game_id", games.map((game) => game.id))
    .eq("status", "going");
  if (rsvpError) {
    throw new Error("Unable to load game RSVPs");
  }

  for (const rsvp of rsvps) {
    rsvpCounts.set(rsvp.game_id, (rsvpCounts.get(rsvp.game_id) ?? 0) + 1);
  }

  const courtNames = new Map(courts.map((court) => [court.id, court.name]));
  return games.map((game) => ({
    ...game,
    court_name: courtNames.get(game.court_id) ?? null,
    rsvp_count: rsvpCounts.get(game.id) ?? 0,
  }));
}

export async function getGames() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("games")
    .select("*")
    .is("deleted_at", null)
    .order("start_time", { ascending: true });

  if (error) {
    throw new Error("Unable to load games");
  }

  return addGameDetails(data);
}

export async function getGameById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("games")
    .select("*")
    .eq("id", id)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) {
    throw new Error("Unable to load game");
  }
  if (!data) {
    return null;
  }

  const [game] = await addGameDetails([data]);
  return game;
}
