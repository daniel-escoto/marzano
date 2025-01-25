"use client";

import React from "react";

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

function Timer() {
  return <p className="font-mono text-4xl">00:00:00</p>;
}

function StartButton() {
  return (
    <Button
      title="Start"
      onClick={() => {
        console.log("start");
      }}
    />
  );
}

function StopButton() {
  return (
    <Button
      title="Stop"
      onClick={() => {
        console.log("stop");
      }}
    />
  );
}

function ResetButton() {
  return (
    <Button
      title="Reset"
      onClick={() => {
        console.log("reset");
      }}
    />
  );
}

function ProgressBar() {
  return <div className="h-2 w-full rounded-full bg-gray-200"></div>;
}

function PomodoroTracker() {
  return <div>🍅🍅🍅</div>;
}

export function PomodoroApp() {
  return (
    <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
      <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
        Welcome to Marzano
      </h1>
      <Timer />
      <div className="flex gap-4">
        <StartButton />
        <StopButton />
        <ResetButton />
      </div>
      <ProgressBar />
      <PomodoroTracker />
    </div>
  );
}
