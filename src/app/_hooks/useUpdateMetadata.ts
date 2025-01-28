import { useEffect, useRef } from "react";
import { formatTime } from "../_util/formatTime";

export function useUpdateMetadata(time: number, isRunning: boolean) {
  const prevTimeRef = useRef(time);
  const wasRunningRef = useRef(isRunning);
  const isFlashingRef = useRef(false);

  useEffect(() => {
    let flashingInterval: NodeJS.Timeout | undefined;

    // Get current state before updating refs
    const prevTime = prevTimeRef.current;
    const wasRunning = wasRunningRef.current;

    // Update refs immediately
    prevTimeRef.current = time;
    wasRunningRef.current = isRunning;

    // Detect timer completion: was running, stopped, and time jumped from small to large
    const timerJustCompleted =
      wasRunning &&
      !isRunning &&
      prevTime <= 3 && // Was near completion
      time > prevTime; // Jumped to a larger number (next mode's time)

    if (timerJustCompleted && !isFlashingRef.current) {
      isFlashingRef.current = true;
      document.title = "Time's up!";

      let flashCount = 0;
      flashingInterval = setInterval(() => {
        flashCount++;

        if (flashCount >= 10) {
          clearInterval(flashingInterval);
          document.title = "Marzano";
          isFlashingRef.current = false;
          return;
        }

        document.title =
          flashCount % 2 === 1 ? "⏰ Check Marzano!" : "Time's up!";
      }, 1000);
    } else if (!isFlashingRef.current) {
      document.title = `${formatTime(time)} | Marzano`;
    }

    return () => {
      if (flashingInterval) {
        clearInterval(flashingInterval);
      }
    };
  }, [time, isRunning]);
}
