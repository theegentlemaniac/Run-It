import Link from "next/link";
import { getCourts } from "@/features/courts/queries";
import { courtLocationToCoordinates } from "@/features/courts/coordinates";
import { CourtsMap } from "@/features/courts/courts-map";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { CourtIcon, LightbulbIcon, BuildingIcon, PlusIcon } from "@/components/ui/icons";

export default async function CourtsPage() {
  const courts = await getCourts();

  // Only pass the public fields the map needs to the client component, with
  // `location` normalized to plain numbers (never forward the raw PostGIS
  // value or anything server-only).
  const mapCourts = courts.flatMap((court) => {
    const coordinates = courtLocationToCoordinates(court.location);
    if (!coordinates) {
      return [];
    }
    return [
      {
        id: court.id,
        name: court.name,
        address: court.address,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      },
    ];
  });

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
        <>
          {mapCourts.length > 0 && <CourtsMap courts={mapCourts} />}

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
        </>
      )}
    </div>
  );
}
