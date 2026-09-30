import Link from "next/link";
import { GameForm } from "@/features/games/game-form";
import { getCourts } from "@/features/courts/queries";

export default async function NewGamePage() {
  const courts = await getCourts();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link
          href="/dashboard/games"
          className="text-sm text-zinc-500 hover:text-foreground dark:text-zinc-400"
        >
          ← All games
        </Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">Create a game</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Schedule a pickup run for your community.
        </p>
      </div>
      <div className="rounded-xl border border-black/[.08] p-6 dark:border-white/[.145]">
        {courts.length > 0 ? (
          <GameForm courts={courts} />
        ) : (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Add a court before scheduling a game.{" "}
            <Link href="/dashboard/courts/new" className="font-medium text-foreground">
              Add a court
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
