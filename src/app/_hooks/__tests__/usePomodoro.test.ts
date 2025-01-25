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
    expect(result.current).toHaveProperty("start");
    expect(result.current).toHaveProperty("stop");
    expect(result.current).toHaveProperty("reset");
  });

  it("should start and stop the timer", () => {
    const { result } = renderHook(() => usePomodoro());

    act(() => {
      result.current.start();
    });

    expect(result.current.time).toBe(25 * 60);

    // Advance timer by 2 seconds
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(result.current.time).toBe(25 * 60 - 2);

    act(() => {
      result.current.stop();
    });

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
      result.current.start();
    });

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(result.current.time).toBe(25 * 60 - 5);

    // Reset timer
    act(() => {
      result.current.reset();
    });

    expect(result.current.time).toBe(25 * 60);

    // Advance timer after reset
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Time should not change because timer is not running after reset
    expect(result.current.time).toBe(25 * 60);
  });

  it("should stop at 0 and not go negative", () => {
    const { result } = renderHook(() => usePomodoro());

    act(() => {
      result.current.start();
    });

    // Advance to just before 0
    act(() => {
      jest.advanceTimersByTime(25 * 60 * 1000);
    });

    expect(result.current.time).toBe(0);

    // Try to advance more
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Should still be 0
    expect(result.current.time).toBe(0);
  });
});
