import React from "react";
import { magnitudeColor } from "../utils/format";

export default function Legend() {
    const buckets = [0, 2, 3, 4, 5, 6];

    return (
        <div
            className="glass px-3 py-2 rounded-md text-xs"
            style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                overflowX: "auto",
                whiteSpace: "nowrap",
                WebkitOverflowScrolling: "touch", // smooth scrolling on mobile
            }}
        >
            <span className="font-semibold flex-shrink-0">&nbsp;Magnitude:</span>

            {buckets.map((b) => (
                <div
                    key={b}
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.25rem",
                        flexShrink: 0,
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
