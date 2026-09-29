/** Walkthroughs shown on the two support screens. */
import { BarChart3, Bell, Calendar, FileText, Package, Settings, User, Users } from "lucide-react";
import type { SupportTopic } from "@/components/Support/types";

export const ADMIN_SUPPORT_TOPICS: SupportTopic[] = [
  {
    id: "turnos",
    title: "Turnos",
    summary: "Filtrá y creá turnos rápidamente.",
    details: [
      "Usá las tarjetas de filtros para elegir mes, semana y hora.",
      "Agregá un turno con el botón principal y completá los datos.",
      "Desde la tabla, podés ver, editar o cancelar un turno.",
    ],
    icon: Calendar,
  },
  {
    id: "pacientes",
    title: "Pacientes",
    summary: "Buscá, visualizá y editá la ficha del paciente.",
    details: [
      "Utilizá la barra de búsqueda para filtrar por nombre o DNI.",
      "Abrí el modal de detalle para ver información completa.",
      "Editá datos y guardá cambios desde las acciones de la tabla.",
    ],
    icon: Users,
  },
  {
    id: "stock",
    title: "Gestión de Stock",
    summary: "Controlá insumos, precios y unidades.",
    details: [
      "Usá 'Añadir Stock' para crear nuevos registros.",
      "Editá cantidad, unidad y precio desde el modal de edición.",
      "Seleccioná filas para acciones masivas si es necesario.",
    ],
    icon: Package,
  },
  {
    id: "estadisticas",
    title: "Estadísticas",
    summary: "Visualizá indicadores clave del negocio.",
    details: [
      "Elegí la métrica desde el panel lateral.",
      "Abrí el editor para filtrar por mes y año.",
      "Interpretá los ejes para comparar semanas del mes.",
    ],
    icon: BarChart3,
  },
  {
    id: "recordatorios",
    title: "Recordatorios",
    summary: "Creá recordatorios y seguí tus pendientes.",
    details: [
      "Usá 'Agregar recordatorio' para programar un evento.",
      "Los cards muestran los días restantes para el evento.",
      "Editá o eliminá recordatorios desde su tarjeta.",
    ],
    icon: Bell,
  },
  {
    id: "configuracion",
    title: "Configuración",
    summary: "Ajustes de tu cuenta.",
    details: [
      "Actualizá tu nombre visible.",
      "Cambiá tu contraseña desde Seguridad.",
    ],
    icon: Settings,
  },
];

export const PATIENT_SUPPORT_TOPICS: SupportTopic[] = [
  {
    id: "turnos",
    title: "Turnos",
    summary: "Sacá y gestioná tus turnos en segundos.",
    details: [
      "Ingresá a Mis Turnos para ver próximos y anteriores.",
      "Seleccioná fecha y hora disponibles y confirmá la reserva.",
      "Podés reprogramar o cancelar desde la tarjeta del turno.",
    ],
    icon: Calendar,
  },
  {
    id: "tratamiento",
    title: "Mi Tratamiento",
    summary: "Seguimiento del plan y progreso.",
    details: [
      "Revisá el plan de tratamiento y su progreso.",
      "Consultá condiciones y medicación vigentes.",
      "Verificá próximas sesiones relacionadas.",
    ],
    icon: FileText,
  },
  {
    id: "historia",
    title: "Historia Clínica",
    summary: "Toda tu historia ordenada por fecha.",
    details: [
      "Entrá a Historia Clínica para ver consultas y procedimientos.",
      "Buscá por título, diagnóstico o notas.",
      "Consultá los adjuntos de cada consulta.",
    ],
    icon: FileText,
  },
  {
    id: "configuracion",
    title: "Configuración",
    summary: "Actualizá tus datos y tu contraseña.",
    details: [
      "Editá datos personales, contacto y obra social.",
      "Cambiá tu contraseña desde Seguridad.",
      "Guardá los cambios antes de salir.",
    ],
    icon: Settings,
  },
  {
    id: "perfil",
    title: "Mi Perfil",
    summary: "Foto, nombre visible y datos de contacto.",
    details: [
      "Actualizá tu foto de perfil.",
      "Asegurate de que nombre y teléfono sean correctos.",
      "El email y el DNI identifican tu cuenta y no se editan acá.",
    ],
    icon: User,
  },
];
