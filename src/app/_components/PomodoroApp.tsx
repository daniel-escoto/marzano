"use client";

import React from "react";
import usePomodoro from "../_hooks/usePomodoro";

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
  return <p className="font-mono text-4xl">{time}</p>;
}

function StartButton({ onClick }: { onClick: () => void }) {
  return <Button title="Start" onClick={onClick} />;
}

function StopButton({ onClick }: { onClick: () => void }) {
  return <Button title="Stop" onClick={onClick} />;
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
  const { time, progress, start, stop, reset } = usePomodoro();

  return (
    <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
      <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
        Welcome to Marzano
      </h1>
      <Timer time={time} />
      <div className="flex gap-4">
        <StartButton onClick={start} />
        <StopButton onClick={stop} />
        <ResetButton onClick={reset} />
      </div>
      <ProgressBar progress={progress} />
      <PomodoroTracker />
    </div>
  );
}

export default PomodoroApp;
