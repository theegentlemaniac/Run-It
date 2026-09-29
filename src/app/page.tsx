import Link from "next/link";

const pillars = [
  {
    title: "Courts",
    description:
      "Find courts near you — including the ones missing from Google Maps. Drop a pin, add photos, and tag details like lighting and surface.",
  },
  {
    title: "Games",
    description:
      "Schedule pickup games with skill levels, capacity limits, and open or invite-only visibility. RSVP in one tap.",
  },
  {
    title: "Live Scoring",
    description:
      "Build teams on the fly, keep score with a tap, and share a live link so anyone can watch.",
  },
  {
    title: "Stats & Profile",
    description:
      "Track PPG, wins, and games played. Build your reputation on the courts you run.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <header className="flex items-center justify-between px-6 py-5">
        <span className="text-lg font-semibold tracking-tight">🏀 Run-It</span>
        <nav className="flex items-center gap-3 text-sm font-medium">
          <Link
            href="/login"
            className="rounded-full px-4 py-2 transition-colors hover:bg-black/[.04] dark:hover:bg-white/[.06]"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-foreground px-4 py-2 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
          >
            Get started
          </Link>
        </nav>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center gap-16 px-6 py-16 text-center">
        <div className="space-y-6">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Find a court, find a game, and prove how good you are.
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
            Run-It is the community basketball platform for discovering
            courts, scheduling pickup games, and keeping live score —
            anywhere pickup basketball happens.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/signup"
              className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
            >
              Create your account
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-black/[.08] px-6 py-3 text-sm font-medium transition-colors hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-white/[.06]"
            >
              Sign in
            </Link>
          </div>
        </div>

        <div className="grid gap-4 text-left sm:grid-cols-2">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="rounded-xl border border-black/[.08] bg-white p-6 dark:border-white/[.145] dark:bg-zinc-950"
            >
              <h2 className="font-medium">{pillar.title}</h2>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </main>

      <footer className="px-6 py-8 text-center text-xs text-zinc-400">
        © {new Date().getFullYear()} Run-It. Built for the community.
      </footer>
    </div>
  );
}
