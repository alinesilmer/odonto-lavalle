/** Every path the router knows, so no component spells a URL by hand. */
export const ROUTES = {
  home: "/",
  contact: "/contacto",
  about: "/nosotros",
  services: "/servicios",
  login: "/login",
  register: "/registro",
  booking: "/turno",
  notFound: "/not-found",

  admin: {
    root: "/dashboard/admin",
    appointments: "/dashboard/admin/turnos",
    patients: "/dashboard/admin/pacientes",
    stock: "/dashboard/admin/stock",
    charts: "/dashboard/admin/estadisticas",
    reminders: "/dashboard/admin/recordatorios",
    content: "/dashboard/admin/contenido",
    support: "/dashboard/admin/soporte",
    config: "/dashboard/admin/configuracion",
    patientHistory: (id: string) => `/dashboard/admin/pacientes/${id}/historia`,
    patientTreatment: (id: string) => `/dashboard/admin/pacientes/${id}/tratamiento`,
  },

  patient: {
    root: "/dashboard/paciente",
    home: "/dashboard/paciente/inicio",
    appointments: "/dashboard/paciente/turnos",
    treatment: "/dashboard/paciente/tratamiento",
    history: "/dashboard/paciente/historia",
    support: "/dashboard/paciente/soporte",
    config: "/dashboard/paciente/configuracion",
  },
} as const;

/** Where a user lands right after signing in. */
export const HOME_FOR_ROLE = {
  admin: ROUTES.admin.root,
  patient: ROUTES.patient.home,
} as const;
