// Main App component - Entry point for the earthquake visualization app
import React, { useState, useMemo } from "react";
import { useEarthquakes } from "./hooks/useEarthquakes";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import MapView from "./components/MapView";
import Legend from "./components/Legend";
import TimelinePlayer from "./components/TimelinePlayer";
import ErrorBoundary from "./components/ErrorBoundary";
import type { EarthquakeFeature } from "./types";

export default function App() {
  // Fetch earthquake data from USGS API
  const { data } = useEarthquakes();

  // UI state management
  const [collapsed, setCollapsed] = useState(true); // Controls sidebar visibility
  const [selectedId, setSelectedId] = useState<string | null>(null); // Currently selected earthquake
  const [minMag, setMinMag] = useState(0); // Minimum magnitude filter
  const [maxMag, setMaxMag] = useState(10); // Maximum magnitude filter
  const [searchTerm, setSearchTerm] = useState(""); // Search filter for location names

  // Timeline player state
  const [playing, setPlaying] = useState(false); // Timeline animation play/pause
  const [speedMs, setSpeedMs] = useState(350); // Animation speed in milliseconds
  const [stepMs, setStepMs] = useState(3600000); // Time step size (1 hour in ms)
  const [timeline, setTimeline] = useState(Date.now()); // Current timeline position

  // Filter earthquakes based on magnitude, search term, and timeline position
  const filtered = useMemo(() => {
    return data.filter((f) => {
      const mag = f.properties.mag ?? 0;
      const matchMag = mag >= minMag && mag <= maxMag; // Magnitude within range
      const matchSearch = f.properties.place?.toLowerCase().includes(searchTerm.toLowerCase()); // Location matches search
      const matchTime = (f.properties.time ?? 0) <= timeline; // Earthquake occurred before current timeline
      return matchMag && matchSearch && matchTime;
    });
  }, [data, minMag, maxMag, searchTerm, timeline]);

  return (
    // Main container with dark theme and flex layout
    <div className="h-screen flex flex-col bg-gray-900 overflow-x-hidden gap-4">
      {/* Application header with search and controls */}
      <div className="h-screen"><Header
        onToggleSidebar={() => setCollapsed((c) => !c)} // Toggle sidebar visibility
        collapsed={collapsed}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      /></div>


      {/* Search + Refresh */}
      <div className="flex flex-col px-4 sm:flex-row justify-between sm:items-center gap-2 sm:gap-3 flex-shrink-0 sm:w-auto">
        <input
          type="text"
          className="search-input px-3 py-2 text-sm sm:text-base w-full sm:w-auto min-w-0"
          placeholder="Search place, e.g. 'Japan'"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="btn-primary whitespace-nowrap w-[25vw] sm:w-auto text-sm sm:text-base flex-shrink-0"
          onClick={() => window.location.reload()}
        >
          ↻ Refresh
        </button>
      </div>
      {/* Legend panel */}
      <div className="map-legend-wrapper">
        <div
          className="map-legend-wrapper"
          style={{
            width: "100%",
          }}
        >
          <Legend />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-grow relative">
        {/* Sidebar */}
        {!collapsed && (
          <div
            className="
        absolute left-0 top-0 h-full
        w-80
        bg-gray-800/90 backdrop-blur-sm
        border-r border-gray-700/50
        overflow-hidden
        transition-all duration-300 ease-in-out
        z-10
      "
          >
            <div className="w-80 p-4 h-full overflow-y-auto">
              <Sidebar
                features={filtered}
                count={filtered.length}
                minMag={minMag}
                maxMag={maxMag}
                setMinMag={setMinMag}
                setMaxMag={setMaxMag}
                onSelect={(f: EarthquakeFeature) => setSelectedId(f.id)}
                selectedId={selectedId}
                collapsed={collapsed}
                searchTerm={searchTerm}
                onCloseSidebar={() => setCollapsed(true)}
              />
            </div>
          </div>
        )}

        {/* Map + Legend wrapper */}
        <div className="flex flex-col items-center justify-center gap-4 h-full w-full p-4">
          {/* Map panel */}
          <div className="map-legend-wrapper">
            <div
              className="rounded-2xl glass overflow-hidden shadow-xl relative"
              style={{
                width: "50%",
                minWidth: "300px",
                aspectRatio: "4 / 3",
                minHeight: "400px",
              }}
            >
              <ErrorBoundary>
                <MapView
                  features={filtered}
                  selectedId={selectedId}
                  onPopupClose={() => setSelectedId(null)}
                />
              </ErrorBoundary>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline at bottom */}
      <div className="flex-shrink-0 p-4 bg-gray-800/50 backdrop-blur-sm border-t border-gray-700/50">
        <TimelinePlayer
          min={data.reduce((a, f) => Math.min(a, f.properties.time ?? a), Date.now())}
          max={Date.now()}
          value={timeline}
          onChange={setTimeline}
          playing={playing}
          setPlaying={setPlaying}
          speedMs={speedMs}
          setSpeedMs={setSpeedMs}
          stepMs={stepMs}
          setStepMs={setStepMs}
        />
      </div>
    </div>
  );
}
