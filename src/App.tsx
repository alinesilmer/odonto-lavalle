import { Suspense, lazy, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate 
} from "react-router-dom";
import Header from "./components/UI/Header/Header";
import Footer from "./components/UI/Footer/Footer";
const Home = lazy(() => import("./pages/Home/Home"));
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
const Services = lazy(() => import("./pages/Services/Services"));
const Appointment = lazy(() => import("./pages/Appointment/Appointment"));
const ContactPage = lazy(() => import("./pages/ContactPage/ContactPage"));
const PatientDashboard = lazy(() => import("./pages/PatientDashboard/PatientDashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard/AdminDashboard"));
import AdminStatsSection from "./components/Admin/AdminStatsSection/AdminStatsSection";
import AdminAppointmentsSection from "./components/Admin/AdminAppointmentSection/AdminAppointmentsSection";
import AdminUsersSection from "./components/Admin/AdminUsersSection/AdminUsersSection";
import AdminStockSection from "./components/Admin/AdminStockSection/AdminStockSection";
import AdminChartsSection from "./components/Admin/AdminChartsSection/AdminChartsSection";
import AdminRemindersSection from "./components/Admin/AdminRemindersSection/AdminRemindersSection";
const AboutUs = lazy(() => import("./pages/AboutUs/AboutUs"));
const NotFound = lazy(() => import("./pages/NotFound/NotFound"));
import ScrollToHash from "./utils/ScrollToHash";
import "./styles/globals.scss";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  useEffect(() => {
    const run = (cb: () => void) => {
      const w = window as any;
      if (w.requestIdleCallback) w.requestIdleCallback(cb);
      else setTimeout(cb, 1);
    };
    run(() => {
      import("./pages/Services/Services");
      import("./pages/ContactPage/ContactPage");
      import("./pages/AboutUs/AboutUs");
    });
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <ScrollToHash />
      <div className="app">
        <Header />
        <main>
          <Suspense fallback={<div className="page-loader" />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/not-found" element={<NotFound />} />
              <Route path="/contacto" element={<ContactPage />} />
              <Route path="/nosotros" element={<AboutUs />} />
              <Route path="/servicios" element={<Services />} />
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Register />} /> 
              <Route path="/turno" element={<Appointment />} />
              <Route path="/dashboard/paciente" element={<PatientDashboard />} />
              <Route path="*" element={<NotFound />} />

               {/* ADMIN */}
      <Route path="/dashboard/admin" element={<AdminDashboard />}>
        <Route index element={<AdminStatsSection />} />
        <Route path="turnos" element={<AdminAppointmentsSection />} />
        <Route path="pacientes" element={<AdminUsersSection />} />
        <Route path="stock" element={<AdminStockSection />} />
        <Route path="estadisticas" element={<AdminChartsSection />} />
        <Route path="recordatorios" element={<AdminRemindersSection />} />
        <Route path="mensajes" element={<div>Mensajes</div>} />
        <Route path="pagos" element={<div>Pagos</div>} />
        <Route path="*" element={<Navigate to="." replace />} />
      </Route>
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
