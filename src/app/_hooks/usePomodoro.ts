import { useEffect, useState } from "react";

const DEFAULT_POMODORO_TIME = 25 * 60;

function usePomodoro() {
  const [time, setTime] = useState(DEFAULT_POMODORO_TIME);
  const [isRunning, setIsRunning] = useState(false);

  const reset = () => {
    setTime(DEFAULT_POMODORO_TIME);
    setIsRunning(false);
  };

  const start = () => {
    setIsRunning(true);
  };

  const stop = () => {
    setIsRunning(false);
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isRunning && time > 0) {
      intervalId = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isRunning, time]);

  return {
    time,
    start,
    stop,
    reset,
  };
}

export default usePomodoro;
