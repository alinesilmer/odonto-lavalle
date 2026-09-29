import Hero from "../../components/Hero/Hero"
import WhyVisit from "../../components/WhyVisit/WhyVisit"
import WhyChoose from "../../components/WhyChoose/WhyChoose"
import InsurancePayment from "../../components/InsurancePayment/InsurancePayment"
import DentalGame from "@/components/DentalGame/DentalGame"
import ContactInfoHome from "@/components/ContactInfoHome/ContactInfoHome"
import HomeCta from "@/components/HomeCta/HomeCta"
import PublicPage from "@/components/UI/PublicPage/PublicPage"

const Home = () => {
  return (
    <PublicPage>
      <Hero />
      <InsurancePayment />
      <WhyChoose />
      <WhyVisit />
      {/* <Testimonials /> */}
      <ContactInfoHome />
      <DentalGame />
      <HomeCta />
    </PublicPage>
  )
}

export default Home
