import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PomodoroTracker, ResetAllButton } from "../PomodoroApp";

describe("PomodoroTracker", () => {
  it("should display the correct number of tomatoes", () => {
    render(<PomodoroTracker count={3} />);

    const tomatoes = screen.getAllByRole("img", { name: "completed pomodoro" });
    expect(tomatoes).toHaveLength(3);
  });

  it("should display singular form when count is 1", () => {
    render(<PomodoroTracker count={1} />);
    expect(screen.getByText("1 pomodoro completed")).toBeInTheDocument();
  });

  it("should display plural form when count is not 1", () => {
    render(<PomodoroTracker count={2} />);
    expect(screen.getByText("2 pomodoros completed")).toBeInTheDocument();
  });

  it("should display no tomatoes when count is 0", () => {
    render(<PomodoroTracker count={0} />);

    const tomatoes = screen.queryAllByRole("img", {
      name: "completed pomodoro",
    });
    expect(tomatoes).toHaveLength(0);
    expect(screen.getByText("0 pomodoros completed")).toBeInTheDocument();
  });
});

describe("ResetAllButton", () => {
  it("should call onClick when clicked", async () => {
    const mockOnClick = jest.fn();
    const user = userEvent.setup();

    render(<ResetAllButton onClick={mockOnClick} />);

    await user.click(screen.getByText("Reset Progress"));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});
