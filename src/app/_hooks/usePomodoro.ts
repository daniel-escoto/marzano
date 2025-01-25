import { useEffect, useState, useCallback, useRef } from "react";

const DEFAULT_POMODORO_TIME = 25 * 60;

function usePomodoro() {
  const [time, setTime] = useState(DEFAULT_POMODORO_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const isCompletingRef = useRef(false);

  const handleCompletion = useCallback(() => {
    if (isCompletingRef.current) return;
    isCompletingRef.current = true;
    setIsRunning(false);
    setCompletedPomodoros((prev) => prev + 1);
    // Reset the flag after all state updates are processed
    setTimeout(() => {
      isCompletingRef.current = false;
    }, 0);
  }, []);

  const resetTimer = () => {
    setTime(DEFAULT_POMODORO_TIME);
    setIsRunning(false);
  };

  const resetAll = () => {
    resetTimer();
    setCompletedPomodoros(0);
  };

  const startTimer = () => {
    setIsRunning(true);
  };

  const stopTimer = () => {
    setIsRunning(false);
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isRunning && time > 0) {
      intervalId = setInterval(() => {
        setTime((prevTime) => {
          const newTime = prevTime - 1;
          if (newTime === 0) {
            handleCompletion();
          }
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isRunning, time, handleCompletion]);

  const progress = (time / DEFAULT_POMODORO_TIME) * 100;

  return {
    time,
    progress,
    isRunning,
    completedPomodoros,
    startTimer,
    stopTimer,
    resetTimer,
    resetAll,
    setTime,
    setCompletedPomodoros,
  };
}

export default usePomodoro;
