import { Router } from "express";
import type { StatsChartsDto, StatsSummaryDto } from "@odonto/shared";
import { collections, db } from "../config/firebase.js";
import { asyncHandler } from "../lib/async.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";
import { appointmentsCol } from "../services/appointments.service.js";
import { dayBounds, monthBounds, todayIsoDate, yearStart } from "../lib/dates.js";
import { num } from "../lib/firestore.js";

export const statsRouter = Router();
statsRouter.use(requireAuth, requireAdmin);

const MONTHS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

statsRouter.get(
  "/summary",
  asyncHandler(async (_req, res) => {
    const today = dayBounds(todayIsoDate());
    const month = monthBounds();

    const [todaySnap, monthSnap, patientsSnap, stockSnap] = await Promise.all([
      appointmentsCol()
        .where("startsAt", ">=", today.start)
        .where("startsAt", "<", today.end)
        .count()
        .get(),
      appointmentsCol()
        .where("startsAt", ">=", month.start)
        .where("startsAt", "<", month.end)
        .count()
        .get(),
      db.collection(collections.patients).where("status", "==", "active").count().get(),
      db.collection(collections.stock).get(),
    ]);

    const body: StatsSummaryDto = {
      appointmentsToday: todaySnap.data().count,
      appointmentsThisMonth: monthSnap.data().count,
      activePatients: patientsSnap.data().count,
      lowStockItems: stockSnap.docs.filter(
        (doc) => num(doc.get("quantity")) <= num(doc.get("minQuantity")),
      ).length,
    };
    res.json(body);
  }),
);

statsRouter.get(
  "/charts",
  asyncHandler(async (_req, res) => {
    const snap = await appointmentsCol().where("startsAt", ">=", yearStart()).get();

    const byMonth = new Array<number>(12).fill(0);
    const byStatus = new Map<string, number>();
    const byReason = new Map<string, number>();

    const bump = (map: Map<string, number>, key: string) =>
      map.set(key, (map.get(key) ?? 0) + 1);

    for (const doc of snap.docs) {
      const at = (doc.get("startsAt") as FirebaseFirestore.Timestamp).toDate();
      byMonth[at.getUTCMonth()] += 1;
      bump(byStatus, String(doc.get("status")));
      bump(byReason, String(doc.get("reason")));
    }

    const body: StatsChartsDto = {
      appointmentsByMonth: byMonth.map((value, i) => ({ label: MONTHS[i]!, value })),
      appointmentsByStatus: [...byStatus].map(([label, value]) => ({ label, value })),
      topReasons: [...byReason]
        .map(([label, value]) => ({ label, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5),
    };
    res.json(body);
  }),
);
