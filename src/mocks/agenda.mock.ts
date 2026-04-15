export type AgendaAppointmentStatus =
  | "Próximo"
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
    availabilityLabel: "Disponible de 10:00 a 16:00",
    appointments: [
      {
        id: "a3",
        patientId: "p3",
        time: "09:30",
        patient: "Ana Ruiz",
        treatment: "Consulta control",
        status: "Confirmado",
      },
      {
        id: "a4",
        patientId: "p4",
        time: "11:00",
        patient: "Julia Sosa",
        treatment: "Botox frente",
        status: "Reprogramado",
      },
      {
        id: "a5",
        patientId: "p5",
        time: "14:30",
        patient: "Micaela Ríos",
        treatment: "Láser vascular",
        status: "Confirmado",
      },
    ],
  },
  [agendaDateKeys.today]: {
    dateKey: agendaDateKeys.today,
    dateLabel: "Martes 14 de abril",
    availabilityLabel: "Disponible de 09:00 a 18:00",
    appointments: [
      {
        id: "a1",
        patientId: "p1",
        time: "10:30",
        patient: "Carla Fernández",
        treatment: "Mesoterapia facial",
        status: "Próximo",
      },
      {
        id: "a2",
        patientId: "p2",
        time: "11:15",
        patient: "Laura Pérez",
        treatment: "Peeling suave",
        status: "Esperando",
      },
      {
        id: "a3",
        patientId: "p3",
        time: "12:00",
        patient: "Ana Ruiz",
        treatment: "Consulta control",
        status: "Confirmado",
      },
      {
        id: "a4",
        patientId: "p4",
        time: "13:30",
        patient: "Julia Sosa",
        treatment: "Botox frente",
        status: "Confirmado",
      },
      {
        id: "a5",
        patientId: "p5",
        time: "15:00",
        patient: "Micaela Ríos",
        treatment: "Láser vascular",
        status: "Pendiente",
      },
    ],
  },
  [agendaDateKeys.tomorrow]: {
    dateKey: agendaDateKeys.tomorrow,
    dateLabel: "Miércoles 15 de abril",
    availabilityLabel: "Disponible de 09:30 a 17:30",
    appointments: [
      {
        id: "a1",
        patientId: "p1",
        time: "09:45",
        patient: "Carla Fernández",
        treatment: "Mesoterapia facial",
        status: "Confirmado",
      },
      {
        id: "a2",
        patientId: "p2",
        time: "11:00",
        patient: "Laura Pérez",
        treatment: "Peeling suave",
        status: "Confirmado",
      },
      {
        id: "a3",
        patientId: "p3",
        time: "12:30",
        patient: "Ana Ruiz",
        treatment: "Consulta control",
        status: "Próximo",
      },
      {
        id: "a5",
        patientId: "p5",
        time: "16:00",
        patient: "Micaela Ríos",
        treatment: "Láser vascular",
        status: "Pendiente",
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
