import { render, screen, fireEvent } from "@testing-library/react";
import SettingsPage from "../page";

describe("SettingsPage", () => {
  const renderPage = () => render(<SettingsPage />);

  beforeEach(() => {
    // Mock window.confirm
    window.confirm = jest.fn();
    // Mock window.location.reload
    const reloadFn = jest.fn();
    Object.defineProperty(window, "location", {
      value: { reload: reloadFn },
      writable: true,
    });
    // Clear localStorage before each test
    localStorage.clear();
  });

  const testUI = () => {
    renderPage();

    // Check if title is present
    expect(screen.getByText("Settings")).toBeInTheDocument();

    // Check if clear data section is present
    expect(screen.getByText("Clear Data")).toBeInTheDocument();
    expect(
      screen.getByText(
        "This will reset all your progress and settings. This action cannot be undone.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveTextContent("Clear All Data");
  };

  const testClearData = async (shouldConfirm: boolean) => {
    // Set some test data in localStorage
    localStorage.setItem("test-key", "test-value");
    (window.confirm as jest.Mock).mockReturnValue(shouldConfirm);

    renderPage();

    // Click the clear data button
    fireEvent.click(screen.getByText("Clear All Data"));

    // Check if confirmation was shown
    expect(window.confirm).toHaveBeenCalledWith(
      "Are you sure you want to clear all data? This action cannot be undone.",
    );

    if (shouldConfirm) {
      // Check if localStorage was cleared
      expect(localStorage.getItem("test-key")).toBeNull();
      // Check if page reload was triggered
      expect(window.location.reload).toHaveBeenCalled();
    } else {
      // Check if localStorage was not cleared
      expect(localStorage.getItem("test-key")).toBe("test-value");
      // Check if page reload was not triggered
      expect(window.location.reload).not.toHaveBeenCalled();
    }
  };

  it("renders the settings page with clear data section", () => testUI());

  it("shows confirmation dialog and clears data when confirmed", () =>
    testClearData(true));

  it("does not clear data when confirmation is cancelled", () =>
    testClearData(false));
});
