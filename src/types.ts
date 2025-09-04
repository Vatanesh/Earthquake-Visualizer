import { AnimState } from "./components/EarthquakeMarker";

export type EarthquakeFeature = {
    type: "Feature";
    properties: {
        mag: number | null;
        place: string | null;
        time: number | null;
        url?: string;
        title?: string;
    };
    geometry: {
        type: "Point";
        coordinates: [number, number, number];
    };
    id: string;
};

export type EarthquakeGeoJSON = {
    type: "FeatureCollection";
    features: EarthquakeFeature[];
};

export type Props = {
    features: EarthquakeFeature[];
    count: number;
    minMag: number;
    maxMag: number;
    setMinMag: (n: number) => void;
    setMaxMag: (n: number) => void;
    onSelect: (f: EarthquakeFeature) => void;
    selectedId?: string | null;
    collapsed?: boolean;
    searchTerm: string;
    onCloseSidebar?: () => void;
};

export type EmProps = {
    feature: EarthquakeFeature;
    animState?: AnimState;
};

export type FtM = {
    feature?: EarthquakeFeature | null;
    onClose?: () => void;
};

export type HProps = {
    onToggleSidebar: () => void;
    collapsed: boolean;
    searchTerm: string;
    setSearchTerm: (s: string) => void;
};

export type MapProps = {
    features: EarthquakeFeature[]; // time-filtered features (mapData)
    selectedId?: string | null;
    onPopupClose?: () => void;
};