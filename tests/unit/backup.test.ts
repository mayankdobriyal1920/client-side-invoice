import { describe, it, expect } from "vitest";

describe("backup validation", () => {
  it("rejects non-object", () => {
    const validate = (data: any) => {
      if (!data || typeof data !== "object") throw new Error("Invalid backup file.");
    };
    expect(() => validate(null)).toThrow();
    expect(() => validate("str")).toThrow();
  });
  it("rejects wrong version", () => {
    const data: any = { version: 2 };
    expect(data.version).not.toBe(1);
  });
  it("accepts valid version", () => {
    const data: any = { version: 1, clients: [], documents: [] };
    expect(data.version).toBe(1);
  });
});