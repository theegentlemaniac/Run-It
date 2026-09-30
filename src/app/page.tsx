import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import {
  ArrowRightIcon,
  BasketballIcon,
  CourtIcon,
  GameIcon,
  ProfileIcon,
  UsersIcon,
} from "@/components/ui/icons";

const pillars = [
  {
    title: "Courts",
    description:
      "Find courts near you — including the ones missing from Google Maps. Drop a pin, add photos, and tag details like lighting and surface.",
    icon: CourtIcon,
  },
  {
    title: "Games",
    description:
      "Schedule pickup games with skill levels, capacity limits, and open or invite-only visibility. RSVP in one tap.",
    icon: GameIcon,
  },
  {
    title: "Live Scoring",
    description:
      "Build teams on the fly, keep score with a tap, and share a live link so anyone can watch.",
    icon: UsersIcon,
  },
  {
    title: "Stats & Profile",
    description:
      "Track PPG, wins, and games played. Build your reputation on the courts you run.",
    icon: ProfileIcon,
  },
];

const steps = [
  {
    step: "01",
    title: "Find your court",
    description: "Browse the map for runs near you, or add a court your crew already owns.",
  },
  {
    step: "02",
    title: "Get in the game",
    description: "RSVP to an open run or set up your own with skill level and capacity.",
  },
  {
    step: "03",
    title: "Run it, track it",
    description: "Keep live score, then watch your stats and reputation build game after game.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-background">
      <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 font-display text-xl tracking-wide">
            <BasketballIcon className="text-accent" size={24} />
            RUN-IT
          </Link>
          <nav className="flex items-center gap-2 text-sm font-medium">
            <Link href="/login" className={buttonVariants({ variant: "ghost", size: "sm" })}>
              Sign in
            </Link>
            <Link href="/signup" className={buttonVariants({ variant: "primary", size: "sm" })}>
              Get started
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden px-6 py-24 sm:py-32">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-128 bg-[radial-gradient(ellipse_at_top,var(--color-accent)_0%,transparent_60%)] opacity-10"
            aria-hidden="true"
          />
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-muted">
              Community pickup basketball
            </p>
            <h1 className="font-display text-5xl leading-[0.95] tracking-wide text-balance sm:text-7xl">
              Find a court. Find a game. Prove how good you are.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
              Run-It is the community basketball platform for discovering courts,
              scheduling pickup games, and keeping live score — anywhere pickup
              basketball happens.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/signup" className={buttonVariants({ variant: "primary", size: "lg" })}>
                Create your account
                <ArrowRightIcon size={18} />
              </Link>
              <Link href="/login" className={buttonVariants({ variant: "outline", size: "lg" })}>
                Sign in
              </Link>
            </div>
          </div>
        </section>

        <section className="px-6 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 max-w-xl">
              <h2 className="font-display text-3xl tracking-wide sm:text-4xl">
                Everything you need to run it
              </h2>
              <p className="mt-3 text-muted">
                Four tools built for the way pickup basketball actually happens.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {pillars.map((pillar) => (
                <Card key={pillar.title} hover className="group">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-white">
                    <pillar.icon size={22} />
                  </div>
                  <CardTitle>{pillar.title}</CardTitle>
                  <CardDescription className="mt-2">{pillar.description}</CardDescription>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-border bg-surface/50 px-6 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 max-w-xl">
              <h2 className="font-display text-3xl tracking-wide sm:text-4xl">How it works</h2>
              <p className="mt-3 text-muted">Three steps from the sideline to the scoreboard.</p>
            </div>
            <div className="grid gap-8 sm:grid-cols-3">
              {steps.map((item) => (
                <div key={item.step} className="relative">
                  <span className="font-display text-5xl text-accent/25">{item.step}</span>
                  <h3 className="mt-3 font-display text-xl tracking-wide">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-20 text-center sm:py-28">
          <div className="mx-auto max-w-2xl">
            <h2 className="font-display text-4xl tracking-wide sm:text-5xl">
              Ready to run it?
            </h2>
            <p className="mt-4 text-muted">
              Join the community keeping score on courts everywhere.
            </p>
            <div className="mt-8">
              <Link href="/signup" className={buttonVariants({ variant: "primary", size: "lg" })}>
                Create your account
                <ArrowRightIcon size={18} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border px-6 py-10">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
          <Link href="/" className="flex items-center gap-2 font-display text-lg tracking-wide">
            <BasketballIcon className="text-accent" size={20} />
            RUN-IT
          </Link>
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted">
            <Link href="/login" className="transition-colors hover:text-foreground">
              Sign in
            </Link>
            <Link href="/signup" className="transition-colors hover:text-foreground">
              Sign up
            </Link>
            <Link href="/dashboard/courts" className="transition-colors hover:text-foreground">
              Courts
            </Link>
            <Link href="/dashboard/games" className="transition-colors hover:text-foreground">
              Games
            </Link>
          </nav>
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} Run-It. Built for the community.
          </p>
        </div>
      </footer>
    </div>
  );
}
