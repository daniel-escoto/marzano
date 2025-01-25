import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DebugPanel from "../DebugPanel";

// Mock the isDevEnvironment utility
jest.mock("../../_util/isDevEnvironment", () => ({
  isDevEnvironment: jest.fn(),
}));

// Import the mocked function for controlling its behavior
import { isDevEnvironment } from "../../_util/isDevEnvironment";

describe("DebugPanel", () => {
  const mockSetTime = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should not render in production mode", () => {
    (isDevEnvironment as jest.Mock).mockReturnValue(false);

    render(<DebugPanel time={300} setTime={mockSetTime} />);

    expect(screen.queryByText("Debug Panel")).not.toBeInTheDocument();
  });

  it("should render in development mode", () => {
    (isDevEnvironment as jest.Mock).mockReturnValue(true);

    render(<DebugPanel time={300} setTime={mockSetTime} />);

    expect(screen.getByText("Debug Panel")).toBeInTheDocument();
    expect(screen.getByText("-1m")).toBeInTheDocument();
    expect(screen.getByText("-30s")).toBeInTheDocument();
    expect(screen.getByText("+30s")).toBeInTheDocument();
    expect(screen.getByText("+1m")).toBeInTheDocument();
    expect(screen.getByText("Set to 5s")).toBeInTheDocument();
  });

  describe("time manipulation", () => {
    beforeEach(() => {
      (isDevEnvironment as jest.Mock).mockReturnValue(true);
    });

    it("should add time correctly", async () => {
      const user = userEvent.setup();
      render(<DebugPanel time={300} setTime={mockSetTime} />);

      await user.click(screen.getByText("+30s"));
      expect(mockSetTime).toHaveBeenCalledWith(330);

      await user.click(screen.getByText("+1m"));
      expect(mockSetTime).toHaveBeenCalledWith(360);
    });

    it("should subtract time correctly", async () => {
      const user = userEvent.setup();
      render(<DebugPanel time={300} setTime={mockSetTime} />);

      await user.click(screen.getByText("-30s"));
      expect(mockSetTime).toHaveBeenCalledWith(270);

      await user.click(screen.getByText("-1m"));
      expect(mockSetTime).toHaveBeenCalledWith(240);
    });

    it("should not allow negative time when subtracting", async () => {
      const user = userEvent.setup();
      render(<DebugPanel time={30} setTime={mockSetTime} />);

      await user.click(screen.getByText("-1m"));
      expect(mockSetTime).toHaveBeenCalledWith(0);
    });

    it("should set time to 5 seconds", async () => {
      const user = userEvent.setup();
      render(<DebugPanel time={300} setTime={mockSetTime} />);

      await user.click(screen.getByText("Set to 5s"));
      expect(mockSetTime).toHaveBeenCalledWith(5);
    });
  });
});
