// Custom hook for fetching earthquake data from USGS API
import { useCallback, useEffect, useState } from "react";
import { EarthquakeFeature } from "../types";

export function useEarthquakes() {
    // State management for earthquake data
    const [data, setData] = useState<EarthquakeFeature[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch earthquake data from USGS GeoJSON API
    const fetchData = useCallback(async (): Promise<void> => {
        setLoading(true);
        setError(null);
        try {
            // Fetch all earthquakes from the past day
            const res = await fetch(
                "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
            );
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();
            setData(json.features); // Extract features array from GeoJSON
        } catch (err: any) {
            setError(err.message || "Unknown error");
            throw err; // Re-throw error so caller can handle it
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch data on component mount
    useEffect(() => {
        fetchData().catch(() => { }); // Ignore errors during initial mount
    }, [fetchData]);

    return { data, loading, error, refresh: fetchData };
}
