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

function CircularProgress({
  progress,
  mode,
  children,
}: {
  progress: number;
  mode: TimerMode;
  children: React.ReactNode;
}) {
  const radius = 160;
  const strokeWidth = 8;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative">
      <svg
        height={radius * 2}
        width={radius * 2}
        className="-rotate-90 transform"
      >
        {/* Background circle */}
        <circle
          stroke="currentColor"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="text-gray-200 dark:text-gray-800"
        />
        {/* Progress circle */}
        <circle
          stroke="currentColor"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference + " " + circumference}
          style={{ strokeDashoffset }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          strokeLinecap="round"
          className={`transition-all duration-1000 ${BUTTON_COLORS[mode].replace("bg-", "text-").replace("hover:", "")}`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}

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
        <CircularProgress progress={progress} mode={mode}>
          <Timer time={time} mode={mode} />
        </CircularProgress>
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
