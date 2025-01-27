"use client";

import React from "react";
import usePomodoro from "../_hooks/usePomodoro";
import { formatTime } from "../_util/formatTime";
import { useUpdateMetadata } from "../_hooks/useUpdateMetadata";
import { useSound } from "../_hooks/useSound";
import DebugPanel from "./DebugPanel";
import PomodoroTracker from "./PomodoroTracker";
import type { TimerMode } from "../_hooks/usePomodoro";

interface ButtonProps {
  title: string;
  onClick: () => void;
  mode?: TimerMode;
}

const BUTTON_COLORS = {
  work: "bg-blue-500 hover:bg-blue-600",
  "short-break": "bg-green-500 hover:bg-green-600",
  "long-break": "bg-purple-500 hover:bg-purple-600",
} as const;

const PROGRESS_COLORS = {
  work: "bg-blue-500",
  "short-break": "bg-green-500",
  "long-break": "bg-purple-500",
} as const;

function Button({ title, onClick, mode = "work" }: ButtonProps) {
  return (
    <button
      className={`rounded px-4 py-2 text-white transition-colors ${BUTTON_COLORS[mode]}`}
      onClick={onClick}
    >
      {title}
    </button>
  );
}

const MODE_TEXT = {
  work: "Work Time",
  "short-break": "Short Break",
  "long-break": "Long Break",
} as const;

const MODE_COLORS = {
  work: "text-blue-600",
  "short-break": "text-green-600",
  "long-break": "text-purple-600",
} as const;

function Timer({ time, mode }: { time: number; mode: TimerMode }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <p className={`text-lg font-semibold ${MODE_COLORS[mode]}`}>
        {MODE_TEXT[mode]}
      </p>
      <p className="font-mono text-4xl">{formatTime(time)}</p>
    </div>
  );
}

function StartStopToggle({
  isRunning,
  onStart,
  onStop,
  mode,
}: {
  isRunning: boolean;
  onStart: () => void;
  onStop: () => void;
  mode: TimerMode;
}) {
  return (
    <Button
      title={isRunning ? "Stop" : "Start"}
      onClick={isRunning ? onStop : onStart}
      mode={mode}
    />
  );
}

function ResetButton({
  onClick,
  mode,
}: {
  onClick: () => void;
  mode: TimerMode;
}) {
  return <Button title="Reset" onClick={onClick} mode={mode} />;
}

function ProgressBar({
  progress,
  mode,
}: {
  progress: number;
  mode: TimerMode;
}) {
  return (
    <div className="h-2 w-full rounded-full bg-gray-200">
      <div
        className={`h-full rounded-full ${PROGRESS_COLORS[mode]}`}
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
}

export function ResetAllButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="text-sm text-gray-500 hover:text-gray-700"
    >
      Reset Progress
    </button>
  );
}

function PomodoroApp() {
  const {
    time,
    progress,
    startTimer,
    stopTimer,
    resetTimer,
    resetAll,
    isRunning,
    setTime,
    completedPomodoros,
    setCompletedPomodoros,
    onComplete,
    mode,
  } = usePomodoro();
  const { playSound } = useSound();
  useUpdateMetadata(time);

  // Register sound callback
  React.useEffect(() => {
    onComplete(playSound);
  }, [onComplete, playSound]);

  return (
    <>
      <div className="container flex flex-col items-center justify-center gap-12 px-4">
        <Timer time={time} mode={mode} />
        <div className="flex gap-4">
          <StartStopToggle
            isRunning={isRunning}
            onStart={startTimer}
            onStop={stopTimer}
            mode={mode}
          />
          <ResetButton onClick={resetTimer} mode={mode} />
        </div>
        <ProgressBar progress={progress} mode={mode} />
        <div className="flex flex-col items-center gap-4">
          <PomodoroTracker count={completedPomodoros} />
          {completedPomodoros > 0 && <ResetAllButton onClick={resetAll} />}
        </div>
      </div>
      <DebugPanel
        time={time}
        setTime={setTime}
        completedPomodoros={completedPomodoros}
        setCompletedPomodoros={setCompletedPomodoros}
      />
    </>
  );
}

export default PomodoroApp;
