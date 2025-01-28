import { renderHook } from "@testing-library/react";
import { useUpdateMetadata } from "../useUpdateMetadata";

describe("useUpdateMetadata", () => {
  let originalTitle: string;

  beforeEach(() => {
    originalTitle = document.title;
    jest.useFakeTimers();
  });

  afterEach(() => {
    document.title = originalTitle;
    jest.useRealTimers();
    jest.clearAllTimers();
  });

  test("should update title with formatted time during normal operation", () => {
    renderHook(() => useUpdateMetadata(300, true)); // 5 minutes
    expect(document.title).toBe("5:00 | Marzano");
  });

  test("should start flashing title when timer completes", () => {
    const { rerender } = renderHook(
      ({ time, isRunning }) => useUpdateMetadata(time, isRunning),
      {
        initialProps: { time: 60, isRunning: true },
      },
    );

    // Simulate countdown to near completion
    rerender({ time: 2, isRunning: true });

    // Simulate timer completion (time jumps to next mode duration)
    rerender({ time: 300, isRunning: false });

    // Check initial title
    expect(document.title).toBe("Time's up!");

    // Advance timer by 1 second
    jest.advanceTimersByTime(1000);
    expect(document.title).toBe("⏰ Check Marzano!");

    // Advance timer by another second
    jest.advanceTimersByTime(1000);
    expect(document.title).toBe("Time's up!");

    // Complete all flashing cycles (10 changes total = 5 complete cycles)
    jest.advanceTimersByTime(10000); // Advance full 10 seconds to complete all cycles
    expect(document.title).toBe("Marzano");
  });

  test("should cleanup interval when unmounted during flashing", () => {
    const { unmount } = renderHook(
      ({ time, isRunning }) => useUpdateMetadata(time, isRunning),
      {
        initialProps: { time: 60, isRunning: true },
      },
    );

    // Simulate timer completion
    renderHook(({ time, isRunning }) => useUpdateMetadata(time, isRunning), {
      initialProps: { time: 2, isRunning: true },
    });
    renderHook(({ time, isRunning }) => useUpdateMetadata(time, isRunning), {
      initialProps: { time: 300, isRunning: false },
    });

    // Advance timer partially through the flashing sequence
    jest.advanceTimersByTime(3000);

    // Unmount the component
    unmount();

    // Advance timer further
    jest.advanceTimersByTime(7000);

    // The interval should have been cleared, so the title should remain unchanged
    const titleAfterUnmount = document.title;
    jest.advanceTimersByTime(1000);
    expect(document.title).toBe(titleAfterUnmount);
  });

  test("should not flash when time changes but timer is still running", () => {
    const { rerender } = renderHook(
      ({ time, isRunning }) => useUpdateMetadata(time, isRunning),
      {
        initialProps: { time: 60, isRunning: true },
      },
    );

    // Change time while still running
    rerender({ time: 30, isRunning: true });

    expect(document.title).toBe("0:30 | Marzano");

    // Advance timer
    jest.advanceTimersByTime(1000);
    expect(document.title).toBe("0:30 | Marzano");
  });

  test("should not flash when timer stops but time hasn't changed", () => {
    const { rerender } = renderHook(
      ({ time, isRunning }) => useUpdateMetadata(time, isRunning),
      {
        initialProps: { time: 60, isRunning: true },
      },
    );

    // Stop timer without changing time
    rerender({ time: 60, isRunning: false });

    expect(document.title).toBe("1:00 | Marzano");

    // Advance timer
    jest.advanceTimersByTime(1000);
    expect(document.title).toBe("1:00 | Marzano");
  });
});
