import { describe, expect, it } from "vitest";
import { formatDateInput, maskDateInput, parseDateInput, parseTimeInput } from "./typedInput";

const TODAY = new Date(2026, 8, 29); // 29 Sep 2026

describe("parseDateInput", () => {
  it.each([
    ["29/09/2026", "2026-09-29"],
    ["29/9/2026", "2026-09-29"],
    ["29/9/26", "2026-09-29"],
    ["29-09-2026", "2026-09-29"],
    ["29.09.2026", "2026-09-29"],
    ["29092026", "2026-09-29"],
    ["290926", "2026-09-29"],
    ["2909", "2026-09-29"],
    ["29/09", "2026-09-29"],
    ["10/05/85", "1985-05-10"],
    ["01/01/27", "2027-01-01"],
  ])("%s → %s", (text, iso) => {
    expect(parseDateInput(text, TODAY)).toBe(iso);
  });

  it.each(["", "31/02/2026", "32/01/2026", "12/13/2026", "hola", "29/09/202", "123"])("rejects %s", (text) => {
    expect(parseDateInput(text, TODAY)).toBeNull();
  });

  it("formats a stored date for the field", () => {
    expect(formatDateInput("2026-09-29")).toBe("29/09/2026");
    expect(formatDateInput("")).toBe("");
  });
});

describe("maskDateInput", () => {
  it("adds slashes while typing digits", () => {
    expect(maskDateInput("2", "29")).toBe("29/");
    expect(maskDateInput("29/0", "29/09")).toBe("29/09/");
    expect(maskDateInput("29/09/202", "29/09/2026")).toBe("29/09/2026");
  });

  it("absorbs a slash typed right after an automatic one (06/07/2001 typed with slashes)", () => {
    let text = "";
    for (const ch of "06/07/2001") text = maskDateInput(text, text + ch);
    expect(text).toBe("06/07/2001");
    expect(parseDateInput(text, TODAY)).toBe("2001-07-06");
  });

  it.each([
    ["06072001", "06/07/2001"],
    ["6/7/2001", "6/7/2001"],
    ["06-07-2001", "06/07/2001"],
    ["29/9/26", "29/9/26"],
  ])("typing %s key by key ends as %s and parses", (keys, shown) => {
    let text = "";
    for (const ch of keys) text = maskDateInput(text, text + ch);
    expect(text).toBe(shown);
    expect(parseDateInput(text, TODAY)).not.toBeNull();
  });

  it("doesn't fight deleting or single-digit months", () => {
    expect(maskDateInput("29/", "29")).toBe("29");
    expect(maskDateInput("29/9", "29/9/")).toBe("29/9/");
  });
});

describe("parseTimeInput", () => {
  it.each([
    ["9", "09:00"],
    ["09", "09:00"],
    ["930", "09:30"],
    ["0930", "09:30"],
    ["9:30", "09:30"],
    ["9.30", "09:30"],
    ["9:3", "09:30"],
    ["14:05", "14:05"],
    ["9h", "09:00"],
    ["18 hs", "18:00"],
  ])("%s → %s", (text, time) => {
    expect(parseTimeInput(text)).toBe(time);
  });

  it.each(["", "25", "12:60", "abc", "12345"])("rejects %s", (text) => {
    expect(parseTimeInput(text)).toBeNull();
  });
});
