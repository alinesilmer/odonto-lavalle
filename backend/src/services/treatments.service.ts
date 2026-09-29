import type { MedicalCondition, Medication, PlannedAppointment, TimelineEntry, Tooth, TreatmentDto, TreatmentProgressDto } from "@odonto/shared";
import { EMPTY_TREATMENT_PROGRESS, ageFrom, emptyToothChart } from "@odonto/shared";
import { collections, db } from "../config/firebase.js";
import { fieldsOf, iso, list } from "../lib/firestore.js";
import { getPatientOrThrow } from "./patients.service.js";

const treatmentsCol = () => db.collection(collections.treatments);

/** Height and weight are optional, so BMI is only reported when both are known. */
function bmiOf(weightKg?: number, heightCm?: number): number | undefined {
  if (!weightKg || !heightCm) return undefined;
  const metres = heightCm / 100;
  return Math.round((weightKg / (metres * metres)) * 10) / 10;
}

/** The saved teeth over a healthy chart, so the response always has all 32. */
function withAllTeeth(saved: Tooth[]): Tooth[] {
  const byNumber = new Map(saved.map((tooth) => [tooth.number, tooth]));
  return emptyToothChart().map((tooth) => byNumber.get(tooth.number) ?? tooth);
}

const optionalNum =(value: unknown): number | undefined =>
  typeof value === "number" && Number.isFinite(value) ? value : undefined;

/**
 * A patient with no treatment record yet gets an empty one derived from their
 * profile, so the UI never has to special-case "not created".
 */
export async function getTreatment(patientId: string): Promise<TreatmentDto> {
  const patient = await getPatientOrThrow(patientId);
  const d = fieldsOf(await treatmentsCol().doc(patientId).get());

  const weightKg = optionalNum(d.weightKg);
  const heightCm = optionalNum(d.heightCm);
  const age = patient.birthDate ? ageFrom(patient.birthDate) : Number.NaN;

  return {
    patientId,
    patientName: patient.fullName,
    dni: patient.dni,
    gender: patient.gender,
    weightKg,
    heightCm,
    age: Number.isNaN(age) ? undefined : age,
    bmi: bmiOf(weightKg, heightCm),
    conditions: list<MedicalCondition>(d.conditions),
    medications: list<Medication>(d.medications),
    teeth: withAllTeeth(list<Tooth>(d.teeth)),
    timeline: list<TimelineEntry>(d.timeline),
    plannedVisits: list<PlannedAppointment>(d.plannedVisits),
    progress: { ...EMPTY_TREATMENT_PROGRESS, ...((d.progress as Partial<TreatmentProgressDto>) ?? {}) },
    updatedAt: iso(d.updatedAt),
  };
}

export async function saveTreatment(patientId: string, body: object): Promise<void> {
  await getPatientOrThrow(patientId);
  await treatmentsCol()
    .doc(patientId)
    .set({ ...body, patientId, updatedAt: new Date() }, { merge: true });
}
