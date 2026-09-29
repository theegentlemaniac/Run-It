import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome{user?.email ? `, ${user.email}` : ""} 👋
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          This is your Run-It dashboard. Courts, games, and live scoring will
          show up here as they ship.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          {
            title: "Courts",
            description: "Discover and add courts near you.",
          },
          {
            title: "Games",
            description: "Schedule or RSVP to pickup games.",
          },
          {
            title: "Looking to play",
            description: "Find players open to run right now.",
          },
        ].map((card) => (
          <div
            key={card.title}
            className="rounded-xl border border-black/[.08] p-5 dark:border-white/[.145]"
          >
            <h2 className="font-medium">{card.title}</h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {card.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
