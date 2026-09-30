import Link from "next/link";
import { GameForm } from "@/features/games/game-form";
import { getCourts } from "@/features/courts/queries";
import { Card } from "@/components/ui/card";

export default async function NewGamePage() {
  const courts = await getCourts();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link
          href="/dashboard/games"
          className="text-sm text-muted transition-colors hover:text-foreground"
        >
          ← All games
        </Link>
        <h1 className="mt-2 font-display text-2xl tracking-wide sm:text-3xl">Create a game</h1>
        <p className="text-sm text-muted">Schedule a pickup run for your community.</p>
      </div>
      <Card>
        {courts.length > 0 ? (
          <GameForm courts={courts} />
        ) : (
          <p className="text-sm text-muted">
            Add a court before scheduling a game.{" "}
            <Link href="/dashboard/courts/new" className="font-medium text-foreground hover:text-accent">
              Add a court
            </Link>
          </p>
        )}
      </Card>
    </div>
  );
}

