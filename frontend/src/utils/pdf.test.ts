import { describe, expect, it } from "vitest";
import { pdfFilename } from "./pdf";

describe("pdfFilename", () => {
  it("names the file after the patient and the day", () => {
    expect(pdfFilename("Ficha", "Aliné Silva", new Date(2026, 8, 29))).toBe("Ficha-Aliné-Silva-2026-09-29.pdf");
  });

  it("drops characters file systems reject", () => {
    expect(pdfFilename("Ficha", 'Ana/María: "Test"', new Date(2026, 0, 5))).toBe("Ficha-AnaMaría-Test-2026-01-05.pdf");
  });
});
