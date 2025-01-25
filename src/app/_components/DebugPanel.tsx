import React from "react";
import { isDevEnvironment } from "../_util/isDevEnvironment";

interface DebugPanelProps {
  time: number;
  setTime: (time: number) => void;
}

function DebugPanel({ time, setTime }: DebugPanelProps) {
  if (!isDevEnvironment()) return null;

  const addTime = (seconds: number) => {
    setTime(time + seconds);
  };

  const subtractTime = (seconds: number) => {
    setTime(Math.max(0, time - seconds));
  };

  return (
    <div className="fixed bottom-4 right-4 rounded-lg bg-gray-800 p-4 text-white shadow-lg">
      <h3 className="mb-2 text-sm font-semibold">Debug Panel</h3>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <button
            onClick={() => subtractTime(60)}
            className="rounded bg-red-500 px-2 py-1 text-xs hover:bg-red-600"
          >
            -1m
          </button>
          <button
            onClick={() => subtractTime(30)}
            className="rounded bg-red-500 px-2 py-1 text-xs hover:bg-red-600"
          >
            -30s
          </button>
          <button
            onClick={() => addTime(30)}
            className="rounded bg-green-500 px-2 py-1 text-xs hover:bg-green-600"
          >
            +30s
          </button>
          <button
            onClick={() => addTime(60)}
            className="rounded bg-green-500 px-2 py-1 text-xs hover:bg-green-600"
          >
            +1m
          </button>
        </div>
        <button
          onClick={() => setTime(5)}
          className="rounded bg-yellow-500 px-2 py-1 text-xs hover:bg-yellow-600"
        >
          Set to 5s
        </button>
      </div>
    </div>
  );
}

export default DebugPanel;
