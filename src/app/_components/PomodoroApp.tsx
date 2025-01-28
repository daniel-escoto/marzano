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

const BUTTON_SECONDARY_COLORS = {
  work: "border-blue-500 text-blue-500 hover:bg-blue-50",
  "short-break": "border-green-500 text-green-500 hover:bg-green-50",
  "long-break": "border-purple-500 text-purple-500 hover:bg-purple-50",
} as const;

function Button({
  title,
  onClick,
  mode = "work",
  variant = "primary",
}: ButtonProps & { variant?: "primary" | "secondary" }) {
  const baseClasses = "rounded px-4 py-2 transition-colors border";
  const colorClasses =
    variant === "primary"
      ? `${BUTTON_COLORS[mode]} text-white border-transparent`
      : `bg-transparent ${BUTTON_SECONDARY_COLORS[mode]}`;

  return (
    <button
      className={`${baseClasses} ${colorClasses} w-full`}
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
  return (
    <Button title="Reset" onClick={onClick} mode={mode} variant="secondary" />
  );
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
        className={`h-full rounded-full ${BUTTON_COLORS[mode]}`}
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
  useUpdateMetadata(time, isRunning);

  // Register sound callback
  React.useEffect(() => {
    onComplete(playSound);
  }, [onComplete, playSound]);

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-12">
        <Timer time={time} mode={mode} />
        <div className="flex w-full max-w-md gap-4">
          <div className="w-2/3">
            <StartStopToggle
              isRunning={isRunning}
              onStart={startTimer}
              onStop={stopTimer}
              mode={mode}
            />
          </div>
          <div className="w-1/3">
            <ResetButton onClick={resetTimer} mode={mode} />
          </div>
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
