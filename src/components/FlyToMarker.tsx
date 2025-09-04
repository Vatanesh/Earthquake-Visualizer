import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import type { FtM } from "../types";


export default function FlyToMarker({ feature, onClose }: FtM) {
    const map = useMap();

    useEffect(() => {
        if (!feature) return;
        const [lon, lat, depth] = feature.geometry.coordinates;
        const mag = feature.properties.mag ?? 0;
        const place = feature.properties.place ?? feature.properties.title ?? "Event";

        map.flyTo([lat, lon], Math.max(4, Math.min(8, Math.floor(mag + 2))), { animate: true, duration: 1.0 });

        const content = `
      <div style="min-width:180px">
        <div style="font-weight:600;margin-bottom:6px">${place}</div>
        <div style="font-size:13px">Magnitude: ${mag}</div>
        <div style="font-size:12px">Depth: ${depth ?? "N/A"} km</div>
        <div style="margin-top:6px">
          <a href="${feature.properties.url ?? "#"}" target="_blank" rel="noreferrer">View on USGS</a>
        </div>
      </div>
    `;

        const popup = L.popup({ maxWidth: 320, closeButton: true }).setLatLng([lat, lon]).setContent(content).openOn(map);

        const onPopupClose = () => onClose?.();
        map.once("popupclose", onPopupClose);

        return () => {
            try {
                map.off("popupclose", onPopupClose);
                map.closePopup();
            } catch { }
        };
    }, [feature, map, onClose]);

    return null;
}
