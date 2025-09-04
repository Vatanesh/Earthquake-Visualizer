import React, { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, ZoomControl, useMap } from "react-leaflet";
import type { EarthquakeFeature, MapProps } from "../types";
import EarthquakeMarker, { AnimState } from "./EarthquakeMarker";
import FlyToMarker from "./FlyToMarker";
import "leaflet/dist/leaflet.css";
import L, { Map as LeafletMap } from "leaflet";


const ENTER_MS = 120;
const EXIT_MS = 420;

function MapSetter({ mapRef }: { mapRef: React.MutableRefObject<LeafletMap | null> }) {
    const map = useMap();
    useEffect(() => {
        mapRef.current = map;
        return () => { mapRef.current = null; };
    }, [map, mapRef]);
    return null;
}

export default function MapView({ features, selectedId, onPopupClose }: MapProps) {
    const mapRef = useRef<LeafletMap | null>(null);

    const center = useMemo<[number, number]>(() => {
        if (features.length === 0) return [20, 0];
        const f = features[0];
        return [f.geometry.coordinates[1], f.geometry.coordinates[0]];
    }, [features]);

    const [visibleMap, setVisibleMap] = useState<Map<string, { feature: EarthquakeFeature; state: AnimState }>>(
        () => new Map()
    );

    // Diff incoming features -> manage enter/exit states
    useEffect(() => {
        const nextIds = new Set(features.map((f) => f.id));
        setVisibleMap((prev) => {
            const next = new Map(prev);

            // add/refresh incoming features
            for (const f of features) {
                if (!next.has(f.id)) {
                    next.set(f.id, { feature: f, state: "entering" });
                    // schedule visible
                    setTimeout(() => {
                        setVisibleMap((cur) => {
                            const m = new Map(cur);
                            const v = m.get(f.id);
                            if (v) m.set(f.id, { feature: v.feature, state: "visible" });
                            return m;
                        });
                    }, ENTER_MS);
                } else {
                    const existing = next.get(f.id)!;
                    next.set(f.id, { feature: f, state: existing.state });
                }
            }

            // mark previously visible but missing as exiting
            for (const [id, val] of prev.entries()) {
                if (!nextIds.has(id)) {
                    const cur = next.get(id);
                    if (!cur || cur.state !== "exiting") next.set(id, { feature: val.feature, state: "exiting" });
                }
            }

            return next;
        });

        // cleanup removal of exiting after EXIT_MS
        const toRemove: string[] = [];
        visibleMap.forEach((v, id) => {
            if (!nextIds.has(id)) toRemove.push(id);
        });
        if (toRemove.length) {
            const timer = setTimeout(() => {
                setVisibleMap((cur) => {
                    const m = new Map(cur);
                    for (const id of toRemove) {
                        const e = m.get(id);
                        if (e && e.state === "exiting") m.delete(id);
                    }
                    return m;
                });
            }, EXIT_MS + 20);
            return () => clearTimeout(timer);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [features]);

    // safety: if features shrink, ensure exiting state set
    useEffect(() => {
        setVisibleMap((prev) => {
            const next = new Map(prev);
            for (const [id, val] of prev.entries()) {
                if (!features.find((f) => f.id === id) && val.state !== "exiting") {
                    next.set(id, { feature: val.feature, state: "exiting" });
                }
            }
            return next;
        });
    }, [features]);

    const selectedFeature = features.find((f) => f.id === selectedId);

    const bounds: L.LatLngBoundsExpression = [
        [-85, -180],
        [85, 180],
    ];

    return (
        <div className="fill-absolute">
            <MapContainer
                center={center}
                zoom={1}
                scrollWheelZoom={true}
                zoomControl={false}
                dragging={true}
                touchZoom={true}
                doubleClickZoom={true}
                keyboard={true}
                style={{ width: "100%", height: "100%" }}
                maxBounds={bounds}
                maxBoundsViscosity={1.0}
                worldCopyJump={true}
                minZoom={1}
            >
                <MapSetter mapRef={mapRef} />
                <ZoomControl position="topright" />
                <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {Array.from(visibleMap.values()).map((v) => (
                    <EarthquakeMarker key={v.feature.id} feature={v.feature} animState={v.state} />
                ))}

                {selectedFeature && <FlyToMarker feature={selectedFeature} onClose={onPopupClose} />}
            </MapContainer>
        </div>
    );
}
