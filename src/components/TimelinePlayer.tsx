import React, { useEffect, useRef } from "react";

type Props = {
    min: number;
    max: number;
    value: number;
    onChange: (t: number) => void;
    playing: boolean;
    setPlaying: (b: boolean) => void;
    speedMs: number;
    setSpeedMs: (n: number) => void;
    stepMs: number;
    setStepMs: (n: number) => void;
};

export default function TimelinePlayer({
    min,
    max,
    value,
    onChange,
    playing,
    setPlaying,
    speedMs,
    setSpeedMs,
    stepMs,
    setStepMs,
}: Props) {
    const ref = useRef<number>(value);
    ref.current = value;

    useEffect(() => {
        if (!playing) return;
        const id = setInterval(() => {
            const next = Math.min(ref.current + stepMs, max);
            onChange(next);
            if (next >= max) setPlaying(false);
        }, speedMs);
        return () => clearInterval(id);
    }, [playing, speedMs, stepMs, max, onChange, setPlaying]);

    const percent =
        max === min ? 0 : Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));

    const getBtnClass = (isSelected: boolean) =>
        `btn transition-all duration-200 rounded-md px-3 py-1 ${isSelected ? "btn-primary" : "btn-ghost hover:bg-gray-700/50"
        }`;

    return (
        <div className="timeline-card w-full max-w-4xl mx-auto p-3 flex flex-col gap-4">
            {/* Controls + timeline */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full">
                {/* Rewind / Play / End */}
                <div className="flex flex-row items-center gap-2 sm:gap-3 flex-shrink-0">
                    <button className="btn-ghost whitespace-nowrap" onClick={() => onChange(min)}>
                        ⟲ Rewind
                    </button>
                    <button className="btn-primary whitespace-nowrap" onClick={() => setPlaying(!playing)}>
                        {playing ? "Pause" : "Play"}
                    </button>
                    <button className="btn-ghost whitespace-nowrap" onClick={() => onChange(max)}>
                        ⟳ End
                    </button>
                </div>

                {/* Timeline */}
                <div className="flex-1 w-full">
                    <div className="timeline-track h-3 sm:h-4 rounded-full overflow-hidden">
                        <div
                            className="timeline-progress h-full"
                            style={{ width: `${percent}%` }}
                        />
                    </div>
                    <input
                        type="range"
                        min={min}
                        max={max}
                        step={stepMs}
                        value={value}
                        onChange={(e) => onChange(Number(e.target.value))}
                        className="w-full mt-2 h-3 sm:h-4 accent-accent"
                    />
                </div>

                {/* Current time */}
                <div className="flex-shrink-0 w-[180px] sm:w-[220px] text-right text-white">
                    <div className="font-semibold text-sm sm:text-base">
                        {new Date(value).toLocaleString()}
                    </div>
                    <div className="text-xs text-white/65">
                        Step: {stepMs >= 86400000 ? `${stepMs / 86400000}d` : `${stepMs / 3600000}h`}
                    </div>
                </div>
            </div>

            {/* Speed / Step controls */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
                {/* Speed */}
                <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                    <span className="text-xs text-white/65">Speed:</span>
                    <div className="flex gap-2 sm:gap-3">
                        <button className={getBtnClass(speedMs === 700)} onClick={() => setSpeedMs(700)}>
                            Slow
                        </button>
                        <button className={getBtnClass(speedMs === 350)} onClick={() => setSpeedMs(350)}>
                            Med
                        </button>
                        <button className={getBtnClass(speedMs === 150)} onClick={() => setSpeedMs(150)}>
                            Fast
                        </button>
                    </div>
                </div>

                {/* Step */}
                <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                    <span className="text-xs text-white/65">Step:</span>
                    <div className="flex gap-2 sm:gap-3">
                        <button className={getBtnClass(stepMs === 3600000)} onClick={() => setStepMs(3600000)}>
                            1h
                        </button>
                        <button className={getBtnClass(stepMs === 86400000)} onClick={() => setStepMs(86400000)}>
                            1d
                        </button>
                        <button className={getBtnClass(stepMs === 604800000)} onClick={() => setStepMs(604800000)}>
                            1w
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
