import React from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import type { EmProps } from "../types";
import { magnitudeColor} from "../utils/format";

export type AnimState = "entering" | "visible" | "exiting";
export default function EarthquakeMarker({ feature, animState = "visible" }: EmProps) {
    const [lon, lat, depth] = feature.geometry.coordinates;
    const mag = feature.properties.mag ?? 0;
    const place = feature.properties.place ?? feature.properties.title ?? "Event";

    // anim state controls CSS inline properties
    const opacity = animState === "visible" ? 0.95 : animState === "entering" ? 0.0 : 0.0;
    const scale = animState === "visible" ? 1.0 : animState === "entering" ? 0.6 : 0.5;
    const transition = "transform 450ms cubic-bezier(.22,.9,.38,1), opacity 350ms ease";

    const size = Math.max(8, 8 + mag * 3);
    const html = `
    <div class="marker-inner" style="
      width:${size}px;height:${size}px;border-radius:50%;
      background:${magnitudeColor(mag)};opacity:${opacity};
      transform:scale(${scale});transition:${transition};
      display:flex;align-items:center;justify-content:center;
    "></div>
  `;

    const icon = L.divIcon({
        className: "",
        html,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
    });

    return (
        <Marker key={feature.id} position={[lat, lon]} icon={icon}>
            <Popup>
                <div style={{ minWidth: 180 }}>
                    <div style={{ fontWeight: 600, marginBottom: 6 }}>{place}</div>
                    <div style={{ fontSize: 13 }}>Magnitude: {mag}</div>
                    <div style={{ fontSize: 12 }}>Depth: {depth ?? "N/A"} km</div>
                    {feature.properties.time && <div style={{ marginTop: 6, fontSize: 12 }}>{new Date(feature.properties.time).toLocaleString()}</div>}
                    <div style={{ marginTop: 8 }}>
                        <a href={feature.properties.url ?? "#"} target="_blank" rel="noreferrer" style={{ color: "#8ac6ff" }}>View on USGS</a>
                    </div>
                </div>
            </Popup>
        </Marker>
    );
}
