"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Map, {
  Marker,
  NavigationControl,
  Popup,
  type MapRef,
} from "react-map-gl/mapbox";
import { Button } from "@/components/ui/button";
import { ChevronRightIcon, MapPinIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export interface MapCourt {
  id: string;
  name: string;
  address: string | null;
  latitude: number;
  longitude: number;
}

// A neutral, deterministic fallback center/zoom used only when there are no
// courts to derive a center from yet (never based on the clock, locale, or
// randomness).
const NO_COURTS_CENTER = { latitude: 20, longitude: 0, zoom: 1.2 };
const COURTS_ZOOM = 11;
const SELECTED_COURT_ZOOM = 14;
const USER_LOCATION_ZOOM = 13;

function computeInitialViewState(courts: MapCourt[]) {
  if (courts.length === 0) {
    return NO_COURTS_CENTER;
  }
  const latitude =
    courts.reduce((sum, court) => sum + court.latitude, 0) / courts.length;
  const longitude =
    courts.reduce((sum, court) => sum + court.longitude, 0) / courts.length;
  return { latitude, longitude, zoom: COURTS_ZOOM };
}

/**
 * Client-side map of the courts already visible through the existing RLS
 * `getCourts()` query. This is a first slice of "nearby court discovery":
 * it renders every court the caller can already see and lets them locate
 * themselves on the map, but it does not perform true server-side radius
 * filtering. A PostGIS `ST_DWithin`-based RPC (see `game_rsvp_counts` for
 * the pattern used elsewhere in this codebase) would be a natural follow-up
 * once the number of courts makes client-side rendering impractical.
 */
export function CourtsMap({ courts }: { courts: MapCourt[] }) {
  const initialViewState = useMemo(() => computeInitialViewState(courts), [courts]);
  const [selectedCourtId, setSelectedCourtId] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [locationStatus, setLocationStatus] = useState<
    "idle" | "loading" | "error"
  >("idle");
  const [locationError, setLocationError] = useState<string | null>(null);
  const mapRef = useRef<MapRef | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const selectedCourt = courts.find((court) => court.id === selectedCourtId) ?? null;

  const flyTo = useCallback((longitude: number, latitude: number, zoom: number) => {
    const map = mapRef.current;
    if (map) {
      map.flyTo({ center: [longitude, latitude], zoom });
    }
  }, []);

  const handleSelectCourt = useCallback(
    (court: MapCourt) => {
      setSelectedCourtId(court.id);
      flyTo(court.longitude, court.latitude, SELECTED_COURT_ZOOM);
    },
    [flyTo],
  );

  const handleUseMyLocation = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setLocationStatus("error");
      setLocationError("Geolocation isn't available in this browser.");
      return;
    }

    setLocationStatus("loading");
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (!isMountedRef.current) return;
        const next = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setUserLocation(next);
        setLocationStatus("idle");
        flyTo(next.longitude, next.latitude, USER_LOCATION_ZOOM);
      },
      (error) => {
        if (!isMountedRef.current) return;
        setLocationStatus("error");
        setLocationError(
          error.code === error.PERMISSION_DENIED
            ? "Location permission was denied. You can still browse the map manually."
            : "We couldn't determine your location. You can still browse the map manually.",
        );
      },
      { enableHighAccuracy: true, timeout: 10_000 },
    );
  }, [flyTo]);

  if (!MAPBOX_TOKEN) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border bg-surface/50 px-6 py-10 text-center">
        <MapPinIcon size={22} className="text-muted" />
        <h3 className="font-display text-base tracking-wide text-foreground">
          Map setup required
        </h3>
        <p className="max-w-sm text-sm text-muted">
          Add a <code className="rounded bg-foreground/10 px-1 py-0.5">NEXT_PUBLIC_MAPBOX_TOKEN</code>{" "}
          environment variable to enable the interactive court map. Get a free token from{" "}
          <a
            href="https://account.mapbox.com/access-tokens/"
            target="_blank"
            rel="noreferrer"
            className="text-accent underline underline-offset-2"
          >
            account.mapbox.com
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-surface">
        <div className="absolute right-3 top-3 z-10">
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={handleUseMyLocation}
            pending={locationStatus === "loading"}
            aria-label="Use my location to center the map"
          >
            <MapPinIcon size={15} />
            {locationStatus === "loading" ? "Locating…" : "Use my location"}
          </Button>
        </div>

        <Map
          ref={mapRef}
          mapboxAccessToken={MAPBOX_TOKEN}
          initialViewState={initialViewState}
          style={{ width: "100%", height: "420px" }}
          mapStyle="mapbox://styles/mapbox/streets-v12"
          aria-label="Map of nearby basketball courts"
        >
          <NavigationControl position="bottom-right" />

          {courts.map((court) => (
            <Marker
              key={court.id}
              longitude={court.longitude}
              latitude={court.latitude}
              anchor="bottom"
            >
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  handleSelectCourt(court);
                }}
                aria-label={`Show details for ${court.name}`}
                aria-pressed={selectedCourtId === court.id}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-accent text-white shadow-md transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
                  selectedCourtId === court.id && "scale-110 ring-2 ring-accent ring-offset-2",
                )}
              >
                <MapPinIcon size={16} />
              </button>
            </Marker>
          ))}

          {userLocation && (
            <Marker
              longitude={userLocation.longitude}
              latitude={userLocation.latitude}
              anchor="center"
            >
              <span
                role="img"
                aria-label="Your location"
                className="block h-3.5 w-3.5 rounded-full border-2 border-white bg-blue-500 shadow"
              />
            </Marker>
          )}

          {selectedCourt && (
            <Popup
              longitude={selectedCourt.longitude}
              latitude={selectedCourt.latitude}
              anchor="top"
              closeOnClick={false}
              onClose={() => setSelectedCourtId(null)}
            >
              <div className="min-w-[10rem] space-y-1 text-sm">
                <p className="font-display tracking-wide text-foreground">
                  {selectedCourt.name}
                </p>
                <p className="text-muted">
                  {selectedCourt.address || "Address not provided"}
                </p>
                <Link
                  href={`/dashboard/courts/${selectedCourt.id}`}
                  className="inline-flex items-center gap-1 font-medium text-accent hover:underline"
                >
                  View court
                  <ChevronRightIcon size={13} />
                </Link>
              </div>
            </Popup>
          )}
        </Map>

        {locationError && (
          <p
            role="alert"
            className="absolute bottom-3 left-3 z-10 max-w-[80%] rounded-lg bg-red-600 px-3 py-1.5 text-xs text-white shadow"
          >
            {locationError}
          </p>
        )}
      </div>

      {/* Keyboard-usable fallback: every court is reachable without the map. */}
      <nav aria-label="Court list" className="min-w-0">
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
          {courts.length} {courts.length === 1 ? "court" : "courts"}
        </h2>
        <ul className="max-h-[420px] space-y-1 overflow-y-auto rounded-2xl border border-border bg-surface p-2">
          {courts.map((court) => (
            <li key={court.id}>
              <div
                className={cn(
                  "flex items-center gap-1 rounded-lg transition-colors",
                  selectedCourtId === court.id && "bg-accent/10",
                )}
              >
                <button
                  type="button"
                  onClick={() => handleSelectCourt(court)}
                  aria-current={selectedCourtId === court.id ? "true" : undefined}
                  className="min-w-0 flex-1 rounded-lg px-3 py-2 text-left text-sm hover:bg-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                >
                  <span className="block truncate font-medium">{court.name}</span>
                  <span className="block truncate text-xs text-muted">
                    {court.address || "Address not provided"}
                  </span>
                </button>
                <Link
                  href={`/dashboard/courts/${court.id}`}
                  aria-label={`View ${court.name}`}
                  className="shrink-0 rounded-full p-2 text-muted hover:bg-foreground/5 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                >
                  <ChevronRightIcon size={16} />
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
