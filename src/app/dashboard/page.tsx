import { createClient } from "@/lib/supabase/server";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { CourtIcon, GameIcon, UsersIcon } from "@/components/ui/icons";

const cards = [
  {
    title: "Courts",
    description: "Discover and add courts near you.",
    icon: CourtIcon,
  },
  {
    title: "Games",
    description: "Schedule or RSVP to pickup games.",
    icon: GameIcon,
  },
  {
    title: "Looking to play",
    description: "Find players open to run right now.",
    icon: UsersIcon,
  },
];

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl tracking-wide sm:text-3xl">
          Welcome{user?.email ? `, ${user.email}` : ""} 👋
        </h1>
        <p className="text-sm text-muted">
          This is your Run-It dashboard. Courts, games, and live scoring will
          show up here as they ship.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Card key={card.title} hover>
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <card.icon size={20} />
            </div>
            <CardTitle>{card.title}</CardTitle>
            <CardDescription className="mt-1">{card.description}</CardDescription>
          </Card>
        ))}
      </div>
    </div>
  );
}

