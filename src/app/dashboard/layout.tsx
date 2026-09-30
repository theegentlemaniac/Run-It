import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/features/auth/actions";
import { DashboardBottomNav, DashboardSidebarNav } from "@/components/dashboard-nav";
import { Button } from "@/components/ui/button";
import { BasketballIcon, LogOutIcon } from "@/components/ui/icons";

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

  const initial = (user.email ?? "?").charAt(0).toUpperCase();

  return (
    <div className="flex flex-1 flex-col md:flex-row">
      <aside className="hidden shrink-0 flex-col gap-6 border-r border-border p-6 md:flex md:w-64">
        <Link href="/" className="flex items-center gap-2 font-display text-lg tracking-wide">
          <BasketballIcon className="text-accent" size={22} />
          RUN-IT
        </Link>
        <DashboardSidebarNav />
        <form action={signOut}>
          <Button type="submit" variant="outline" size="sm" className="w-full justify-start">
            <LogOutIcon size={16} />
            Sign out
          </Button>
        </form>
      </aside>

      <div className="flex flex-1 flex-col pb-16 md:pb-0">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/80 px-6 py-3.5 backdrop-blur-sm md:justify-end">
          <Link href="/" className="flex items-center gap-2 font-display text-base tracking-wide md:hidden">
            <BasketballIcon className="text-accent" size={20} />
            RUN-IT
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted sm:inline">{user.email}</span>
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 text-sm font-semibold text-accent"
              aria-label={`Signed in as ${user.email}`}
            >
              {initial}
            </div>
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>

      <DashboardBottomNav />
    </div>
  );
}

