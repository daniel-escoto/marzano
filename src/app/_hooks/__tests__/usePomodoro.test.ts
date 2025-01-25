import { renderHook, act } from "@testing-library/react";
import usePomodoro from "../usePomodoro";

describe("usePomodoro", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should initialize with default values", () => {
    const { result } = renderHook(() => usePomodoro());

    expect(result.current.time).toBe(25 * 60); // 25 minutes in seconds
    expect(result.current.isRunning).toBe(false);
    expect(result.current.completedPomodoros).toBe(0);
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

  it("should reset the timer", () => {
    const { result } = renderHook(() => usePomodoro());

    // Start and advance timer
    act(() => {
      result.current.startTimer();
    });

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(result.current.time).toBe(25 * 60 - 5);

    // Reset timer
    act(() => {
      result.current.resetTimer();
    });

    expect(result.current.time).toBe(25 * 60);
    expect(result.current.isRunning).toBe(false);

    // Advance timer after reset
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Time should not change because timer is not running after reset
    expect(result.current.time).toBe(25 * 60);
  });

  it("should increment completed pomodoros and call onComplete when timer reaches zero", () => {
    const mockCallback = jest.fn();
    const { result } = renderHook(() => usePomodoro());

    // Register completion callback
    act(() => {
      result.current.onComplete(mockCallback);
    });

    act(() => {
      result.current.startTimer();
    });

    // Advance to just before completion
    act(() => {
      jest.advanceTimersByTime((25 * 60 - 1) * 1000);
    });

    expect(result.current.time).toBe(1);
    expect(result.current.completedPomodoros).toBe(0);
    expect(mockCallback).not.toHaveBeenCalled();

    // Complete the pomodoro
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current.time).toBe(0);
    expect(result.current.completedPomodoros).toBe(1);
    expect(result.current.isRunning).toBe(false);
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it("should reset all progress", () => {
    const { result } = renderHook(() => usePomodoro());

    // Complete one pomodoro
    act(() => {
      result.current.startTimer();
    });

    // Advance to just before completion
    act(() => {
      jest.advanceTimersByTime((25 * 60 - 1) * 1000);
    });

    // Complete the pomodoro
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current.time).toBe(0);
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

    // Start the timer
    act(() => {
      result.current.startTimer();
    });

    // Set time to 1 second and let it complete
    act(() => {
      result.current.setTime(1);
    });

    // Advance time rapidly
    act(() => {
      jest.advanceTimersByTime(1100); // Advance slightly more than 1 second
    });

    // Should only increment once and call callback once
    expect(result.current.completedPomodoros).toBe(1);
    expect(result.current.time).toBe(0);
    expect(result.current.isRunning).toBe(false);
    expect(mockCallback).toHaveBeenCalledTimes(1);

    // Additional time advancement should not affect the count or trigger callback
    act(() => {
      jest.advanceTimersByTime(1000);
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
    act(() => {
      result.current.startTimer();
    });

    act(() => {
      result.current.setTime(1);
    });

    // Verify initial state
    expect(result.current.time).toBe(1);
    expect(result.current.isRunning).toBe(true);
    expect(result.current.completedPomodoros).toBe(0);

    // Let it complete
    act(() => {
      jest.advanceTimersByTime(1100);
    });

    // Verify first completion
    expect(result.current.time).toBe(0);
    expect(result.current.isRunning).toBe(false);
    expect(result.current.completedPomodoros).toBe(1);
    expect(mockCallback).toHaveBeenCalledTimes(1);

    // Start and complete second pomodoro
    act(() => {
      result.current.resetTimer();
    });

    expect(result.current.time).toBe(25 * 60);
    expect(result.current.isRunning).toBe(false);
    expect(result.current.completedPomodoros).toBe(1);

    act(() => {
      result.current.startTimer();
    });

    act(() => {
      result.current.setTime(1);
    });

    act(() => {
      jest.advanceTimersByTime(1100);
    });

    // Verify second completion
    expect(result.current.time).toBe(0);
    expect(result.current.isRunning).toBe(false);
    expect(result.current.completedPomodoros).toBe(2);
    expect(mockCallback).toHaveBeenCalledTimes(2);
  });
});
