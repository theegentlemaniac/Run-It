/**
 * Pure helpers for safely normalizing `public.courts.location`
 * (a PostGIS `geography(Point, 4326)` column) into a plain
 * `{ latitude, longitude }` pair.
 *
 * Supabase/PostgREST can represent this column differently depending on how
 * it was selected:
 *   - GeoJSON, e.g. `{ "type": "Point", "coordinates": [lng, lat] }`
 *     (when selected via `st_asgeojson(location)` or similar)
 *   - WKT/EWKT text, e.g. `"POINT(28.0473 -26.2041)"` or
 *     `"SRID=4326;POINT(28.0473 -26.2041)"`
 *   - Hex-encoded WKB text, e.g.
 *     `"0101000020E6100000CE1951DA1B0C3C40151DC9E53F343AC0"`
 *     (the default `select *` representation for a `geography` column)
 *
 * These helpers never throw: unsupported or malformed input safely resolves
 * to `null` so a single bad row never breaks rendering a list of courts.
 */

export interface Coordinates {
  latitude: number;
  longitude: number;
}

function isValidLatLng(latitude: number, longitude: number): boolean {
  return (
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
}

function fromLngLat(longitude: unknown, latitude: unknown): Coordinates | null {
  const lng = Number(longitude);
  const lat = Number(latitude);
  return isValidLatLng(lat, lng) ? { latitude: lat, longitude: lng } : null;
}

function parseGeoJsonPoint(value: object): Coordinates | null {
  if (!("type" in value) || (value as { type?: unknown }).type !== "Point") {
    return null;
  }
  if (!("coordinates" in value)) {
    return null;
  }
  const coordinates = (value as { coordinates?: unknown }).coordinates;
  if (
    !Array.isArray(coordinates) ||
    coordinates.length < 2 ||
    typeof coordinates[0] !== "number" ||
    typeof coordinates[1] !== "number"
  ) {
    return null;
  }
  return fromLngLat(coordinates[0], coordinates[1]);
}

// WKT longitude/latitude order is X Y, i.e. "POINT(longitude latitude)".
const WKT_POINT_PATTERN =
  /point\s*\(\s*(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s*\)/i;

function parseWktOrEwktPoint(value: string): Coordinates | null {
  const match = WKT_POINT_PATTERN.exec(value);
  if (!match) {
    return null;
  }
  return fromLngLat(match[1], match[2]);
}

const HEX_PATTERN = /^[0-9a-fA-F]+$/;
// 1 byte byte-order + 4 bytes geometry type + 16 bytes X/Y = 21 bytes minimum.
const MIN_WKB_POINT_HEX_LENGTH = 21 * 2;

/**
 * Parses a hex-encoded WKB/EWKB `Point` geometry, the string form
 * PostgREST/postgres return by default for an unqualified `geography`
 * select. Only 2D points (with or without an SRID flag) are supported;
 * anything else safely returns null.
 */
function parseWkbHexPoint(value: string): Coordinates | null {
  if (
    value.length < MIN_WKB_POINT_HEX_LENGTH ||
    value.length % 2 !== 0 ||
    !HEX_PATTERN.test(value)
  ) {
    return null;
  }

  const byteCount = value.length / 2;
  const bytes = new Uint8Array(byteCount);
  for (let i = 0; i < byteCount; i++) {
    bytes[i] = parseInt(value.slice(i * 2, i * 2 + 2), 16);
  }

  const view = new DataView(bytes.buffer);
  const byteOrder = view.getUint8(0);
  if (byteOrder !== 0 && byteOrder !== 1) {
    return null;
  }
  const littleEndian = byteOrder === 1;
  let offset = 1;

  const geometryType = view.getUint32(offset, littleEndian);
  offset += 4;

  // The high bits encode SRID/Z/M flags (EWKB); the low byte is the base
  // geometry type. 1 = Point.
  const hasSrid = (geometryType & 0x20000000) !== 0;
  const baseType = geometryType & 0xff;
  if (baseType !== 1) {
    return null;
  }

  if (hasSrid) {
    offset += 4;
  }

  if (offset + 16 > bytes.length) {
    return null;
  }

  const x = view.getFloat64(offset, littleEndian);
  const y = view.getFloat64(offset + 8, littleEndian);

  return fromLngLat(x, y);
}

/**
 * Safely normalizes a `courts.location` value into `{ latitude, longitude }`,
 * returning `null` for missing, unsupported, or invalid input.
 */
export function courtLocationToCoordinates(value: unknown): Coordinates | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === "object") {
    return parseGeoJsonPoint(value);
  }

  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  if (trimmed === "") {
    return null;
  }

  if (/point\s*\(/i.test(trimmed)) {
    return parseWktOrEwktPoint(trimmed);
  }

  return parseWkbHexPoint(trimmed);
}
