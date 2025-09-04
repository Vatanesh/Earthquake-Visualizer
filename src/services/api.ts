import type { EarthquakeGeoJSON } from "../types";

const USGS_ALL_DAY = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

let _cache: EarthquakeGeoJSON | null = null;
let _cacheTs = 0;
const CACHE_TTL = 1000 * 60 * 2; // 2 minutes

export async function fetchEarthquakes(signal?: AbortSignal): Promise<EarthquakeGeoJSON> {
    const now = Date.now();
    if (_cache && now - _cacheTs < CACHE_TTL) return _cache;
    const res = await fetch(USGS_ALL_DAY, { signal });
    if (!res.ok) throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
    const json = (await res.json()) as EarthquakeGeoJSON;
    _cache = json;
    _cacheTs = Date.now();
    return json;
}
