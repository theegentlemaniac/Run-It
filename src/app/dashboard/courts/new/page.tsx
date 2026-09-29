import Link from "next/link";
import { CourtForm } from "@/features/courts/court-form";

export default function NewCourtPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link
          href="/dashboard/courts"
          className="text-sm text-zinc-500 hover:text-foreground dark:text-zinc-400"
        >
          ← All courts
        </Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">Add a court</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Share a place to play with your community.
        </p>
      </div>
      <div className="rounded-xl border border-black/[.08] p-6 dark:border-white/[.145]">
        <CourtForm />
      </div>
    </div>
  );
}
