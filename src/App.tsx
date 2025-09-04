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
  const { data, loading, error, refresh } = useEarthquakes();
  const [collapsed, setCollapsed] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [minMag, setMinMag] = useState(0);
  const [maxMag, setMaxMag] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [playing, setPlaying] = useState(false);
  const [speedMs, setSpeedMs] = useState(400);
  const [stepMs, setStepMs] = useState(3600000);
  const [timeline, setTimeline] = useState(Date.now());

  // filter earthquakes
  const filtered = useMemo(() => {
    return data.filter((f) => {
      const mag = f.properties.mag ?? 0;
      const matchMag = mag >= minMag && mag <= maxMag;
      const matchSearch = f.properties.place?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchTime = (f.properties.time ?? 0) <= timeline;
      return matchMag && matchSearch && matchTime;
    });
  }, [data, minMag, maxMag, searchTerm, timeline]);

  return (
    <div className="h-screen flex flex-col bg-gray-900 overflow-x-hidden gap-4">
      {/* Header */}
      <div className="h-screen"><Header
        onToggleSidebar={() => setCollapsed((c) => !c)}
        collapsed={collapsed}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      /></div>
      
      
        {/* Search + Refresh */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2 sm:gap-3 flex-shrink-0 w-full sm:w-auto">
          <input
            type="text"
            className="search-input px-3 py-2 text-sm sm:text-base w-full sm:w-auto min-w-0"
            placeholder="Search place, e.g. 'Japan'"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className="btn-primary whitespace-nowrap text-sm sm:text-base flex-shrink-0"
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
 