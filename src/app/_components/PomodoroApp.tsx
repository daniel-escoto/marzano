"use client";

import React from "react";
import usePomodoro from "../_hooks/usePomodoro";
import { formatTime } from "../_util/formatTime";
import { useUpdateMetadata } from "../_hooks/useUpdateMetadata";
import Header from "./Header";
import DebugPanel from "./DebugPanel";

interface ButtonProps {
  title: string;
  onClick: () => void;
}

function Button({ title, onClick }: ButtonProps) {
  return (
    <button
      className="rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
      onClick={onClick}
    >
      {title}
    </button>
  );
}

function Timer({ time }: { time: number }) {
  return <p className="font-mono text-4xl">{formatTime(time)}</p>;
}

function StartStopToggle({
  isRunning,
  onStart,
  onStop,
}: {
  isRunning: boolean;
  onStart: () => void;
  onStop: () => void;
}) {
  return (
    <Button
      title={isRunning ? "Stop" : "Start"}
      onClick={isRunning ? onStop : onStart}
    />
  );
}

function ResetButton({ onClick }: { onClick: () => void }) {
  return <Button title="Reset" onClick={onClick} />;
}

function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="h-2 w-full rounded-full bg-gray-200">
      <div
        className="h-full rounded-full bg-blue-500"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
}

export function PomodoroTracker({ count }: { count: number }) {
  const tomatoes = Array.from({ length: count }, (_, i) => (
    <span key={i} role="img" aria-label="completed pomodoro">
      🍅
    </span>
  ));

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-2xl">{tomatoes}</div>
      <p className="text-sm text-gray-600">
        {count} {count === 1 ? "pomodoro" : "pomodoros"} completed
      </p>
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
  } = usePomodoro();
  useUpdateMetadata(time);

  return (
    <>
      <Header />
      <div className="container flex min-h-screen flex-col items-center justify-center gap-12 px-4">
        <Timer time={time} />
        <div className="flex gap-4">
          <StartStopToggle
            isRunning={isRunning}
            onStart={startTimer}
            onStop={stopTimer}
          />
          <ResetButton onClick={resetTimer} />
        </div>
        <ProgressBar progress={progress} />
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
