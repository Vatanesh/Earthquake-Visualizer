// TypeScript type definitions for the earthquake visualization app
import { AnimState } from "./components/EarthquakeMarker";

// GeoJSON Feature representing a single earthquake
export type EarthquakeFeature = {
    type: "Feature";
    properties: {
        mag: number | null;        // Earthquake magnitude
        place: string | null;      // Location description
        time: number | null;       // Timestamp in milliseconds
        url?: string;              // USGS detail page URL
        title?: string;            // Alternative title/description
    };
    geometry: {
        type: "Point";
        coordinates: [number, number, number]; // [longitude, latitude, depth]
    };
    id: string; // Unique identifier
};

// GeoJSON FeatureCollection containing multiple earthquakes
export type EarthquakeGeoJSON = {
    type: "FeatureCollection";
    features: EarthquakeFeature[];
};

// Props for the Sidebar component
export type Props = {
    features: EarthquakeFeature[];     // Filtered earthquake data
    count: number;                     // Total earthquake count
    minMag: number;                    // Minimum magnitude filter
    maxMag: number;                    // Maximum magnitude filter
    setMinMag: (n: number) => void;    // Update minimum magnitude
    setMaxMag: (n: number) => void;    // Update maximum magnitude
    onSelect: (f: EarthquakeFeature) => void; // Earthquake selection callback
    selectedId?: string | null;        // Currently selected earthquake ID
    collapsed?: boolean;               // Sidebar visibility state
    searchTerm: string;                // Location search term
    onCloseSidebar?: () => void;       // Close sidebar callback
};

// Props for the EarthquakeMarker component
export type EmProps = {
    feature: EarthquakeFeature;        // Earthquake data
    animState?: AnimState;             // Animation state for transitions
};

// Props for the FlyToMarker component
export type FtM = {
    feature?: EarthquakeFeature | null; // Target earthquake to fly to
    onClose?: () => void;               // Popup close callback
};

// Props for the Header component
export type HProps = {
    onToggleSidebar: () => void;       // Toggle sidebar visibility
    collapsed: boolean;                // Current sidebar state
    searchTerm: string;
    setSearchTerm: (s: string) => void;
};

export type MapProps = {
    features: EarthquakeFeature[]; // time-filtered features (mapData)
    selectedId?: string | null;
    onPopupClose?: () => void;
};