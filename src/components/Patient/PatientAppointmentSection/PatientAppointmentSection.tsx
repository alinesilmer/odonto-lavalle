"use client";

import { useMemo, useState } from "react";
import {
  Calendar,
  CheckCircle2,
  Clock3,
  XCircle,
  Eye,
  Download,
  X,
  Filter,
  Plus,
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout/DashboardLayout";
import DataTable from "@/components/DataTable/DataTable";
import { patientAppointments as seed, patientTreatment } from "../../../data/dashboardData";
import styles from "./PatientAppointmentSection.module.scss";

type Row = {
  id: string;
  date: string;
  time: string;
  reason: string;
  insurance: string;
  payment: string;
  status: "Completado" | "Pendiente" | "Cancelado";
  receipt?: string;
};

type Filters = {
  q: string;
  estado: "" | "Completado" | "Pendiente" | "Cancelado";
  pago: "" | "Completo" | "Pendiente" | "Cancelado";
  obra: string;
};

const columns = [
  { key: "date", label: "Fecha" },
  { key: "time", label: "Hora" },
  { key: "reason", label: "Motivo" },
  { key: "insurance", label: "Obra Social" },
  { key: "payment", label: "Pago" },
  { key: "status", label: "Estado" },
];

const PatientAppointments = () => {
  const [rows, setRows] = useState<Row[]>(
    (seed as any[]).map((r, i) => ({ id: r.id ?? String(i + 1), ...r }))
  );
  const [filters, setFilters] = useState<Filters>({ q: "", estado: "", pago: "", obra: "" });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showFilter, setShowFilter] = useState(false);
  const [showRequest, setShowRequest] = useState(false);
  const [showCancel, setShowCancel] = useState<{ open: boolean; ids: string[] }>({ open: false, ids: [] });

  const stats = useMemo(() => {
    const completed = rows.filter(a => a.status === "Completado").length;
    const pending = rows.filter(a => a.status === "Pendiente").length;
    const cancelled = rows.filter(a => a.status === "Cancelado").length;
    return { completed, pending, cancelled };
  }, [rows]);

  const filteredData = useMemo(() => {
    const q = filters.q.trim().toLowerCase();
    return rows.filter(r => {
      const matchQ =
        !q ||
        r.date.toLowerCase().includes(q) ||
        r.time.toLowerCase().includes(q) ||
        r.reason.toLowerCase().includes(q) ||
        r.insurance.toLowerCase().includes(q) ||
        r.payment.toLowerCase().includes(q) ||
        r.status.toLowerCase().includes(q);
      const matchE = !filters.estado || r.status === filters.estado;
      const matchP = !filters.pago || r.payment === filters.pago;
      const matchO = !filters.obra || r.insurance.toLowerCase().includes(filters.obra.toLowerCase());
      return matchQ && matchE && matchP && matchO;
    });
  }, [rows, filters]);

  const openCancelSelected = () => {
    if (selectedIds.length === 0) return;
    setShowCancel({ open: true, ids: selectedIds });
  };
  const openCancelSingle = (id: string) => setShowCancel({ open: true, ids: [id] });

  const confirmCancel = (reason: string) => {
    void reason;
    setRows(prev => prev.map(r => (showCancel.ids.includes(r.id) ? { ...r, status: "Cancelado" } : r)));
    setSelectedIds([]);
    setShowCancel({ open: false, ids: [] });
  };

  const submitRequest = (p: { date: string; time: string; reason: string; insurance: string }) => {
    const id = String(Date.now());
    setRows(prev => [
      {
        id,
        date: p.date,
        time: p.time,
        reason: p.reason || "Consulta",
        insurance: p.insurance || "PARTICULAR",
        payment: "Pendiente",
        status: "Pendiente",
      },
      ...prev,
    ]);
    setShowRequest(false);
  };

  return (
    <DashboardLayout
      userType="patient"
      userRole="patient"
      userName={patientTreatment.patientName ?? "Usuario"}
    >
      <div className={styles.page}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
          </div>
          <div className={styles.headerRight}>
            <button
              className={`${styles.tile} ${selectedIds.length === 0 ? styles.tileDisabled : ""}`}
              onClick={openCancelSelected}
              disabled={selectedIds.length === 0}
              type="button"
            >
              <XCircle size={26} />
              <span>Cancelar Turno</span>
            </button>
            <button className={styles.primaryBtn} onClick={() => setShowRequest(true)} type="button">
              Solicitar Turno
            </button>
          </div>
        </div>

        <div className={styles.kpis}>
          <div className={styles.kpi}>
            <div className={styles.kpiIcon}><CheckCircle2 size={20} /></div>
            <div className={styles.kpiMain}>{stats.completed}</div>
            <div className={styles.kpiLabel}>Completos</div>
          </div>
          <div className={styles.kpi}>
            <div className={styles.kpiIcon}><Clock3 size={20} /></div>
            <div className={styles.kpiMain}>{stats.pending}</div>
            <div className={styles.kpiLabel}>Pendientes</div>
          </div>
          <div className={styles.kpi}>
            <div className={styles.kpiIcon}><XCircle size={20} /></div>
            <div className={styles.kpiMain}>{stats.cancelled}</div>
            <div className={styles.kpiLabel}>Cancelados</div>
          </div>

          <div className={styles.tools}>
            <button className={styles.filterBtn} onClick={() => setShowFilter(true)} type="button">
              <Filter size={16} />
              Filtrar
            </button>
            <input
              className={styles.search}
              placeholder="Buscar turno…"
              value={filters.q}
              onChange={e => setFilters(prev => ({ ...prev, q: e.target.value }))}
            />
          </div>
        </div>

        <div className={styles.tableCard}>
          <DataTable
            columns={columns}
            data={filteredData}
            selectable
            onSelectionChange={(ids: string[]) => setSelectedIds(ids)}
            actions={[
              { icon: <Eye />, label: "Ver", onClick: (row: Row) => { void row; } },
              { icon: <Download />, label: "Descargar", onClick: (row: Row) => { void row; } },
              { icon: <X />, label: "Cancelar", onClick: (row: Row) => openCancelSingle(row.id) },
            ]}
          />
        </div>
      </div>

      {showFilter && (
        <>
          <div className={styles.modalOverlay} onClick={() => setShowFilter(false)} />
          <div className={styles.modalWrap}>
            <div className={styles.modal}>
              <div className={styles.modalHead}>
                <h4>Filtrar Turnos</h4>
                <button className={styles.iconBtn} onClick={() => setShowFilter(false)} type="button">
                  <X size={16} />
                </button>
              </div>
              <div className={styles.modalBody}>
                <div className={styles.field}>
                  <label>Estado</label>
                  <select
                    value={filters.estado}
                    onChange={e => setFilters(prev => ({ ...prev, estado: e.target.value as Filters["estado"] }))}
                  >
                    <option value="">Todos</option>
                    <option value="Completado">Completado</option>
                    <option value="Pendiente">Pendiente</option>
                    <option value="Cancelado">Cancelado</option>
                  </select>
                </div>
                <div className={styles.field}>
                  <label>Pago</label>
                  <select
                    value={filters.pago}
                    onChange={e => setFilters(prev => ({ ...prev, pago: e.target.value as Filters["pago"] }))}
                  >
                    <option value="">Todos</option>
                    <option value="Completo">Completo</option>
                    <option value="Pendiente">Pendiente</option>
                    <option value="Cancelado">Cancelado</option>
                  </select>
                </div>
                <div className={styles.field}>
                  <label>Obra Social</label>
                  <input
                    placeholder="Galeno, Medifé, Particular…"
                    value={filters.obra}
                    onChange={e => setFilters(prev => ({ ...prev, obra: e.target.value }))}
                  />
                </div>
              </div>
              <div className={styles.modalFoot}>
                <button
                  className={styles.ghostBtn}
                  onClick={() => setFilters({ q: "", estado: "", pago: "", obra: "" })}
                  type="button"
                >
                  Limpiar
                </button>
                <button className={styles.primaryBtn} onClick={() => setShowFilter(false)} type="button">
                  Aplicar
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {showRequest && (
        <>
          <div className={styles.modalOverlay} onClick={() => setShowRequest(false)} />
          <div className={styles.modalWrap}>
            <div className={styles.modal}>
              <div className={styles.modalHead}>
                <h4>Solicitar Turno</h4>
                <button className={styles.iconBtn} onClick={() => setShowRequest(false)} type="button">
                  <X size={16} />
                </button>
              </div>
              <RequestForm onSubmit={submitRequest} onCancel={() => setShowRequest(false)} />
            </div>
          </div>
        </>
      )}

      {showCancel.open && (
        <>
          <div className={styles.modalOverlay} onClick={() => setShowCancel({ open: false, ids: [] })} />
          <div className={styles.modalWrap}>
            <div className={styles.modal}>
              <div className={styles.modalHead}>
                <h4>Cancelar Turno</h4>
                <button className={styles.iconBtn} onClick={() => setShowCancel({ open: false, ids: [] })} type="button">
                  <X size={16} />
                </button>
              </div>
              <CancelForm
                count={showCancel.ids.length}
                onConfirm={(reason) => confirmCancel(reason)}
                onCancel={() => setShowCancel({ open: false, ids: [] })}
              />
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

const RequestForm = ({
  onSubmit,
  onCancel,
}: {
  onSubmit: (p: { date: string; time: string; reason: string; insurance: string }) => void;
  onCancel: () => void;
}) => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("Consulta");
  const [insurance, setInsurance] = useState("PARTICULAR");
  return (
    <>
      <div className={styles.modalBody}>
        <div className={styles.field}>
          <label>Fecha</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        </div>
        <div className={styles.field}>
          <label>Hora</label>
          <input type="time" value={time} onChange={e => setTime(e.target.value)} />
        </div>
        <div className={styles.field}>
          <label>Motivo</label>
          <input value={reason} onChange={e => setReason(e.target.value)} />
        </div>
        <div className={styles.field}>
          <label>Obra Social</label>
          <input value={insurance} onChange={e => setInsurance(e.target.value)} />
        </div>
      </div>
      <div className={styles.modalFoot}>
        <button className={styles.ghostBtn} onClick={onCancel} type="button">Cancelar</button>
        <button
          className={styles.primaryBtn}
          onClick={() => onSubmit({ date, time, reason, insurance })}
          disabled={!date || !time}
          type="button"
        >
          <Plus size={16} />
          Confirmar
        </button>
      </div>
    </>
  );
};

const CancelForm = ({
  count,
  onConfirm,
  onCancel,
}: {
  count: number;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
}) => {
  const [reason, setReason] = useState("");
  return (
    <>
      <div className={styles.modalBody}>
        <p className={styles.note}>Se cancelará{count > 1 ? "n" : ""} {count} turno{count > 1 ? "s" : ""}.</p>
        <div className={styles.field}>
          <label>Motivo</label>
          <input placeholder="Escribí el motivo" value={reason} onChange={e => setReason(e.target.value)} />
        </div>
      </div>
      <div className={styles.modalFoot}>
        <button className={styles.ghostBtn} onClick={onCancel} type="button">Volver</button>
        <button className={styles.dangerBtn} onClick={() => onConfirm(reason)} disabled={!reason.trim()} type="button">
          Confirmar
        </button>
      </div>
    </>
  );
};

export default PatientAppointments;
