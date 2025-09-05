// Header component - Top navigation bar with sidebar toggle and title
import React from "react";
import type { HProps } from "../types";

export default function Header({
    onToggleSidebar,
    collapsed,
}: HProps) {
    return (
        // Main header with glassmorphism styling and responsive grid layout
        <header className="glass w-full max-w-screen mx-auto px-4 py-3 overflow-hidden 
                   grid grid-cols-1 sm:grid-cols-[auto_1fr_auto] gap-3 sm:gap-4 items-center">

            {/* Left section: Sidebar toggle button */}
            <div className="flex-shrink-0">
                <button
                    className="btn-primary whitespace-nowrap text-sm sm:text-base"
                    onClick={onToggleSidebar}
                    aria-label="Toggle sidebar"
                >
                    {/* Dynamic icon based on sidebar state */}
                    {collapsed ? "☰ Filter Events" : "✕"}
                </button>
            </div>

            {/* Center section: Application title */}
            <div className="flex justify-center min-w-0 px-2">
                <h1 className="text-white text-lg sm:text-2xl font-bold truncate text-center">
                    Earthquake Visualizer
                </h1>
            </div>
        </header>
    );
}
