// Legend component - Color-coded magnitude scale for earthquake markers
import React from "react";
import { magnitudeColor } from "../utils/format";

export default function Legend() {
    // Magnitude scale buckets for the legend
    const buckets = [0, 2, 3, 4, 5, 6];

    return (
        <div
            className="glass px-3 py-2 rounded-md text-xs"
            style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                overflowX: "auto", // Allow horizontal scrolling on small screens
                whiteSpace: "nowrap",
                WebkitOverflowScrolling: "touch", // Smooth scrolling on mobile devices
            }}
        >
            <span className="font-semibold flex-shrink-0">&nbsp;Magnitude:</span>

            {/* Render magnitude scale items */}
            {buckets.map((b) => (
                <div
                    key={b}
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.25rem",
                        flexShrink: 0, // Prevent shrinking on small screens
                    }}
                >
                    <div
                        style={{
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            backgroundColor: magnitudeColor(b),
                        }}
                    />
                    <span>{b}+</span>
                </div>
            ))}
        </div>
    );
}
