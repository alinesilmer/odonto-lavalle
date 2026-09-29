import { describe, expect, it } from "vitest";
import { formatPrice } from "./money";

describe("formatPrice", () => {
  it("uses Argentine thousands separators and no decimals", () => {
    expect(formatPrice(30000).replace(/\s/g, "")).toBe("$30.000");
  });
});
