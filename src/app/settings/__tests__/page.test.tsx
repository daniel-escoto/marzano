import { render, screen } from "@testing-library/react";
import SettingsPage from "../page";

// Mock the TRPCReactProvider
jest.mock("../../../trpc/react", () => ({
  TRPCReactProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

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
