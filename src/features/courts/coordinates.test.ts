import { describe, expect, it } from "vitest";
import { courtLocationToCoordinates } from "@/features/courts/coordinates";

// Real PostGIS output for SRID=4326;POINT(28.0473 -26.2041), verified via
// `select '...'::geography` / `st_asgeojson` / `st_astext` against
// postgis/postgis:16-3.4.
const JOHANNESBURG = { latitude: -26.2041, longitude: 28.0473 };
const WKB_HEX = "0101000020E6100000CE1951DA1B0C3C40151DC9E53F343AC0";
const GEOJSON = { type: "Point", coordinates: [28.0473, -26.2041] };
const EWKT = "SRID=4326;POINT(28.0473 -26.2041)";
const WKT = "POINT(28.0473 -26.2041)";

describe("courtLocationToCoordinates", () => {
  it("parses hex-encoded WKB/EWKB points (default PostgREST representation)", () => {
    expect(courtLocationToCoordinates(WKB_HEX)).toEqual(JOHANNESBURG);
  });

  it("parses GeoJSON Point objects", () => {
    expect(courtLocationToCoordinates(GEOJSON)).toEqual(JOHANNESBURG);
  });

  it("parses EWKT strings", () => {
    expect(courtLocationToCoordinates(EWKT)).toEqual(JOHANNESBURG);
  });

  it("parses plain WKT strings", () => {
    expect(courtLocationToCoordinates(WKT)).toEqual(JOHANNESBURG);
  });

  it("is case-insensitive and tolerant of extra whitespace in WKT", () => {
    expect(courtLocationToCoordinates("point ( 28.0473  -26.2041 )")).toEqual(
      JOHANNESBURG,
    );
  });

  it("returns null for null/undefined", () => {
    expect(courtLocationToCoordinates(null)).toBeNull();
    expect(courtLocationToCoordinates(undefined)).toBeNull();
  });

  it("returns null for an empty string", () => {
    expect(courtLocationToCoordinates("")).toBeNull();
    expect(courtLocationToCoordinates("   ")).toBeNull();
  });

  it("returns null for malformed WKT", () => {
    expect(courtLocationToCoordinates("POINT(not a number)")).toBeNull();
  });

  it("returns null for out-of-range coordinates", () => {
    expect(courtLocationToCoordinates("POINT(200 -26.2041)")).toBeNull();
    expect(courtLocationToCoordinates("POINT(28.0473 -95)")).toBeNull();
  });

  it("returns null for a GeoJSON object with the wrong type", () => {
    expect(
      courtLocationToCoordinates({ type: "LineString", coordinates: [[0, 0], [1, 1]] }),
    ).toBeNull();
  });

  it("returns null for a GeoJSON object with malformed coordinates", () => {
    expect(courtLocationToCoordinates({ type: "Point", coordinates: [28.0473] })).toBeNull();
    expect(
      courtLocationToCoordinates({ type: "Point", coordinates: ["a", "b"] }),
    ).toBeNull();
  });

  it("returns null for non-hex, non-WKT strings", () => {
    expect(courtLocationToCoordinates("not a location")).toBeNull();
  });

  it("returns null for odd-length or invalid hex strings", () => {
    expect(courtLocationToCoordinates("0101000020E610000")).toBeNull();
    expect(courtLocationToCoordinates("zz01000020E6100000CE1951DA1B0C3C40151DC9E53F343AC0")).toBeNull();
  });

  it("returns null for hex WKB that isn't a Point geometry", () => {
    // Geometry type 2 = LineString (with SRID flag set), same header shape
    // as a Point but a different base type.
    expect(
      courtLocationToCoordinates("0102000020E6100000CE1951DA1B0C3C40151DC9E53F343AC0"),
    ).toBeNull();
  });

  it("returns null for other unsupported value types", () => {
    expect(courtLocationToCoordinates(42)).toBeNull();
    expect(courtLocationToCoordinates(true)).toBeNull();
  });
});
