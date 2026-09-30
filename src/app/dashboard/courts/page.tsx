import Link from "next/link";
import { getCourts } from "@/features/courts/queries";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { CourtIcon, LightbulbIcon, BuildingIcon, PlusIcon } from "@/components/ui/icons";

export default async function CourtsPage() {
  const courts = await getCourts();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl tracking-wide sm:text-3xl">Courts</h1>
          <p className="text-sm text-muted">Discover basketball courts in your community.</p>
        </div>
        <Link href="/dashboard/courts/new" className={buttonVariants()}>
          <PlusIcon size={16} />
          Add a court
        </Link>
      </div>

      {courts.length === 0 ? (
        <EmptyState
          icon={<CourtIcon size={24} />}
          title="No courts yet"
          description="Be the first to add one for your community."
          action={
            <Link href="/dashboard/courts/new" className={buttonVariants({ size: "sm" })}>
              <PlusIcon size={16} />
              Add a court
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courts.map((court) => (
            <Link key={court.id} href={`/dashboard/courts/${court.id}`}>
              <Card hover>
                <h2 className="font-display text-lg tracking-wide">{court.name}</h2>
                <p className="mt-1 text-sm text-muted">
                  {court.address || "Address not provided"}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {court.surface && <Badge>{court.surface}</Badge>}
                  {court.lighting && (
                    <Badge>
                      <LightbulbIcon size={13} />
                      Lighting
                    </Badge>
                  )}
                  {court.indoor && (
                    <Badge>
                      <BuildingIcon size={13} />
                      Indoor
                    </Badge>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

