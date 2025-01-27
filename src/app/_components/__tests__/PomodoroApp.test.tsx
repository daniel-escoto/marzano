import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PomodoroApp from "../PomodoroApp";

// Mock the usePomodoro hook
const mockStartTimer = jest.fn();
const mockStopTimer = jest.fn();
const mockResetTimer = jest.fn();
const mockOnComplete = jest.fn();
let mockIsRunning = false;

jest.mock("../../_hooks/usePomodoro", () => ({
  __esModule: true,
  default: () => ({
    time: 1500,
    progress: 100,
    isRunning: mockIsRunning,
    startTimer: mockStartTimer,
    stopTimer: mockStopTimer,
    resetTimer: mockResetTimer,
    onComplete: mockOnComplete,
    completedPomodoros: 0,
    setCompletedPomodoros: jest.fn(),
    setTime: jest.fn(),
    resetAll: jest.fn(),
  }),
}));

// Mock the useSound hook
const mockPlaySound = jest.fn();
jest.mock("../../_hooks/useSound", () => ({
  useSound: () => ({
    playSound: mockPlaySound,
  }),
}));

jest.mock("../../_util/formatTime", () => ({
  formatTime: jest.fn(() => "1500"),
}));

describe("PomodoroApp", () => {
  beforeEach(() => {
    mockStartTimer.mockClear();
    mockStopTimer.mockClear();
    mockResetTimer.mockClear();
    mockPlaySound.mockClear();
    mockOnComplete.mockClear();
    mockIsRunning = false;
  });

  it("renders the main components", () => {
    render(<PomodoroApp />);

    // Check for timer with the mocked value (1500 seconds)
    expect(screen.getByText("1500")).toBeInTheDocument();

    // Check for buttons
    expect(screen.getByText("Start")).toBeInTheDocument();
    expect(screen.getByText("Reset")).toBeInTheDocument();
  });

  it("handles start/stop toggle correctly", async () => {
    const user = userEvent.setup();

    // Initial render with isRunning = false
    const { rerender } = render(<PomodoroApp />);

    // Should show "Start" initially
    const toggleButton = screen.getByText("Start");
    expect(toggleButton).toBeInTheDocument();

    // Click Start
    await user.click(toggleButton);
    expect(mockStartTimer).toHaveBeenCalledTimes(1);

    // Update mock to simulate running state
    mockIsRunning = true;
    rerender(<PomodoroApp />);

    // Should now show "Stop"
    expect(screen.getByText("Stop")).toBeInTheDocument();

    // Click Stop
    await user.click(screen.getByText("Stop"));
    expect(mockStopTimer).toHaveBeenCalledTimes(1);
  });

  it("handles reset button click", async () => {
    const user = userEvent.setup();
    render(<PomodoroApp />);

    await user.click(screen.getByText("Reset"));
    expect(mockResetTimer).toHaveBeenCalledTimes(1);
  });

  it("registers sound callback on mount", () => {
    render(<PomodoroApp />);

    // The onComplete callback should be registered with the playSound function
    expect(mockOnComplete).toHaveBeenCalledWith(mockPlaySound);
  });
});
