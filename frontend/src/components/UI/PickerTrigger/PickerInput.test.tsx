import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import DatePicker from "../DatePicker/DatePicker";
import TimePicker from "../TimePicker/TimePicker";

afterEach(cleanup);

const type = (label: string, text: string) => {
  const input = screen.getByLabelText(label) as HTMLInputElement;
  fireEvent.focus(input);
  fireEvent.change(input, { target: { value: text } });
  fireEvent.blur(input);
  return input;
};

describe("typing into the date field", () => {
  it("saves a typed date and shows it as dd/mm/aaaa", () => {
    const onChange = vi.fn();
    render(<DatePicker name="fecha" label="Fecha" value="" onChange={onChange} />);
    const input = type("Fecha", "29/9/26");
    expect(onChange).toHaveBeenCalledWith("2026-09-29");
    expect(input.value).toBe("29/09/2026");
  });

  it("flags an impossible date instead of saving it", () => {
    const onChange = vi.fn();
    render(<DatePicker name="fecha" label="Fecha" value="" onChange={onChange} />);
    type("Fecha", "31/02/2026");
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByText(/Fecha no válida/)).toBeTruthy();
  });

  it("respects the allowed range", () => {
    const onChange = vi.fn();
    render(<DatePicker name="fecha" label="Fecha" value="" onChange={onChange} max="2026-12-31" />);
    type("Fecha", "01/01/2027");
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByText(/fuera del rango/)).toBeTruthy();
  });

  it("explains how to type it while empty, then confirms the weekday", () => {
    const { rerender } = render(<DatePicker name="fecha" label="Fecha" value="" onChange={() => {}} />);
    expect(screen.getByText(/Escribila así: 06\/07\/2001/)).toBeTruthy();
    rerender(<DatePicker name="fecha" label="Fecha" value="2001-07-06" onChange={() => {}} />);
    expect(screen.queryByText(/Escribila así/)).toBeNull();
    expect(screen.getByText(/2001/)).toBeTruthy();
  });

  it("types 06/07/2001 with its own slashes without losing the last digit", () => {
    const onChange = vi.fn();
    render(<DatePicker name="fecha" label="Fecha" value="" onChange={onChange} />);
    const input = screen.getByLabelText("Fecha") as HTMLInputElement;
    fireEvent.focus(input);
    for (const ch of "06/07/2001") fireEvent.change(input, { target: { value: input.value + ch } });
    fireEvent.blur(input);
    expect(onChange).toHaveBeenCalledWith("2001-07-06");
  });

  it("shows a date set from outside (e.g. picked in the calendar)", () => {
    render(<DatePicker name="fecha" label="Fecha" value="2026-10-01" onChange={() => {}} />);
    expect((screen.getByLabelText("Fecha") as HTMLInputElement).value).toBe("01/10/2026");
  });
});

describe("typing into the time field", () => {
  it("accepts quick formats", () => {
    const onChange = vi.fn();
    render(<TimePicker name="hora" label="Hora" value="" onChange={onChange} />);
    type("Hora", "930");
    expect(onChange).toHaveBeenCalledWith("09:30");
  });

  it("flags an impossible time", () => {
    const onChange = vi.fn();
    render(<TimePicker name="hora" label="Hora" value="" onChange={onChange} />);
    type("Hora", "25:00");
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByText(/Hora no válida/)).toBeTruthy();
  });
});
