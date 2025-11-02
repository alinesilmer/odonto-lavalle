"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout/DashboardLayout";
import Button from "@/components/UI/Button/Button";
import { Send } from "lucide-react";
import { patientMessages, patientTreatment } from "../../../data/dashboardData";
import styles from "./PatientMessagesSection.module.scss";

const PatientMessages = () => {
  const [selected, setSelected] = useState(patientMessages[0]);
  const [text, setText] = useState("");

  const list = patientMessages.map(m => ({
    id: m.id,
    sender: m.sender,
    preview: m.text.length > 50 ? `${m.text.slice(0,50)}…` : m.text,
    timestamp: m.timestamp,
    isOwn: m.isOwn,
    text: m.text,
    avatar: m.avatar,
  }));

  const send = () => {
    if (!text.trim()) return;
    console.log("Send", text);
    setText("");
  };

  return (
    <DashboardLayout userType="patient" userRole="patient" userName={patientTreatment.patientName ?? "Usuario"}>
      <div className={styles.wrap}>
        <section className={styles.section}>
          <h2>MENSAJES</h2>
          <div className={styles.container}>
            <div className={styles.list}>
              {list.map(m => (
                <button key={m.id} className={`${styles.item} ${selected.id === m.id ? styles.active : ""}`} onClick={() => setSelected(m)} type="button">
                  <div className={styles.avatar}>{m.sender?.[0] ?? "?"}</div>
                  <div className={styles.preview}>
                    <h4>{m.sender}</h4>
                    <p>{m.preview}</p>
                  </div>
                  <span className={styles.time}>{m.timestamp}</span>
                </button>
              ))}
            </div>
            <div className={styles.thread}>
              <div className={styles.threadHeader}><h3>{selected.sender}</h3></div>
              <div className={styles.messages}>
                <div className={`${styles.message} ${selected.isOwn ? styles.own : ""}`}>
                  <p>{selected.text}</p>
                  <span className={styles.timestamp}>{selected.timestamp}</span>
                </div>
              </div>
              <div className={styles.inputRow}>
                <input value={text} onChange={(e)=>setText(e.target.value)} onKeyDown={(e)=>e.key==="Enter"&&send()} placeholder="Escribe un mensaje..." />
                <Button onClick={send} type="button"><Send size={18} /></Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default PatientMessages;
