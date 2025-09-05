// Utility functions for formatting earthquake data and visual properties
import dayjs from "dayjs";

// Format timestamp to human-readable date and time
export const formatTime = (ms?: number | null) => (ms ? dayjs(ms).format("MMM D, YYYY HH:mm:ss") : "Unknown");

// Return color based on earthquake magnitude (darker = more severe)
export const magnitudeColor = (mag: number | null) => {
    if (mag == null) return "#9ca3af"; // Gray for unknown magnitude
    if (mag >= 6) return "#7f1d1d";     // Dark red for major earthquakes (6.0+)
    if (mag >= 5) return "#dc2626";     // Red for strong earthquakes (5.0-5.9)
    if (mag >= 4) return "#f97316";     // Orange for moderate earthquakes (4.0-4.9)
    if (mag >= 3) return "#f59e0b";     // Amber for light earthquakes (3.0-3.9)
    if (mag >= 2) return "#eab308";     // Yellow for minor earthquakes (2.0-2.9)
    return "#84cc16";                   // Green for micro earthquakes (<2.0)
};

// Calculate marker radius based on magnitude (larger = higher magnitude)
export const magnitudeRadius = (mag: number | null) => {
    if (mag == null) return 4; // Default size for unknown magnitude
    return Math.max(4, Math.pow(mag, 2) * 1.6); // Exponential scaling for visual impact
};
