import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/features/auth/actions";

const navItems = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/courts", label: "Courts" },
  { href: "/dashboard/games", label: "Games" },
  { href: "/dashboard/profile", label: "Profile" },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex flex-1 flex-col md:flex-row">
      <aside className="flex shrink-0 flex-col gap-6 border-b border-black/[.08] p-6 md:w-64 md:border-b-0 md:border-r dark:border-white/[.145]">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          🏀 Run-It
        </Link>
        <nav className="flex flex-1 flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-black/[.04] hover:text-foreground dark:text-zinc-400 dark:hover:bg-white/[.06]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="space-y-2 text-sm">
          <p className="truncate text-zinc-500 dark:text-zinc-400">
            {user.email}
          </p>
          <form action={signOut}>
            <button
              type="submit"
              className="w-full rounded-full border border-black/[.08] px-4 py-2 text-left text-sm font-medium transition-colors hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-white/[.06]"
            >
              Sign out
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
