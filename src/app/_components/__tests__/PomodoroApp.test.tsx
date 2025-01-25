import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PomodoroApp from "../PomodoroApp";

// Mock the usePomodoro hook
const mockStart = jest.fn();
const mockStop = jest.fn();
const mockReset = jest.fn();
let mockIsRunning = false;

jest.mock("../../_hooks/usePomodoro", () => ({
  __esModule: true,
  default: () => ({
    time: 1500,
    progress: 100,
    isRunning: mockIsRunning,
    start: mockStart,
    stop: mockStop,
    reset: mockReset,
  }),
}));

jest.mock("../../_util/formatTime", () => ({
  formatTime: jest.fn(() => "1500"),
}));

describe("PomodoroApp", () => {
  beforeEach(() => {
    mockStart.mockClear();
    mockStop.mockClear();
    mockReset.mockClear();
    mockIsRunning = false;
  });

  it("renders the main components", () => {
    render(<PomodoroApp />);

    // Check for header title
    expect(screen.getByText("Marzano")).toBeInTheDocument();

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
    expect(mockStart).toHaveBeenCalledTimes(1);

    // Update mock to simulate running state
    mockIsRunning = true;
    rerender(<PomodoroApp />);

    // Should now show "Stop"
    expect(screen.getByText("Stop")).toBeInTheDocument();

    // Click Stop
    await user.click(screen.getByText("Stop"));
    expect(mockStop).toHaveBeenCalledTimes(1);
  });

  it("handles reset button click", async () => {
    const user = userEvent.setup();
    render(<PomodoroApp />);

    await user.click(screen.getByText("Reset"));
    expect(mockReset).toHaveBeenCalledTimes(1);
  });
});
