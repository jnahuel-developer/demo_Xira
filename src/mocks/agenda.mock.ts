import { getTodayAgendaAppointments } from "./today.mock";

export type AgendaAppointmentStatus =
  | "Próximo"
  | "Hechos"
  | "Confirmado"
  | "Esperando"
  | "En curso"
  | "Pendiente"
  | "Reprogramado";

export type AgendaAppointment = {
  id: string;
  patientId: string;
  time: string;
  patient: string;
  treatment: string;
  status: AgendaAppointmentStatus;
  requiresAttention?: boolean;
  note?: string;
};

export type AgendaDayData = {
  dateKey: string;
  dateLabel: string;
  availabilityLabel: string;
  appointments: AgendaAppointment[];
};

export const agendaDateKeys = {
  yesterday: "2026-04-13",
  today: "2026-04-14",
  tomorrow: "2026-04-15",
} as const;

export const mockNow = "10:26";

export const agendaByDate: Record<string, AgendaDayData> = {
  [agendaDateKeys.yesterday]: {
    dateKey: agendaDateKeys.yesterday,
    dateLabel: "Lunes 13 de abril",
    availabilityLabel: "Disponible de 09:00 a 13:00 y de 14:00 a 18:00",
    appointments: [
      {
        id: "a3",
        patientId: "p3",
        time: "09:00",
        patient: "Florencia Vidal",
        treatment: "Limpieza profunda",
        status: "Confirmado",
      },
      {
        id: "a4",
        patientId: "p4",
        time: "10:00",
        patient: "Rocío Gómez",
        treatment: "Peeling suave",
        status: "Reprogramado",
      },
      {
        id: "a5",
        patientId: "p5",
        time: "11:00",
        patient: "Ana Ruiz",
        treatment: "Consulta control",
        status: "Confirmado",
      },
      {
        id: "a6",
        patientId: "p6",
        time: "12:00",
        patient: "Julia Sosa",
        treatment: "Botox frente",
        status: "Confirmado",
      },
      {
        id: "a7",
        patientId: "p7",
        time: "14:00",
        patient: "Micaela Ríos",
        treatment: "Láser vascular",
        status: "Confirmado",
      },
      {
        id: "a8",
        patientId: "p8",
        time: "16:00",
        patient: "Natalia Acosta",
        treatment: "Relleno de labios",
        status: "Confirmado",
      },
    ],
  },
  [agendaDateKeys.today]: {
    dateKey: agendaDateKeys.today,
    dateLabel: "Martes 14 de abril",
    availabilityLabel: "Disponible de 09:00 a 13:00 y de 14:00 a 18:00",
    appointments: [
      {
        id: "a1",
        patientId: "p1",
        time: "09:00",
        patient: "Carla Fernández",
        treatment: "Bioestimulación facial",
        status: "Hechos",
      },
      {
        id: "a2",
        patientId: "p2",
        time: "10:00",
        patient: "Laura Pérez",
        treatment: "Full face con bioestimulador",
        status: "Hechos",
        requiresAttention: true,
        note: "Sesión cerrada · cobro pendiente",
      },
      {
        id: "a3",
        patientId: "p3",
        time: "11:00",
        patient: "Ana Ruiz",
        treatment: "Control con radiofrecuencia",
        status: "Próximo",
      },
      {
        id: "a4",
        patientId: "p4",
        time: "12:00",
        patient: "Julia Sosa",
        treatment: "Peeling despigmentante",
        status: "Confirmado",
      },
      {
        id: "a5",
        patientId: "p5",
        time: "14:00",
        patient: "Micaela Ríos",
        treatment: "Láser vascular",
        status: "Pendiente",
      },
      {
        id: "a6",
        patientId: "p6",
        time: "16:00",
        patient: "Marina López",
        treatment: "Control de relleno",
        status: "Confirmado",
      },
    ],
  },
  [agendaDateKeys.tomorrow]: {
    dateKey: agendaDateKeys.tomorrow,
    dateLabel: "Miércoles 15 de abril",
    availabilityLabel: "Disponible de 09:00 a 13:00 y de 14:00 a 18:00",
    appointments: [
      {
        id: "a1",
        patientId: "p1",
        time: "09:00",
        patient: "Carla Fernández",
        treatment: "Mesoterapia facial",
        status: "Confirmado",
      },
      {
        id: "a2",
        patientId: "p2",
        time: "10:00",
        patient: "Laura Pérez",
        treatment: "Peeling suave",
        status: "Confirmado",
      },
      {
        id: "a3",
        patientId: "p3",
        time: "11:00",
        patient: "Ana Ruiz",
        treatment: "Consulta control",
        status: "Confirmado",
      },
      {
        id: "a4",
        patientId: "p4",
        time: "12:00",
        patient: "Julia Sosa",
        treatment: "Botox frente",
        status: "Confirmado",
      },
      {
        id: "a5",
        patientId: "p5",
        time: "14:00",
        patient: "Micaela Ríos",
        treatment: "Láser vascular",
        status: "Pendiente",
      },
      {
        id: "a6",
        patientId: "p6",
        time: "16:00",
        patient: "Marina López",
        treatment: "Control post relleno",
        status: "Confirmado",
      },
    ],
  },
};

function formatDateLabel(dateKey: string) {
  const date = new Date(`${dateKey}T12:00:00`);

  if (Number.isNaN(date.getTime())) {
    return dateKey;
  }

  const weekday = new Intl.DateTimeFormat("es-AR", {
    weekday: "long",
  }).format(date);
  const month = new Intl.DateTimeFormat("es-AR", {
    month: "long",
  }).format(date);

  return `${weekday.charAt(0).toUpperCase()}${weekday.slice(1)} ${date.getDate()} de ${month}`;
}

export function getAgendaDay(dateKey: string): AgendaDayData {
  const existing = agendaByDate[dateKey];

  if (dateKey === agendaDateKeys.today && existing) {
    return {
      ...existing,
      appointments: getTodayAgendaAppointments(),
    };
  }

  if (existing) {
    return existing;
  }

  return {
    dateKey,
    dateLabel: formatDateLabel(dateKey),
    availabilityLabel: "Sin disponibilidad",
    appointments: [],
  };
}
