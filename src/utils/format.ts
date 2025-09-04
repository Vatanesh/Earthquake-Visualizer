import dayjs from "dayjs";

export const formatTime = (ms?: number | null) => (ms ? dayjs(ms).format("MMM D, YYYY HH:mm:ss") : "Unknown");

export const magnitudeColor = (mag: number | null) => {
    if (mag == null) return "#9ca3af";
    if (mag >= 6) return "#7f1d1d";
    if (mag >= 5) return "#dc2626";
    if (mag >= 4) return "#f97316";
    if (mag >= 3) return "#f59e0b";
    if (mag >= 2) return "#eab308";
    return "#84cc16";
};

export const magnitudeRadius = (mag: number | null) => {
    if (mag == null) return 4;
    return Math.max(4, Math.pow(mag, 2) * 1.6);
};
