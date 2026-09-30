import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import ToothLoader from "./ToothLoader";

describe("ToothLoader", () => {
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("announces loading to screen readers with a fixed label", () => {
    render(<ToothLoader label="Verificando tu sesión…" />);
    expect(screen.getByRole("status").textContent).toContain("Verificando tu sesión…");
  });

  it("rotates its friendly messages on the page variant", () => {
    vi.useFakeTimers();
    render(<ToothLoader />);
    const first = screen.getByRole("status").textContent;
    act(() => vi.advanceTimersByTime(2200));
    expect(screen.getByRole("status").textContent).not.toBe(first);
  });

  it("stays quiet in panels: no rotating messages, still announced", () => {
    vi.useFakeTimers();
    render(<ToothLoader variant="compact" />);
    const text = screen.getByRole("status").textContent;
    act(() => vi.advanceTimersByTime(5000));
    expect(screen.getByRole("status").textContent).toBe(text);
    expect(text).toContain("Cargando");
  });
});
