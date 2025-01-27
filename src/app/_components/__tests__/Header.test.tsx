import { render, screen } from "@testing-library/react";
import Header from "../Header";

// Mock the usePathname hook
jest.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

describe("Header", () => {
  it("renders the header with logo and settings link", () => {
    render(<Header />);

    // Check if logo is present
    expect(screen.getByText("Marzano")).toBeInTheDocument();

    // Check if settings link is present
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });
});
