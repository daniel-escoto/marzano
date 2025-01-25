import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DebugPanel from "../DebugPanel";
import { isDevEnvironment } from "../../_util/isDevEnvironment";

// Mock isDevEnvironment
jest.mock("../../_util/isDevEnvironment", () => ({
  isDevEnvironment: jest.fn(),
}));

describe("DebugPanel", () => {
  const mockSetTime = jest.fn();
  const mockSetCompletedPomodoros = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should not render in production mode", () => {
    (isDevEnvironment as jest.Mock).mockReturnValue(false);

    render(
      <DebugPanel
        time={300}
        setTime={mockSetTime}
        completedPomodoros={2}
        setCompletedPomodoros={mockSetCompletedPomodoros}
      />,
    );

    expect(screen.queryByText("Debug Panel")).not.toBeInTheDocument();
  });

  it("should render in development mode", () => {
    (isDevEnvironment as jest.Mock).mockReturnValue(true);

    render(
      <DebugPanel
        time={300}
        setTime={mockSetTime}
        completedPomodoros={2}
        setCompletedPomodoros={mockSetCompletedPomodoros}
      />,
    );

    expect(screen.getByText("Debug Panel")).toBeInTheDocument();
    expect(screen.getByText("Timer Controls")).toBeInTheDocument();
    expect(screen.getByText("Tomato Controls")).toBeInTheDocument();
  });

  describe("panel minimization", () => {
    beforeEach(() => {
      (isDevEnvironment as jest.Mock).mockReturnValue(true);
    });

    it("should start expanded", () => {
      render(
        <DebugPanel
          time={300}
          setTime={mockSetTime}
          completedPomodoros={2}
          setCompletedPomodoros={mockSetCompletedPomodoros}
        />,
      );

      expect(screen.getByText("Timer Controls")).toBeInTheDocument();
      expect(screen.getByText("Tomato Controls")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Minimize debug panel" }),
      ).toBeInTheDocument();
    });

    it("should minimize and expand when clicking the button", async () => {
      const user = userEvent.setup();
      render(
        <DebugPanel
          time={300}
          setTime={mockSetTime}
          completedPomodoros={2}
          setCompletedPomodoros={mockSetCompletedPomodoros}
        />,
      );

      // Initially expanded
      expect(screen.getByText("Timer Controls")).toBeInTheDocument();

      // Minimize
      await user.click(
        screen.getByRole("button", { name: "Minimize debug panel" }),
      );
      expect(screen.queryByText("Timer Controls")).not.toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Expand debug panel" }),
      ).toBeInTheDocument();

      // Expand
      await user.click(
        screen.getByRole("button", { name: "Expand debug panel" }),
      );
      expect(screen.getByText("Timer Controls")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Minimize debug panel" }),
      ).toBeInTheDocument();
    });

    it("should keep controls functional after minimize/expand", async () => {
      const user = userEvent.setup();
      render(
        <DebugPanel
          time={300}
          setTime={mockSetTime}
          completedPomodoros={2}
          setCompletedPomodoros={mockSetCompletedPomodoros}
        />,
      );

      // Minimize and expand
      await user.click(
        screen.getByRole("button", { name: "Minimize debug panel" }),
      );
      await user.click(
        screen.getByRole("button", { name: "Expand debug panel" }),
      );

      // Controls should still work
      await user.click(screen.getByText("+30s"));
      expect(mockSetTime).toHaveBeenCalledWith(330);
    });
  });

  describe("time manipulation", () => {
    beforeEach(() => {
      (isDevEnvironment as jest.Mock).mockReturnValue(true);
    });

    it("should add time correctly", async () => {
      const user = userEvent.setup();
      render(
        <DebugPanel
          time={300}
          setTime={mockSetTime}
          completedPomodoros={2}
          setCompletedPomodoros={mockSetCompletedPomodoros}
        />,
      );

      await user.click(screen.getByText("+30s"));
      expect(mockSetTime).toHaveBeenCalledWith(330);

      await user.click(screen.getByText("+1m"));
      expect(mockSetTime).toHaveBeenCalledWith(360);
    });

    it("should subtract time correctly", async () => {
      const user = userEvent.setup();
      render(
        <DebugPanel
          time={300}
          setTime={mockSetTime}
          completedPomodoros={2}
          setCompletedPomodoros={mockSetCompletedPomodoros}
        />,
      );

      await user.click(screen.getByText("-30s"));
      expect(mockSetTime).toHaveBeenCalledWith(270);

      await user.click(screen.getByText("-1m"));
      expect(mockSetTime).toHaveBeenCalledWith(240);
    });

    it("should not allow negative time when subtracting", async () => {
      const user = userEvent.setup();
      render(
        <DebugPanel
          time={30}
          setTime={mockSetTime}
          completedPomodoros={2}
          setCompletedPomodoros={mockSetCompletedPomodoros}
        />,
      );

      await user.click(screen.getByText("-1m"));
      expect(mockSetTime).toHaveBeenCalledWith(0);
    });

    it("should set time to 5 seconds", async () => {
      const user = userEvent.setup();
      render(
        <DebugPanel
          time={300}
          setTime={mockSetTime}
          completedPomodoros={2}
          setCompletedPomodoros={mockSetCompletedPomodoros}
        />,
      );

      await user.click(screen.getByText("Set to 5s"));
      expect(mockSetTime).toHaveBeenCalledWith(5);
    });
  });

  describe("tomato manipulation", () => {
    beforeEach(() => {
      (isDevEnvironment as jest.Mock).mockReturnValue(true);
    });

    it("should add tomatoes correctly", async () => {
      const user = userEvent.setup();
      render(
        <DebugPanel
          time={300}
          setTime={mockSetTime}
          completedPomodoros={2}
          setCompletedPomodoros={mockSetCompletedPomodoros}
        />,
      );

      await user.click(screen.getByText("+🍅"));
      expect(mockSetCompletedPomodoros).toHaveBeenCalledWith(3);
    });

    it("should subtract tomatoes correctly", async () => {
      const user = userEvent.setup();
      render(
        <DebugPanel
          time={300}
          setTime={mockSetTime}
          completedPomodoros={2}
          setCompletedPomodoros={mockSetCompletedPomodoros}
        />,
      );

      await user.click(screen.getByText("-🍅"));
      expect(mockSetCompletedPomodoros).toHaveBeenCalledWith(1);
    });

    it("should not allow negative tomato count", async () => {
      const user = userEvent.setup();
      render(
        <DebugPanel
          time={300}
          setTime={mockSetTime}
          completedPomodoros={0}
          setCompletedPomodoros={mockSetCompletedPomodoros}
        />,
      );

      await user.click(screen.getByText("-🍅"));
      expect(mockSetCompletedPomodoros).toHaveBeenCalledWith(0);
    });

    it("should reset tomato count", async () => {
      const user = userEvent.setup();
      render(
        <DebugPanel
          time={300}
          setTime={mockSetTime}
          completedPomodoros={2}
          setCompletedPomodoros={mockSetCompletedPomodoros}
        />,
      );

      await user.click(screen.getByText("Reset 🍅"));
      expect(mockSetCompletedPomodoros).toHaveBeenCalledWith(0);
    });
  });
});
