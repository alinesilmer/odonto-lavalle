"use client";

import { motion } from "framer-motion";
import { Award, Heart, Users, Target, CheckCircle, Star } from "lucide-react";
import Button from "../../components/UI/Button/Button";
import reason from "../../assets/images/reasons.png";
// import { goToBooking } from "../../utils/session";
import styles from "./AboutUs.module.scss";
import pfp from "../../assets/images/profile.png";

const AboutUs = () => {
  const values = [
    {
      icon: <Heart />,
      title: "Cuidado Personalizado",
      description: "Cada paciente es único y merece atención individualizada",
    },
    {
      icon: <Award />,
      title: "Excelencia Profesional",
      description: "Equipo altamente capacitado con tecnología de vanguardia",
    },
    {
      icon: <Users />,
      title: "Enfoque Familiar",
      description: "Odontología para todas las edades en un ambiente cálido",
    },
    {
      icon: <Target />,
      title: "Resultados Garantizados",
      description: "Comprometidos con tu salud bucal y tu sonrisa perfecta",
    },
  ];

  const team = [
    {
      name: "Od. Paula Cavaglia",
      role: "Directora y Odontóloga General",
      image: "https://i.pravatar.cc/300?img=20",
      specialties: ["Estética Dental", "Rehabilitación Oral"],
    },
    {
      name: "Od. Florencia",
      role: "Directora y Ortodoncista",
      image: "https://i.pravatar.cc/300?img=21",
      specialties: ["Ortodoncia", "Alineadores Invisibles"],
    },
  ];

  const achievements = [
    { number: "15+", label: "Años de Experiencia" },
    { number: "5000+", label: "Pacientes Satisfechos" },
    { number: "98%", label: "Tasa de Éxito" },
    { number: "24/7", label: "Atención de Emergencias" },
  ];

  return (
    <div className={styles.aboutUs}>
      <section className={styles.hero}>
        <motion.div
          className={styles.heroContent}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>Sobre Nosotros</h1>
          <p className={styles.subtitle}>
            Transformando sonrisas, cambiando vidas desde 2010
          </p>
          <p className={styles.description}>
            En Lavalle Odontología, creemos que una sonrisa saludable es la
            puerta a una vida plena. Nuestro equipo de profesionales altamente
            capacitados se dedica a brindar atención dental de excelencia con
            calidez humana y tecnología de vanguardia.
          </p>
        </motion.div>
      </section>

      <section className={styles.achievements}>
        <div className={styles.achievementsGrid}>
          {achievements.map((achievement, idx) => (
            <motion.div
              key={idx}
              className={styles.achievementCard}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <h2>{achievement.number}</h2>
              <p>{achievement.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className={styles.mission}>
        <div className={styles.missionContent}>
          <motion.div
            className={styles.missionText}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2>Nuestra Misión</h2>
            <p>
              Proporcionar servicios odontológicos integrales de la más alta
              calidad, utilizando tecnología avanzada y técnicas innovadoras,
              mientras creamos un ambiente cómodo y acogedor para nuestros
              pacientes.
            </p>
            <div className={styles.missionPoints}>
              <div className={styles.point}>
                <CheckCircle />
                <span>Atención personalizada y profesional</span>
              </div>
              <div className={styles.point}>
                <CheckCircle />
                <span>Tecnología de última generación</span>
              </div>
              <div className={styles.point}>
                <CheckCircle />
                <span>Tratamientos sin dolor</span>
              </div>
              <div className={styles.point}>
                <CheckCircle />
                <span>Planes de financiación accesibles</span>
              </div>
            </div>
          </motion.div>
          <motion.div
            className={styles.missionImage}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <img src={reason} alt="Dental consultation" />
          </motion.div>
        </div>
      </section>

      <section className={styles.values}>
        <h2>Nuestros Valores</h2>
        <div className={styles.valuesGrid}>
          {values.map((value, idx) => (
            <motion.div
              key={idx}
              className={styles.valueCard}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className={styles.valueIcon}>{value.icon}</div>
              <h3>{value.title}</h3>
              <p>{value.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className={styles.team}>
        <h2>Nuestro Equipo</h2>
        <p className={styles.teamIntro}>
          Profesionales apasionados comprometidos con tu salud bucal
        </p>
        <div className={styles.teamGrid}>
          {team.map((member, idx) => (
            <motion.div
              key={idx}
              className={styles.teamCard}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -10 }}
            >
              <div className={styles.teamImage}>
                <img
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                />
                <div className={styles.teamOverlay}>
                  <Star className={styles.starIcon} />
                </div>
              </div>
              <div className={styles.teamInfo}>
                <h3>{member.name}</h3>
                <p className={styles.role}>{member.role}</p>
                <div className={styles.specialties}>
                  {member.specialties.map((specialty, i) => (
                    <span key={i} className={styles.specialty}>
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className={styles.cta}>
        <motion.div
          className={styles.ctaContent}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2>¿Listo para transformar tu sonrisa?</h2>
          <p>Agenda tu consulta hoy y descubre la diferencia Lavalle</p>
          <div className={styles.ctaButtons}>
            {/*<Button variant="primary" size="large" onClick={() => goToBooking(navigate)}>
  Reservar Turno
</Button> */}
            <Button variant="primary" size="large">
              Reservar Turno
            </Button>
            <Button variant="secondary" size="large">
              Contactar
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default AboutUs;
