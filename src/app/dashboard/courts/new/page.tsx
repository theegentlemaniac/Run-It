import Link from "next/link";
import { CourtForm } from "@/features/courts/court-form";
import { Card } from "@/components/ui/card";

export default function NewCourtPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link
          href="/dashboard/courts"
          className="text-sm text-muted transition-colors hover:text-foreground"
        >
          ← All courts
        </Link>
        <h1 className="mt-2 font-display text-2xl tracking-wide sm:text-3xl">Add a court</h1>
        <p className="text-sm text-muted">Share a place to play with your community.</p>
      </div>
      <Card>
        <CourtForm />
      </Card>
    </div>
  );
}

