import React from "react";
import type { EarthquakeFeature, Props } from "../types";
import { magnitudeColor } from "../utils/format";
import { motion, AnimatePresence } from "framer-motion";

// Function to brighten a color by a percentage
function brightenColor(color: string, percent: number) {
    const ctx = document.createElement("canvas").getContext("2d");
    if (!ctx) return color;
    ctx.fillStyle = color;
    const computed = ctx.fillStyle;
    if (!computed.startsWith("rgb")) return color;
    const rgb = computed.match(/\d+/g)?.map(Number) || [0, 0, 0];
    const r = Math.min(255, Math.floor(rgb[0] * (1 + percent)));
    const g = Math.min(255, Math.floor(rgb[1] * (1 + percent)));
    const b = Math.min(255, Math.floor(rgb[2] * (1 + percent)));
    return `rgb(${r},${g},${b})`;
}

export default function Sidebar({
    features,
    count,
    minMag,
    maxMag,
    setMinMag,
    setMaxMag,
    onSelect,
    selectedId,
    onCloseSidebar,
}: Props) {
    return (
        <div className="flex flex-col h-full p-4 bg-black/60 backdrop-blur-lg shadow-xl">
            {/* Filter section */}
            <div className="p-3 bg-[rgba(255,255,255,0.05)] rounded-lg shadow mb-4">
                <div className="text-xs font-semibold mb-2 text-gray-300 uppercase tracking-wide">
                    Magnitude Range
                </div>
                <div className="flex items-center space-x-2">
                    <input
                        type="number"
                        min={0}
                        max={10}
                        value={minMag}
                        onChange={(e) => setMinMag(Number(e.target.value))}
                        className="w-14 p-1 text-sm bg-black/40 border border-gray-700 rounded text-center text-white"
                    />
                    <span className="text-white">–</span>
                    <input
                        type="number"
                        min={0}
                        max={10}
                        value={maxMag}
                        onChange={(e) => setMaxMag(Number(e.target.value))}
                        className="w-14 p-1 text-sm bg-black/40 border border-gray-700 rounded text-center text-white"
                    />

                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="p-2 rounded bg-blue-500/20 text-center">
                    <div className="text-[10px] uppercase text-gray-300">Total</div>
                    <div className="font-bold">{count}</div>
                </div>
                <div className="p-2 rounded bg-green-500/20 text-center">
                    <div className="text-[10px] uppercase text-gray-300">Filtered</div>
                    <div className="font-bold">{features.length}</div>
                </div>
            </div>

            {/* Event list with animated cards */}
            <div className="flex-1 overflow-y-auto space-y-3 custom-scroll">
                {features.length === 0 && (
                    <div className="text-sm text-gray-400 italic">
                        No events match filters
                    </div>
                )}
                <AnimatePresence>
                    {features.map((f) => {
                        const mag = f.properties.mag ?? 0;
                        const place = f.properties.place ?? "Unknown";
                        const time = new Date(f.properties.time ?? 0).toLocaleString();
                        const baseColor = magnitudeColor(mag);
                        const hoverColor = brightenColor(baseColor, 0.25 + mag * 0.05); // stronger magnitudes brighten more

                        return (
                            <motion.button
                                key={f.id}
                                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                onClick={() => {
                                    onSelect(f);
                                    onCloseSidebar?.();
                                }}
                                className="w-full text-left px-3 py-2 rounded-lg text-white transform transition-all duration-200 border"
                                style={{ background: baseColor }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = hoverColor;
                                    e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.6)";
                                    e.currentTarget.style.transform = "scale(1.04)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = baseColor;
                                    e.currentTarget.style.boxShadow = "none";
                                    e.currentTarget.style.transform = "scale(1)";
                                }}
                            >
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-bold">M{mag.toFixed(1)}, </span>
                                    <span className="ml-3 text-[11px] text-gray-100">{time}</span>
                                </div>
                                <div className="text-xs text-gray-50">{place}</div>
                            </motion.button>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
}
