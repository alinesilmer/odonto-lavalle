import { describe, expect, it } from "vitest";
import { fileKind, fileProblem, formatBytes, withType } from "./files";

describe("files", () => {
  it("formats sizes in Spanish", () => {
    expect(formatBytes(512)).toBe("512 B");
    expect(formatBytes(1536)).toBe("1,5 KB");
    expect(formatBytes(20 * 1024 * 1024)).toBe("20 MB");
  });

  it("groups types for icons", () => {
    expect(fileKind("image/png")).toBe("image");
    expect(fileKind("application/pdf")).toBe("pdf");
    expect(fileKind("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")).toBe("sheet");
  });

  it("rejects unknown types and empty files, infers a blank type from the extension", () => {
    expect(fileProblem(new File(["x"], "virus.exe", { type: "application/x-msdownload" }))).toMatch(/no admitido/);
    expect(fileProblem(new File([], "a.pdf", { type: "application/pdf" }))).toMatch(/vacío/);
    const xlsx = withType(new File(["x"], "presupuesto.xlsx"));
    expect(fileProblem(xlsx)).toBeNull();
    expect(xlsx.type).toContain("spreadsheet");
  });
});
