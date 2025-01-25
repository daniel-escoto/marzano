import { formatTime } from "../formatTime";

describe("formatTime", () => {
  it("should format time with only minutes and seconds correctly", () => {
    expect(formatTime(125)).toBe("2:05");
    expect(formatTime(60)).toBe("1:00");
    expect(formatTime(45)).toBe("0:45");
  });

  it("should pad seconds with leading zero when less than 10", () => {
    expect(formatTime(61)).toBe("1:01");
    expect(formatTime(305)).toBe("5:05");
    expect(formatTime(9)).toBe("0:09");
  });

  it("should handle zero time", () => {
    expect(formatTime(0)).toBe("0:00");
  });

  it("should format time with hours correctly", () => {
    expect(formatTime(3600)).toBe("1:00:00");
    expect(formatTime(3661)).toBe("1:01:01");
    expect(formatTime(7325)).toBe("2:02:05");
  });

  it("should handle large numbers with multiple hours", () => {
    expect(formatTime(14400)).toBe("4:00:00");
    expect(formatTime(36125)).toBe("10:02:05");
  });
});
