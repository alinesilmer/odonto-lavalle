import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
// import Login from "./pages/Login/Login";
// import Register from "./pages/Register/Register";
import Services from "./pages/Services/Services";
import Appointment from "./pages/Appointment/Appointment";
import ContactPage from "./pages/ContactPage/ContactPage";
import PatientDashboard from "./pages/PatientDashboard/PatientDashboard";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import AboutUs from "./pages/AboutUs/AboutUs";
import NotFound from "./pages/NotFound/NotFound";
import "./styles/globals.scss";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="app">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/not-found" element={<NotFound />} />
            <Route path="/contacto" element={<ContactPage />} />
            <Route path="/nosotros" element={<AboutUs />} />
            <Route path="/servicios" element={<Services />} />
            {/* <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Register />} /> */}
            <Route path="/turno" element={<Appointment />} />
            <Route path="/dashboard/paciente" element={<PatientDashboard />} />
            <Route path="/dashboard/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
