"use client";

import React from "react";
import usePomodoro from "../_hooks/usePomodoro";
import { formatTime } from "../_util/formatTime";
import Header from "./Header";

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

function PomodoroTracker() {
  return <div>🍅🍅🍅</div>;
}

function PomodoroApp() {
  const { time, progress, start, stop, reset, isRunning } = usePomodoro();

  return (
    <>
      <Header />
      <div className="container flex min-h-screen flex-col items-center justify-center gap-12 px-4">
        <Timer time={time} />
        <div className="flex gap-4">
          <StartStopToggle
            isRunning={isRunning}
            onStart={start}
            onStop={stop}
          />
          <ResetButton onClick={reset} />
        </div>
        <ProgressBar progress={progress} />
        <PomodoroTracker />
      </div>
    </>
  );
}

export default PomodoroApp;
