import { createClient } from "@/lib/supabase/server";

type GameRow = { id: string; court_id: string };

/**
 * Court names and RSVP "going" counts are joined in application code rather
 * than a single relational `select` so both pieces of data can be fetched in
 * one round trip via `Promise.all` while staying fully RLS-scoped to the
 * current user.
 *
 * RSVP counts are aggregated server-side via the `game_rsvp_counts` SQL
 * function (see migration 0004) instead of a plain `select` on
 * `game_rsvps`, because the `game_rsvps` RLS policy intentionally only
 * exposes rows the caller owns or hosts — a plain select would under-count
 * "going" attendees for open games the caller doesn't host. The function
 * only returns aggregate counts (never participant identities), so ordinary
 * dashboard reads never need the service-role key.
 */
async function addGameDetails<T extends GameRow>(games: T[]) {
  if (games.length === 0) {
    return games.map((game) => ({
      ...game,
      court_name: null as string | null,
      rsvp_count: 0,
    }));
  }

  const supabase = await createClient();
  const courtIds = [...new Set(games.map((game) => game.court_id))];
  const gameIds = games.map((game) => game.id);

  const [courtsResult, rsvpResult] = await Promise.all([
    supabase.from("courts").select("id, name").in("id", courtIds),
    supabase.rpc("game_rsvp_counts", { _game_ids: gameIds }),
  ]);

  // Court names and RSVP counts are supplementary display data: if either
  // lookup fails, log the real error server-side for diagnostics and fall
  // back to safe defaults rather than failing the whole games list.
  if (courtsResult.error) {
    console.error("[games] failed to load court names for games list", {
      message: courtsResult.error.message,
      code: courtsResult.error.code,
      details: courtsResult.error.details,
      hint: courtsResult.error.hint,
      courtIds,
    });
  }
  if (rsvpResult.error) {
    console.error("[games] failed to load rsvp counts for games list", {
      message: rsvpResult.error.message,
      code: rsvpResult.error.code,
      details: rsvpResult.error.details,
      hint: rsvpResult.error.hint,
      gameIds,
    });
  }

  const courtNames = new Map(
    (courtsResult.data ?? []).map((court) => [court.id, court.name]),
  );
  const rsvpCounts = new Map(
    (rsvpResult.data ?? []).map((row) => [row.game_id, Number(row.going_count)]),
  );

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
    console.error("[games] failed to load games list", {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    });
    throw new Error(
      "We couldn't load games right now. Please try again in a moment.",
    );
  }

  if (data.length === 0) {
    return [];
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
    console.error("[games] failed to load game", {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
      gameId: id,
    });
    throw new Error(
      "We couldn't load this game right now. Please try again in a moment.",
    );
  }
  if (!data) {
    return null;
  }

  const [game] = await addGameDetails([data]);
  return game;
}
