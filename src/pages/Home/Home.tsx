import Hero from "../../components/Hero/Hero"
import WhyVisit from "../../components/WhyVisit/WhyVisit"
import Testimonials from "../../components/Testimonials/Testimonials"
import WhyChoose from "../../components/WhyChoose/WhyChoose"
import InsurancePayment from "../../components/InsurancePayment/InsurancePayment"
import DentalGame from "@/components/DentalGame/DentalGame"
import ContactInfoHome from "@/components/ContactInfoHome/ContactInfoHome"

const Home = () => {
  return (
    <>
      <Hero />
      <ContactInfoHome/>
      <InsurancePayment />
      <WhyVisit />
      <Testimonials />
      <WhyChoose />
      <DentalGame/>
    </>
  )
}

export default Home
