"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { testimonials } from "../../data/testimonials"
import styles from "./Testimonials.module.scss"

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const testimonialsPerPage = 3
  const totalPages = Math.ceil(testimonials.length / testimonialsPerPage)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages)
  }

  const currentTestimonials = testimonials.slice(
    currentIndex * testimonialsPerPage,
    (currentIndex + 1) * testimonialsPerPage,
  )

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <motion.h2
          className={styles.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          ¿QUÉ OPINAN NUESTROS PACIENTES?
        </motion.h2>
        <p className={styles.subtitle}>
          Te compartimos las reseñas que nos han dejado nuestros pacientes a lo largo de nuestra trayectoria.
        </p>

        <div className={styles.carouselWrapper}>
          <button className={`${styles.navButton} ${styles.navButtonLeft}`} onClick={prevSlide} aria-label="Anterior">
            <ChevronLeft size={28} />
          </button>

          <div className={styles.carousel}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                className={styles.testimonialGrid}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
              >
                {currentTestimonials.map((testimonial) => (
                  <div key={testimonial.id} className={styles.testimonialCard}>
                    <Quote className={styles.quoteIcon} size={32} />
                    <p className={styles.testimonialText}>{testimonial.text}</p>
                    <div className={styles.testimonialAuthor}>
                      <img
                        src={testimonial.avatar || "/placeholder.svg"}
                        alt={testimonial.name}
                        className={styles.avatar}
                      />
                      <div>
                        <p className={styles.authorName}>{testimonial.name}</p>
                        <p className={styles.authorDate}>{testimonial.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          <button className={`${styles.navButton} ${styles.navButtonRight}`} onClick={nextSlide} aria-label="Siguiente">
            <ChevronRight size={28} />
          </button>
        </div>

        <div className={styles.dots}>
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              className={`${styles.dot} ${index === currentIndex ? styles.dotActive : ""}`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Ir a página ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
