export type AgendaAppointmentStatus =
  | "Próximo"
  | "Confirmado"
  | "Esperando"
  | "En curso"
  | "Pendiente"
  | "Reprogramado";

export type AgendaAppointment = {
  id: string;
  time: string;
  patient: string;
  treatment: string;
  status: AgendaAppointmentStatus;
  requiresAttention?: boolean;
  note?: string;
};

export type AgendaMock = {
  dateLabel: string;
  summary: {
    confirmed: number;
    waiting: number;
    pending: number;
  };
  appointments: AgendaAppointment[];
};

export const agendaMock: AgendaMock = {
  dateLabel: "Martes 14 de mayo",
  summary: {
    confirmed: 8,
    waiting: 1,
    pending: 2,
  },
  appointments: [
    {
      id: "a1",
      time: "10:30",
      patient: "Carla Fernández",
      treatment: "Mesoterapia facial",
      status: "Próximo",
    },
    {
      id: "a2",
      time: "11:15",
      patient: "Laura Pérez",
      treatment: "Peeling suave",
      status: "Esperando",
    },
    {
      id: "a3",
      time: "12:00",
      patient: "Ana Ruiz",
      treatment: "Consulta control",
      status: "Confirmado",
    },
    {
      id: "a4",
      time: "13:30",
      patient: "Julia Sosa",
      treatment: "Botox frente",
      status: "Confirmado",
    },
    {
      id: "a5",
      time: "15:00",
      patient: "Micaela Ríos",
      treatment: "Láser vascular",
      status: "Pendiente",
    },
  ],
};
