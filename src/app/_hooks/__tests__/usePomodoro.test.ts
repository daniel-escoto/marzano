import { renderHook, act } from "@testing-library/react";
import usePomodoro from "../usePomodoro";

type HookResult = ReturnType<typeof usePomodoro>;

describe("usePomodoro", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  // Helper function to complete a timer session
  const completeSession = (
    result: { current: HookResult },
    duration: number,
  ) => {
    act(() => {
      result.current.startTimer();
    });

    // Advance time and let state updates happen
    act(() => {
      jest.advanceTimersByTime(duration * 1000);
    });
  };

  // Helper function to advance timer by some seconds
  const advanceTimer = (result: { current: HookResult }, seconds: number) => {
    act(() => {
      result.current.startTimer();
    });

    act(() => {
      jest.advanceTimersByTime(seconds * 1000);
    });
  };

  it("should initialize with default values", () => {
    const { result } = renderHook(() => usePomodoro());

    expect(result.current.time).toBe(25 * 60); // 25 minutes in seconds
    expect(result.current.isRunning).toBe(false);
    expect(result.current.completedPomodoros).toBe(0);
    expect(result.current.mode).toBe("work");
    expect(result.current).toHaveProperty("startTimer");
    expect(result.current).toHaveProperty("stopTimer");
    expect(result.current).toHaveProperty("resetTimer");
    expect(result.current).toHaveProperty("resetAll");
    expect(result.current).toHaveProperty("onComplete");
  });

  it("should start and stop the timer", () => {
    const { result } = renderHook(() => usePomodoro());

    act(() => {
      result.current.startTimer();
    });

    expect(result.current.time).toBe(25 * 60);
    expect(result.current.isRunning).toBe(true);

    // Advance timer by 2 seconds
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(result.current.time).toBe(25 * 60 - 2);

    act(() => {
      result.current.stopTimer();
    });

    expect(result.current.isRunning).toBe(false);

    // Advance timer by 1 more second
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Time should not change after stopping
    expect(result.current.time).toBe(25 * 60 - 2);
  });

  it("should reset the timer to current mode duration", () => {
    const { result } = renderHook(() => usePomodoro());

    // Start and advance timer in work mode
    advanceTimer(result, 5);

    expect(result.current.time).toBe(25 * 60 - 5);

    // Reset timer in work mode
    act(() => {
      result.current.resetTimer();
    });

    expect(result.current.time).toBe(25 * 60);
    expect(result.current.isRunning).toBe(false);

    // Complete work session to enter break mode
    completeSession(result, 25 * 60);

    expect(result.current.mode).toBe("short-break");
    expect(result.current.time).toBe(5 * 60);

    // Start and advance timer in break mode
    advanceTimer(result, 5);

    // Reset timer in break mode
    act(() => {
      result.current.resetTimer();
    });

    expect(result.current.time).toBe(5 * 60); // Should reset to break duration
    expect(result.current.isRunning).toBe(false);
  });

  it("should handle multiple pomodoro completions with breaks", () => {
    const mockCallback = jest.fn();
    const { result } = renderHook(() => usePomodoro());

    // Register completion callback
    act(() => {
      result.current.onComplete(mockCallback);
    });

    // Complete first work session
    completeSession(result, 25 * 60);

    // Verify first work completion and break transition
    expect(result.current.mode).toBe("short-break");
    expect(result.current.time).toBe(5 * 60);
    expect(result.current.completedPomodoros).toBe(1);
    expect(mockCallback).toHaveBeenCalledTimes(1);

    // Complete break session
    completeSession(result, 5 * 60);

    // Verify transition back to work
    expect(result.current.mode).toBe("work");
    expect(result.current.time).toBe(25 * 60);
    expect(result.current.completedPomodoros).toBe(1); // Should not increment during break

    // Complete second work session
    completeSession(result, 25 * 60);

    // Verify second work completion
    expect(result.current.mode).toBe("short-break");
    expect(result.current.time).toBe(5 * 60);
    expect(result.current.completedPomodoros).toBe(2);
    expect(mockCallback).toHaveBeenCalledTimes(3); // Called for both work and break completions
  });

  it("should reset all progress to work mode", () => {
    const { result } = renderHook(() => usePomodoro());

    // Complete work session to enter break mode
    completeSession(result, 25 * 60);

    expect(result.current.mode).toBe("short-break");
    expect(result.current.time).toBe(5 * 60);
    expect(result.current.completedPomodoros).toBe(1);

    // Reset all progress
    act(() => {
      result.current.resetAll();
    });

    expect(result.current.mode).toBe("work");
    expect(result.current.time).toBe(25 * 60);
    expect(result.current.completedPomodoros).toBe(0);
    expect(result.current.isRunning).toBe(false);
  });

  it("should increment completed pomodoros and call onComplete when timer reaches zero", () => {
    const mockCallback = jest.fn();
    const { result } = renderHook(() => usePomodoro());

    // Register completion callback
    act(() => {
      result.current.onComplete(mockCallback);
    });

    // Start and advance to just before completion
    advanceTimer(result, 25 * 60 - 1);

    expect(result.current.time).toBe(1);
    expect(result.current.completedPomodoros).toBe(0);
    expect(mockCallback).not.toHaveBeenCalled();

    // Complete the pomodoro
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.mode).toBe("short-break");
    expect(result.current.time).toBe(5 * 60);
    expect(result.current.completedPomodoros).toBe(1);
    expect(result.current.isRunning).toBe(false);
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it("should reset all progress", () => {
    const { result } = renderHook(() => usePomodoro());

    // Complete one pomodoro
    completeSession(result, 25 * 60);

    expect(result.current.mode).toBe("short-break");
    expect(result.current.time).toBe(5 * 60);
    expect(result.current.completedPomodoros).toBe(1);

    // Reset all progress
    act(() => {
      result.current.resetAll();
    });

    expect(result.current.completedPomodoros).toBe(0);
    expect(result.current.time).toBe(25 * 60);
    expect(result.current.isRunning).toBe(false);
  });

  it("should not double increment completedPomodoros on rapid updates", () => {
    const mockCallback = jest.fn();
    const { result } = renderHook(() => usePomodoro());

    // Register completion callback
    act(() => {
      result.current.onComplete(mockCallback);
    });

    // Complete work session
    completeSession(result, 25 * 60);

    // Should only increment once and call callback once
    expect(result.current.completedPomodoros).toBe(1);
    expect(result.current.mode).toBe("short-break");
    expect(result.current.time).toBe(5 * 60);
    expect(result.current.isRunning).toBe(false);
    expect(mockCallback).toHaveBeenCalledTimes(1);

    // Additional time advancement should not affect the count or trigger callback
    act(() => {
      jest.advanceTimersByTime(1000);
      jest.runAllTimers();
    });

    expect(result.current.completedPomodoros).toBe(1);
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it("should handle multiple pomodoro completions correctly", () => {
    const mockCallback = jest.fn();
    const { result } = renderHook(() => usePomodoro());

    // Register completion callback
    act(() => {
      result.current.onComplete(mockCallback);
    });

    // Complete first pomodoro
    completeSession(result, 25 * 60);

    // Verify first completion
    expect(result.current.mode).toBe("short-break");
    expect(result.current.time).toBe(5 * 60);
    expect(result.current.completedPomodoros).toBe(1);
    expect(mockCallback).toHaveBeenCalledTimes(1);

    // Start and complete second pomodoro
    act(() => {
      result.current.resetTimer();
    });

    expect(result.current.time).toBe(5 * 60);
    expect(result.current.isRunning).toBe(false);
    expect(result.current.completedPomodoros).toBe(1);

    completeSession(result, 5 * 60);

    // Verify second completion
    expect(result.current.mode).toBe("work");
    expect(result.current.time).toBe(25 * 60);
    expect(result.current.completedPomodoros).toBe(1);
    expect(mockCallback).toHaveBeenCalledTimes(2);
  });

  it("should transition to short break after work session", () => {
    const { result } = renderHook(() => usePomodoro());

    // Complete work session
    completeSession(result, 25 * 60);

    expect(result.current.mode).toBe("short-break");
    expect(result.current.time).toBe(5 * 60); // 5 minutes
    expect(result.current.completedPomodoros).toBe(1);
  });

  it("should transition to long break after 4 work sessions", () => {
    const { result } = renderHook(() => usePomodoro());

    // Complete 4 work sessions with breaks in between
    for (let i = 0; i < 4; i++) {
      // Complete work session
      completeSession(result, 25 * 60);

      if (i < 3) {
        expect(result.current.mode).toBe("short-break");
        // Complete break
        completeSession(result, 5 * 60);
        expect(result.current.mode).toBe("work");
      }
    }

    // After 4th work session, should be in long break
    expect(result.current.mode).toBe("long-break");
    expect(result.current.time).toBe(15 * 60); // 15 minutes
    expect(result.current.completedPomodoros).toBe(4);
  });

  it("should return to work mode after any break", () => {
    const { result } = renderHook(() => usePomodoro());

    // Complete work session to get to short break
    completeSession(result, 25 * 60);

    expect(result.current.mode).toBe("short-break");

    // Complete short break
    completeSession(result, 5 * 60);

    expect(result.current.mode).toBe("work");
    expect(result.current.time).toBe(25 * 60);
  });

  it("should only increment completedPomodoros after work sessions", () => {
    const { result } = renderHook(() => usePomodoro());

    // Complete work session
    completeSession(result, 25 * 60);

    expect(result.current.completedPomodoros).toBe(1);

    // Complete break session
    completeSession(result, 5 * 60);

    // Completed pomodoros should not increment after break
    expect(result.current.completedPomodoros).toBe(1);
  });
});
