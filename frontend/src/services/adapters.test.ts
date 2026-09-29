import { describe, expect, it } from "vitest";
import type { AppointmentDto, PatientDto, ReminderDto, StockItemDto } from "@odonto/shared";
import {
  APPOINTMENT_STATUS_LABEL,
  INSURANCE_LABEL,
  splitDateTime,
  toAppointmentRow,
  toPatientRow,
  toReminderRow,
  toStockRow,
} from "./adapters";

describe("splitDateTime", () => {
  // The clinic is UTC-3, so a stored instant renders three hours earlier.
  it("renders an instant in the clinic timezone, not UTC", () => {
    expect(splitDateTime("2026-03-14T13:30:00.000Z")).toEqual({
      date: "14/03/2026",
      time: "10:30",
    });
  });

  it("zero-pads single-digit days, months and times", () => {
    expect(splitDateTime("2026-01-05T12:05:00.000Z")).toEqual({
      date: "05/01/2026",
      time: "09:05",
    });
  });

  it("rolls back to the previous clinic day for an early-morning UTC instant", () => {
    expect(splitDateTime("2026-03-15T02:00:00.000Z")).toEqual({
      date: "14/03/2026",
      time: "23:00",
    });
  });

  it("degrades to placeholders instead of throwing on bad input", () => {
    expect(splitDateTime("not-a-date")).toEqual({ date: "-", time: "-" });
    expect(splitDateTime("")).toEqual({ date: "-", time: "-" });
  });
});

describe("toAppointmentRow", () => {
  const dto: AppointmentDto = {
    id: "a1",
    patientId: "p1",
    patientName: "Ana Gómez",
    startsAt: "2026-03-14T13:30:00.000Z",
    durationMinutes: 30,
    reason: "Limpieza",
    insurance: "medife",
    status: "confirmed",
    paymentStatus: "paid",
    createdAt: "2026-03-01T00:00:00.000Z",
    updatedAt: "2026-03-01T00:00:00.000Z",
  };

  it("translates status, payment and insurance to their Spanish labels", () => {
    const row = toAppointmentRow(dto);
    expect(row.status).toBe("Confirmado");
    expect(row.payment).toBe("Completo");
    expect(row.insurance).toBe("Medifé");
  });

  it("splits startsAt into the display date and time", () => {
    const row = toAppointmentRow(dto);
    expect(row.date).toBe("14/03/2026");
    expect(row.time).toBe("10:30");
  });

  it("keeps startsAt and the raw status so handlers can send updates back", () => {
    const row = toAppointmentRow(dto);
    expect(row.startsAt).toBe(dto.startsAt);
    expect(row.rawStatus).toBe("confirmed");
  });

  it("passes an unknown insurance code through unchanged", () => {
    const row = toAppointmentRow({ ...dto, insurance: "desconocida" as never });
    expect(row.insurance).toBe("desconocida");
  });

  it("covers every appointment status with a label", () => {
    expect(Object.keys(APPOINTMENT_STATUS_LABEL).sort()).toEqual([
      "cancelled",
      "completed",
      "confirmed",
      "pending",
    ]);
  });
});

describe("toPatientRow", () => {
  const dto: PatientDto = {
    id: "p1",
    uid: "p1",
    fullName: "Ana Gómez",
    dni: "30123456",
    gender: "femenino",
    email: "ana@example.com",
    phone: "3794001708",
    birthDate: "1990-05-21",
    insurance: "swiss",
    status: "active",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  };

  it("maps the API status onto the Spanish display status", () => {
    expect(toPatientRow(dto).status).toBe("Activo");
    expect(toPatientRow({ ...dto, status: "inactive" }).status).toBe("Inactivo");
  });

  it("shows a dash when the patient has never visited", () => {
    expect(toPatientRow(dto).lastVisit).toBe("-");
  });

  it("formats lastVisitAt when present", () => {
    expect(toPatientRow({ ...dto, lastVisitAt: "2026-02-09T10:00:00.000Z" }).lastVisit).toBe(
      "09/02/2026",
    );
  });

  it("labels the insurance", () => {
    expect(toPatientRow(dto).insurance).toBe(INSURANCE_LABEL.swiss);
  });
});

describe("toStockRow", () => {
  it("adds a display date without dropping any API field", () => {
    const dto: StockItemDto = {
      id: "s1",
      product: "Guantes",
      category: "Insumos",
      quantity: 12,
      unit: "Caja",
      price: 8500,
      minQuantity: 5,
      updatedAt: "2026-02-09T10:00:00.000Z",
    };

    const row = toStockRow(dto);
    expect(row.lastUpdate).toBe("09/02/2026");
    expect(row.quantity).toBe(12);
    expect(row.minQuantity).toBe(5);
    expect(row.id).toBe("s1");
  });
});

describe("toReminderRow", () => {
  it("renders dueAt as a combined date and time string", () => {
    const dto: ReminderDto = {
      id: "r1",
      title: "Llamar al proveedor",
      description: "Pedido de insumos",
      dueAt: "2026-02-09T15:45:00.000Z",
      done: false,
      createdAt: "2026-02-01T00:00:00.000Z",
    };

    const row = toReminderRow(dto);
    expect(row.time).toBe("09/02/2026 12:45");
    expect(row.done).toBe(false);
    expect(row.dueAt).toBe(dto.dueAt);
  });
});
