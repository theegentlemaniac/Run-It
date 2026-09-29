import Link from "next/link";
import { getCourts } from "@/features/courts/queries";

export default async function CourtsPage() {
  const courts = await getCourts();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Courts</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Discover basketball courts in your community.
          </p>
        </div>
        <Link
          href="/dashboard/courts/new"
          className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
        >
          Add a court
        </Link>
      </div>

      {courts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-black/[.08] p-8 text-center dark:border-white/[.145]">
          <p className="text-zinc-500 dark:text-zinc-400">
            No courts yet — be the first to add one
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courts.map((court) => (
            <Link
              key={court.id}
              href={`/dashboard/courts/${court.id}`}
              className="rounded-xl border border-black/[.08] p-5 transition-colors hover:bg-black/[.02] dark:border-white/[.145] dark:hover:bg-white/[.03]"
            >
              <h2 className="font-medium">{court.name}</h2>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                {court.address || "Address not provided"}
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                {court.surface && (
                  <span className="rounded-full bg-black/[.05] px-2.5 py-1 dark:bg-white/[.08]">
                    {court.surface}
                  </span>
                )}
                {court.lighting && (
                  <span className="rounded-full bg-black/[.05] px-2.5 py-1 dark:bg-white/[.08]">
                    Lighting
                  </span>
                )}
                {court.indoor && (
                  <span className="rounded-full bg-black/[.05] px-2.5 py-1 dark:bg-white/[.08]">
                    Indoor
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
