import { useCallback, useEffect, useState } from "react";
import { EarthquakeFeature } from "../types";

export function useEarthquakes() {
    const [data, setData] = useState<EarthquakeFeature[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async (): Promise<void> => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(
                "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
            );
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();
            setData(json.features);
        } catch (err: any) {
            setError(err.message || "Unknown error");
            throw err; // throw error so caller knows
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData().catch(() => { }); // ignore for mount
    }, [fetchData]);

    return { data, loading, error, refresh: fetchData };
}
