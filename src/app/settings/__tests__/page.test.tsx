import { render, screen } from "@testing-library/react";
import SettingsPage from "../page";

describe("SettingsPage", () => {
  it("renders the settings page with title", () => {
    render(<SettingsPage />);

    // Check if title is present
    expect(screen.getByText("Settings")).toBeInTheDocument();

    // Check if placeholder text is present
    expect(
      screen.getByText("Settings page coming soon..."),
    ).toBeInTheDocument();
  });
});
