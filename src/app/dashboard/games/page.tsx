import Link from "next/link";
import { getGames } from "@/features/games/queries";

export default async function GamesPage() {
  const games = await getGames();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Games</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Find your next pickup run.
          </p>
        </div>
        <Link
          href="/dashboard/games/new"
          className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
        >
          Create a game
        </Link>
      </div>

      {games.length === 0 ? (
        <div className="rounded-xl border border-dashed border-black/[.08] p-8 text-center dark:border-white/[.145]">
          <p className="text-zinc-500 dark:text-zinc-400">
            No games yet — schedule the first run.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {games.map((game) => (
            <article
              key={game.id}
              className="rounded-xl border border-black/[.08] p-5 dark:border-white/[.145]"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-medium">{game.title}</h2>
                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    {game.court_name ?? "Court unavailable"} ·{" "}
                    {new Date(game.start_time).toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full bg-black/[.05] px-2.5 py-1 dark:bg-white/[.08]">
                    {game.visibility === "invite_only" ? "Invite only" : "Open"}
                  </span>
                  <span className="rounded-full bg-black/[.05] px-2.5 py-1 dark:bg-white/[.08]">
                    {game.rsvp_count}/{game.max_players} players
                  </span>
                  {game.skill_level && (
                    <span className="rounded-full bg-black/[.05] px-2.5 py-1 dark:bg-white/[.08]">
                      {game.skill_level}
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
