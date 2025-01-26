import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ResetAllButton } from "../PomodoroApp";
import PomodoroTracker from "../PomodoroTracker";

describe("PomodoroTracker", () => {
  it("should display the correct number of tomatoes", () => {
    render(<PomodoroTracker count={3} />);

    const tomatoes = screen.getAllByRole("img", { name: "completed pomodoro" });
    expect(tomatoes).toHaveLength(3);
  });

  it("should group tomatoes in boxes of 4 and show pack count", () => {
    const { container } = render(<PomodoroTracker count={7} />);

    // Find all boxed groups (should be 1 for first 4 tomatoes)
    const boxedGroups = container.getElementsByClassName("border");
    expect(boxedGroups).toHaveLength(1);

    // Find all tomatoes (should be 7 total)
    const tomatoes = screen.getAllByRole("img", { name: "completed pomodoro" });
    expect(tomatoes).toHaveLength(7);

    // Verify pack count text
    expect(
      screen.getByText((content, element) => {
        return (
          element?.tagName.toLowerCase() === "p" &&
          content.includes("1 pack + 3")
        );
      }),
    ).toBeInTheDocument();
  });

  it("should handle multiple complete groups", () => {
    const { container } = render(<PomodoroTracker count={8} />);

    // Should have 2 boxed groups of 4
    const boxedGroups = container.getElementsByClassName("border");
    expect(boxedGroups).toHaveLength(2);

    // Should have 8 tomatoes total
    const tomatoes = screen.getAllByRole("img", { name: "completed pomodoro" });
    expect(tomatoes).toHaveLength(8);

    // Verify pack count text
    expect(
      screen.getByText((content, element) => {
        return (
          element?.tagName.toLowerCase() === "p" && content.includes("2 packs")
        );
      }),
    ).toBeInTheDocument();
  });

  it("should handle single pack with no remainder", () => {
    render(<PomodoroTracker count={4} />);
    expect(
      screen.getByText((content, element) => {
        return (
          element?.tagName.toLowerCase() === "p" && content.includes("1 pack")
        );
      }),
    ).toBeInTheDocument();
  });

  it("should show only tomato count when less than a pack", () => {
    render(<PomodoroTracker count={3} />);
    expect(
      screen.getByText((content, element) => {
        return (
          element?.tagName.toLowerCase() === "p" &&
          content.includes("0 packs + 3")
        );
      }),
    ).toBeInTheDocument();
  });

  it("should handle negative count gracefully", () => {
    render(<PomodoroTracker count={-1} />);

    const tomatoes = screen.queryAllByRole("img", {
      name: "completed pomodoro",
    });
    expect(tomatoes).toHaveLength(0);
    expect(
      screen.getByText((content, element) => {
        return (
          element?.tagName.toLowerCase() === "p" && content.includes("0 packs")
        );
      }),
    ).toBeInTheDocument();
  });

  it("should handle singular tomato text", () => {
    render(<PomodoroTracker count={1} />);
    expect(
      screen.getByText((content, element) => {
        return (
          element?.tagName.toLowerCase() === "p" &&
          content.includes("0 packs + 1")
        );
      }),
    ).toBeInTheDocument();
  });

  it("should display no tomatoes when count is 0", () => {
    render(<PomodoroTracker count={0} />);

    const tomatoes = screen.queryAllByRole("img", {
      name: "completed pomodoro",
    });
    expect(tomatoes).toHaveLength(0);
    expect(
      screen.getByText((content, element) => {
        return (
          element?.tagName.toLowerCase() === "p" && content.includes("0 packs")
        );
      }),
    ).toBeInTheDocument();
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
