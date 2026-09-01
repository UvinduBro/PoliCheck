import { describe, expect, it } from "vitest";
import { formatDate, isMoreRecent, toDate } from "../date";

describe("date formatting helpers", () => {
  it("formats an ISO date string", () => {
    expect(formatDate("2024-03-15")).toBe("15 March 2024");
  });

  it("returns 'Unknown date' for missing/invalid input", () => {
    expect(formatDate(undefined)).toBe("Unknown date");
    expect(formatDate("not-a-date")).toBe("Unknown date");
  });

  it("parses a Firestore-like Timestamp via toDate()", () => {
    const fakeTimestamp = { toDate: () => new Date("2024-01-01T00:00:00Z") } as any;
    const date = toDate(fakeTimestamp);
    expect(date?.getUTCFullYear()).toBe(2024);
  });

  it("determines which of two dates is more recent, treating missing dates as older", () => {
    expect(isMoreRecent("2024-06-01", "2023-01-01")).toBe(true);
    expect(isMoreRecent("2023-01-01", "2024-06-01")).toBe(false);
    expect(isMoreRecent("2024-06-01", undefined)).toBe(true);
    expect(isMoreRecent(undefined, "2024-06-01")).toBe(false);
  });
});
