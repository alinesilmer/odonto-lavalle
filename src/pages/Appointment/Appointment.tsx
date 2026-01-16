"use client";

import { useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PageHero from "../../components/UI/PageHero/PageHero";
import Button from "../../components/UI/Button/Button";
import Input from "../../components/UI/Input/Input";
import hero from "./../../assets/images/appointmentBG.jpg";
import styles from "./Appointment.module.scss";
import { contactInfo } from "../../data/contactInfo";

function normalizeWhatsappNumber(raw: string): string {
  // digits only, include country code (e.g. 549379xxxxxxx)
  return (raw || "").replace(/\D/g, "");
}

function openInNewTab(url: string) {
  // reliable "open once in new tab"
  const a = document.createElement("a");
  a.href = url;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function formatDateAR(d: Date) {
  // dd/mm/yyyy
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`;
}

const Appointment = () => {
  // Default: today
  const [monthCursor, setMonthCursor] = useState<Date>(() => new Date());
  const [selectedDay, setSelectedDay] = useState<Date>(() => new Date());
  const [patientName, setPatientName] = useState<string>("");

  // prevents double open on double click
  const openingRef = useRef(false);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    // Make Monday = 0 (Lu) … Sunday = 6 (Do)
    const jsFirstDay = new Date(year, month, 1).getDay(); // 0=Sun..6=Sat
    const firstDay = (jsFirstDay + 6) % 7; // 0=Mon..6=Sun
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const { firstDay, daysInMonth } = useMemo(() => getDaysInMonth(monthCursor), [monthCursor]);

  const handlePrevMonth = () => {
    setMonthCursor(new Date(monthCursor.getFullYear(), monthCursor.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setMonthCursor(new Date(monthCursor.getFullYear(), monthCursor.getMonth() + 1, 1));
  };

  const handlePickDay = (day: number) => {
    const d = new Date(monthCursor.getFullYear(), monthCursor.getMonth(), day);
    setSelectedDay(d);
  };

  const handleSubmit = () => {
    if (openingRef.current) return;
    openingRef.current = true;

    const WA_NUMBER = normalizeWhatsappNumber(contactInfo.phone || "549379401708");

    const text = [
      "🗓️ *Solicitud de turno (consulta)*",
      `*Nombre:* ${patientName.trim() || "(no ingresado)"}`,
      `*Día elegido:* ${formatDateAR(selectedDay)}`,
      "",
      "¿Está disponible este día para agendar la consulta?",
    ].join("\n");

    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
    openInNewTab(url);

    setTimeout(() => {
      openingRef.current = false;
    }, 1200);
  };

  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const dayNames = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"];

  const isSameMonth =
    selectedDay.getFullYear() === monthCursor.getFullYear() &&
    selectedDay.getMonth() === monthCursor.getMonth();

  return (
    <div className={styles.appointmentPage}>
      <PageHero
        title="SACAR TURNO"
        subtitle="Agendá tu turno fácilmente a través de nuestro sistema"
        backgroundImage={hero}
      />

      <section className={styles.appointmentSection}>
        <div className={styles.container}>
            {/* ✅ INFO MESSAGE*/}
            <div className={styles.infoBanner}>
              Hola 😊. Recordamos que los presupuestos se realizan <b>únicamente luego de la consulta clínica.</b>
              <br />
              Valor de la consulta: <b>$20.000</b>. ¡Te esperamos! 🦷✨
            </div>

            {/* ✅ NAME INPUT */}
            <div className={styles.nameCard}>
              <h3 className={styles.sectionTitle}>¿A nombre de quién es la consulta?</h3>
              <Input
                type="text"
                name="patientName"
                value={patientName}
                onChange={(e: any) => setPatientName(e.target.value)}
                placeholder="Nombre y apellido"
                required
              />
            </div>

            {/* ✅ CALENDAR (DAY ONLY) */}
            <div className={styles.calendar}>
              <div className={styles.calendarHeader}>
                <button onClick={handlePrevMonth} className={styles.navButton} type="button">
                  <ChevronLeft size={20} />
                </button>

                <h3 className={styles.monthYear}>
                  {monthNames[monthCursor.getMonth()]} {monthCursor.getFullYear()}
                </h3>

                <button onClick={handleNextMonth} className={styles.navButton} type="button">
                  <ChevronRight size={20} />
                </button>
              </div>

              <div className={styles.calendarGrid}>
                {dayNames.map((day) => (
                  <div key={day} className={styles.dayName}>
                    {day}
                  </div>
                ))}

                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`empty-${i}`} className={styles.emptyDay} />
                ))}

                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const isSelected = isSameMonth && day === selectedDay.getDate();

                  return (
                    <button
                      key={day}
                      type="button"
                      className={`${styles.day} ${isSelected ? styles.selected : ""}`}
                      onClick={() => handlePickDay(day)}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
              <Button
                variant="primary"
                size="large"
                onClick={handleSubmit}
                disabled={!patientName.trim()}
              >
                ENVIAR POR WHATSAPP
              </Button>
          </div>

          
      </section>
    </div>
  );
};

export default Appointment;
