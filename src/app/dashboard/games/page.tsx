import Link from "next/link";
import { getGames } from "@/features/games/queries";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ClockIcon, GameIcon, PlusIcon, UsersIcon } from "@/components/ui/icons";

export default async function GamesPage() {
  const games = await getGames();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl tracking-wide sm:text-3xl">Games</h1>
          <p className="text-sm text-muted">Find your next pickup run.</p>
        </div>
        <Link href="/dashboard/games/new" className={buttonVariants()}>
          <PlusIcon size={16} />
          Create a game
        </Link>
      </div>

      {games.length === 0 ? (
        <EmptyState
          icon={<GameIcon size={24} />}
          title="No games yet"
          description="Schedule the first run for your community."
          action={
            <Link href="/dashboard/games/new" className={buttonVariants({ size: "sm" })}>
              <PlusIcon size={16} />
              Create a game
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {games.map((game) => (
            <Card key={game.id} hover>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-lg tracking-wide">{game.title}</h2>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
                    <ClockIcon size={15} />
                    {game.court_name ?? "Court unavailable"} ·{" "}
                    {new Date(game.start_time).toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge>{game.visibility === "invite_only" ? "Invite only" : "Open"}</Badge>
                  <Badge>
                    <UsersIcon size={13} />
                    {game.rsvp_count}/{game.max_players}
                  </Badge>
                  {game.skill_level && <Badge>{game.skill_level}</Badge>}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

