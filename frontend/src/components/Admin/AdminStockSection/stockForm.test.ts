import { describe, expect, it } from "vitest";
import { STOCK_TEMPLATES } from "@/data/stockTemplates";
import { EMPTY_STOCK_FORM, applyTemplate, stockFormErrors, unitOptions } from "./stockForm";

describe("stockForm", () => {
  it("fills product, category, unit and minimum from a template, keeping quantity and price", () => {
    const form = applyTemplate({ ...EMPTY_STOCK_FORM, quantity: 4, price: 900 }, STOCK_TEMPLATES[0]);
    expect(form).toMatchObject({ product: STOCK_TEMPLATES[0].product, unit: STOCK_TEMPLATES[0].unit, quantity: 4, price: 900 });
  });

  it("requires a name and a category", () => {
    expect(Object.keys(stockFormErrors(EMPTY_STOCK_FORM)).sort()).toEqual(["category", "product"]);
  });

  it("keeps a custom unit selectable when editing", () => {
    expect(unitOptions("Blíster").map((o) => o.value)).toContain("Blíster");
  });

  it("has unique template names (they are list keys)", () => {
    const names = STOCK_TEMPLATES.map((t) => t.product);
    expect(new Set(names).size).toBe(names.length);
  });
});
