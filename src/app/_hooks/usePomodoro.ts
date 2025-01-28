import { useEffect, useState, useCallback, useRef } from "react";

const DURATIONS = {
  WORK: 25 * 60,
  SHORT_BREAK: 5 * 60,
  LONG_BREAK: 15 * 60,
} as const;

const STORAGE_KEYS = {
  TIME: "marzano-time",
  MODE: "marzano-mode",
  IS_RUNNING: "marzano-is-running",
  COMPLETED_POMODOROS: "marzano-completed-pomodoros",
} as const;

export type TimerMode = "work" | "short-break" | "long-break";

type CompletionCallback = () => void;

interface PomodoroHook {
  time: number;
  progress: number;
  isRunning: boolean;
  completedPomodoros: number;
  mode: TimerMode;
  startTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  resetAll: () => void;
  setTime: (time: number) => void;
  setCompletedPomodoros: (count: number) => void;
  onComplete: (callback: CompletionCallback) => void;
}

function usePomodoro(): PomodoroHook {
  // Initialize with default values
  const [time, setTime] = useState(DURATIONS.WORK);
  const [mode, setMode] = useState<TimerMode>("work");
  const [isRunning, setIsRunning] = useState(false);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const isCompletingRef = useRef(false);
  const onCompleteCallbackRef = useRef<CompletionCallback | null>(null);
  const hasInitializedRef = useRef(false);

  // Load persisted data on mount only
  useEffect(() => {
    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;

    try {
      const storedTime = localStorage.getItem(STORAGE_KEYS.TIME);
      const storedMode = localStorage.getItem(STORAGE_KEYS.MODE);
      const storedIsRunning = localStorage.getItem(STORAGE_KEYS.IS_RUNNING);
      const storedCompletedPomodoros = localStorage.getItem(
        STORAGE_KEYS.COMPLETED_POMODOROS,
      );

      if (storedTime) setTime(JSON.parse(storedTime) as number);
      if (storedMode) setMode(JSON.parse(storedMode) as TimerMode);
      if (storedIsRunning) setIsRunning(JSON.parse(storedIsRunning) as boolean);
      if (storedCompletedPomodoros)
        setCompletedPomodoros(JSON.parse(storedCompletedPomodoros) as number);
    } catch (error) {
      console.error("Error loading persisted data:", error);
    }
  }, []);

  const getNextMode = useCallback(
    (currentMode: TimerMode, completed: number): TimerMode => {
      if (currentMode === "work") {
        // After every 4th pomodoro, take a long break
        return (completed + 1) % 4 === 0 ? "long-break" : "short-break";
      }
      // After any break, go back to work
      return "work";
    },
    [],
  );

  const getDurationForMode = (mode: TimerMode): number => {
    switch (mode) {
      case "work":
        return DURATIONS.WORK;
      case "short-break":
        return DURATIONS.SHORT_BREAK;
      case "long-break":
        return DURATIONS.LONG_BREAK;
    }
  };

  const handleCompletion = useCallback(() => {
    if (isCompletingRef.current) return;
    isCompletingRef.current = true;

    // Stop the timer first
    setIsRunning(false);

    // Call completion callback
    if (onCompleteCallbackRef.current) {
      onCompleteCallbackRef.current();
    }

    // Only increment completed pomodoros after work sessions
    if (mode === "work") {
      setCompletedPomodoros((prev) => prev + 1);
    }

    // Determine and set the next mode
    const nextMode = getNextMode(mode, completedPomodoros);
    setMode(nextMode);
    setTime(getDurationForMode(nextMode));

    // Reset the flag after all state updates are processed
    setTimeout(() => {
      isCompletingRef.current = false;
    }, 0);
  }, [mode, completedPomodoros, getNextMode]);

  const resetTimer = () => {
    setTime(getDurationForMode(mode));
    setIsRunning(false);
  };

  const resetAll = () => {
    setMode("work");
    setTime(DURATIONS.WORK);
    setIsRunning(false);
    setCompletedPomodoros(0);
  };

  const startTimer = () => {
    setIsRunning(true);
  };

  const stopTimer = () => {
    setIsRunning(false);
  };

  const onComplete = useCallback((callback: CompletionCallback) => {
    onCompleteCallbackRef.current = callback;
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;

    if (isRunning && time > 0) {
      intervalId = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(intervalId);
            handleCompletion();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isRunning, handleCompletion, time]);

  const progress = (time / getDurationForMode(mode)) * 100;

  // Persist state changes
  useEffect(() => {
    if (!hasInitializedRef.current) return;
    localStorage.setItem(STORAGE_KEYS.TIME, JSON.stringify(time));
  }, [time]);

  useEffect(() => {
    if (!hasInitializedRef.current) return;
    localStorage.setItem(STORAGE_KEYS.MODE, JSON.stringify(mode));
  }, [mode]);

  useEffect(() => {
    if (!hasInitializedRef.current) return;
    localStorage.setItem(STORAGE_KEYS.IS_RUNNING, JSON.stringify(isRunning));
  }, [isRunning]);

  useEffect(() => {
    if (!hasInitializedRef.current) return;
    localStorage.setItem(
      STORAGE_KEYS.COMPLETED_POMODOROS,
      JSON.stringify(completedPomodoros),
    );
  }, [completedPomodoros]);

  return {
    time,
    progress,
    isRunning,
    completedPomodoros,
    mode,
    startTimer,
    stopTimer,
    resetTimer,
    resetAll,
    setTime,
    setCompletedPomodoros,
    onComplete,
  };
}

export default usePomodoro;
