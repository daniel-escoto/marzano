import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PomodoroApp from "../PomodoroApp";

// Mock the usePomodoro hook
jest.mock("../../_hooks/usePomodoro", () => ({
  __esModule: true,
  default: () => ({
    time: 1500,
    progress: 100,
    start: jest.fn(() => console.log("start")),
    stop: jest.fn(() => console.log("stop")),
    reset: jest.fn(() => console.log("reset")),
  }),
}));

describe("PomodoroApp", () => {
  it("renders the main components", () => {
    render(<PomodoroApp />);

    // Check for main title
    expect(screen.getByText("Welcome to Marzano")).toBeInTheDocument();

    // Check for timer with the mocked value (1500 seconds)
    expect(screen.getByText("1500")).toBeInTheDocument();

    // Check for buttons
    expect(screen.getByText("Start")).toBeInTheDocument();
    expect(screen.getByText("Stop")).toBeInTheDocument();
    expect(screen.getByText("Reset")).toBeInTheDocument();
  });

  it("buttons are clickable", async () => {
    const user = userEvent.setup();
    const consoleSpy = jest.spyOn(console, "log");

    render(<PomodoroApp />);

    // Test Start button
    await user.click(screen.getByText("Start"));
    expect(consoleSpy).toHaveBeenCalledWith("start");

    // Test Stop button
    await user.click(screen.getByText("Stop"));
    expect(consoleSpy).toHaveBeenCalledWith("stop");

    // Test Reset button
    await user.click(screen.getByText("Reset"));
    expect(consoleSpy).toHaveBeenCalledWith("reset");

    consoleSpy.mockRestore();
  });
});
