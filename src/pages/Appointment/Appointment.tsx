"use client";

import type React from "react";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Bell, Upload } from "lucide-react";
import PageHero from "../../components/PageHero/PageHero";
import Button from "../../components/UI/Button/Button";
import hero from "./../../assets/images/appointmentBG.jpg";
import styles from "./Appointment.module.scss";

const Appointment = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2020, 9, 15));
  const [selectedTime, setSelectedTime] = useState<string>("14:20");
  const [notification, setNotification] = useState(true);
  const [file, setFile] = useState<File | null>(null);

  const times = ["09:30", "13:45", "14:20", "15:00", "17:00"];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    return { firstDay, daysInMonth };
  };

  const { firstDay, daysInMonth } = getDaysInMonth(selectedDate);

  const handlePrevMonth = () => {
    setSelectedDate(
      new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setSelectedDate(
      new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1)
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    console.log("Appointment:", {
      selectedDate,
      selectedTime,
      notification,
      file,
    });
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

  return (
    <div className={styles.appointmentPage}>
      <PageHero
        title="SACAR TURNO"
        subtitle="Agendá tu turno fácilmente a través de nuestro sistema"
        backgroundImage={hero}
      />

      <section className={styles.appointmentSection}>
        <div className={styles.container}>
          <div className={styles.leftPanel}>
            <div className={styles.calendar}>
              <div className={styles.calendarHeader}>
                <button onClick={handlePrevMonth} className={styles.navButton}>
                  <ChevronLeft size={20} />
                </button>
                <h3 className={styles.monthYear}>
                  {monthNames[selectedDate.getMonth()]}{" "}
                  {selectedDate.getFullYear()}
                </h3>
                <button onClick={handleNextMonth} className={styles.navButton}>
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
                  const isSelected = day === selectedDate.getDate();
                  return (
                    <button
                      key={day}
                      className={`${styles.day} ${
                        isSelected ? styles.selected : ""
                      }`}
                      onClick={() =>
                        setSelectedDate(
                          new Date(
                            selectedDate.getFullYear(),
                            selectedDate.getMonth(),
                            day
                          )
                        )
                      }
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className={styles.programmingCard}>
              <h4 className={styles.programmingTitle}>Programación</h4>
              <div className={styles.appointmentItem}>
                <div className={styles.appointmentInfo}>
                  <p className={styles.appointmentDate}>
                    16.12.2020 9:15 AM - 9:30 AM
                  </p>
                  <div className={styles.notificationBadge}>
                    <Bell size={16} />
                    <span>Notifícame por: 1 día</span>
                    <button className={styles.toggleNotification}>
                      <div
                        className={`${styles.toggle} ${
                          notification ? styles.active : ""
                        }`}
                        onClick={() => setNotification(!notification)}
                      >
                        <div className={styles.toggleCircle} />
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.rightPanel}>
            <div className={styles.timeSelection}>
              <h3 className={styles.sectionTitle}>Elegí una hora</h3>
              <div className={styles.timeList}>
                {times.map((time) => (
                  <button
                    key={time}
                    className={`${styles.timeButton} ${
                      selectedTime === time ? styles.selected : ""
                    }`}
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.fileUpload}>
              <h3 className={styles.sectionTitle}>Adjuntar comprobante</h3>
              <label className={styles.uploadLabel}>
                <input
                  type="file"
                  accept=".pdf,.jpg,.png"
                  onChange={handleFileChange}
                  className={styles.fileInput}
                />
                <div className={styles.uploadBox}>
                  <Upload size={40} />
                  <p>{file ? file.name : "Subir archivo PDF"}</p>
                </div>
              </label>
            </div>

<div className={styles.bookButton}>
            <Button variant="primary" onClick={handleSubmit}>
              AGENDAR
            </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Appointment;
