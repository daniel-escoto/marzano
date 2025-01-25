import React, { useState } from "react";
import { isDevEnvironment } from "../_util/isDevEnvironment";

interface DebugPanelProps {
  time: number;
  setTime: (time: number) => void;
  completedPomodoros: number;
  setCompletedPomodoros: (count: number) => void;
}

function DebugPanel({
  time,
  setTime,
  completedPomodoros,
  setCompletedPomodoros,
}: DebugPanelProps) {
  const [isMinimized, setIsMinimized] = useState(false);

  if (!isDevEnvironment()) return null;

  const addTime = (seconds: number) => {
    setTime(time + seconds);
  };

  const subtractTime = (seconds: number) => {
    setTime(Math.max(0, time - seconds));
  };

  const adjustTomatoes = (adjustment: number) => {
    setCompletedPomodoros(Math.max(0, completedPomodoros + adjustment));
  };

  return (
    <div className="fixed bottom-4 right-4 rounded-lg bg-gray-800 p-4 text-white shadow-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Debug Panel</h3>
        <button
          onClick={() => setIsMinimized(!isMinimized)}
          className="ml-4 text-xs text-gray-400 hover:text-white"
          aria-label={
            isMinimized ? "Expand debug panel" : "Minimize debug panel"
          }
        >
          {isMinimized ? "+" : "-"}
        </button>
      </div>
      {!isMinimized && (
        <div className="mt-4 flex flex-col gap-4">
          <div>
            <h4 className="mb-1 text-xs text-gray-400">Timer Controls</h4>
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
              className="mt-2 rounded bg-yellow-500 px-2 py-1 text-xs hover:bg-yellow-600"
            >
              Set to 5s
            </button>
          </div>
          <div>
            <h4 className="mb-1 text-xs text-gray-400">Tomato Controls</h4>
            <div className="flex gap-2">
              <button
                onClick={() => adjustTomatoes(-1)}
                className="rounded bg-red-500 px-2 py-1 text-xs hover:bg-red-600"
              >
                -🍅
              </button>
              <button
                onClick={() => adjustTomatoes(1)}
                className="rounded bg-green-500 px-2 py-1 text-xs hover:bg-green-600"
              >
                +🍅
              </button>
              <button
                onClick={() => setCompletedPomodoros(0)}
                className="rounded bg-yellow-500 px-2 py-1 text-xs hover:bg-yellow-600"
              >
                Reset 🍅
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DebugPanel;
