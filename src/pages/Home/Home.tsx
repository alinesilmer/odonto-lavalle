import Hero from "../../components/Hero/Hero"
import WhyVisit from "../../components/WhyVisit/WhyVisit"
import Testimonials from "../../components/Testimonials/Testimonials"
import WhyChoose from "../../components/WhyChoose/WhyChoose"
import InsurancePayment from "../../components/InsurancePayment/InsurancePayment"
import DentalGame from "@/components/DentalGame/DentalGame"

const Home = () => {
  return (
    <>
      <Hero />
      <WhyVisit />
      <Testimonials />
      <WhyChoose />
      <InsurancePayment />
      <DentalGame/>
    </>
  )
}

export default Home
