export type TodayHeroState =
  | "session_in_progress"
  | "payment_pending"
  | "ready_to_start"
  | "upcoming_turn"
  | "day_complete";

export type TodayHeroEvent = {
  id: string;
  state: TodayHeroState;
  turnId?: string;
  patientId?: string;
  patient?: string;
  treatment?: string;
  timeLabel: string;
  statusLabel: string;
  contextLine: string;
};

export type TodayPendingKind =
  | "payment"
  | "receipt"
  | "consent"
  | "waiting"
  | "session";

export type TodayPendingItem = {
  id: string;
  kind: TodayPendingKind;
  title: string;
  reference: string;
  subtitle: string;
  actionLabel: string;
  targetPath: string;
  receiptDetails?: {
    treatment: string;
    sessionTime: string;
    totalLabel: string;
    paymentBreakdown: string;
  };
};

export type TodayAgendaStatus =
  | "Hechos"
  | "Confirmado"
  | "Por llegar"
  | "Esperando"
  | "Pendiente"
  | "En curso";

export type TodayAgendaItem = {
  id: string;
  time: string;
  patient: string;
  treatment: string;
  status: TodayAgendaStatus;
  targetPath: string;
};

export type TodayMock = {
  doctorName: string;
  clinicName: string;
  heroEvents: TodayHeroEvent[];
  pendingItems: TodayPendingItem[];
  agendaItems: TodayAgendaItem[];
};

export const todayMock: TodayMock = {
  doctorName: "Brenda Mansilla",
  clinicName: "Consultorio Melendez",
  heroEvents: [
    {
      id: "hero-payment-a2",
      state: "payment_pending",
      turnId: "a2",
      patientId: "p2",
      patient: "Laura Pérez",
      treatment: "Full face con bioestimulador",
      timeLabel: "10:00",
      statusLabel: "Cobro pendiente",
      contextLine: "Sesión recién cerrada · $250.000 por cobrar",
    },
    {
      id: "hero-upcoming-a3",
      state: "upcoming_turn",
      turnId: "a3",
      patientId: "p3",
      patient: "Ana Ruiz",
      treatment: "Control con radiofrecuencia",
      timeLabel: "11:00",
      statusLabel: "Próximo turno",
      contextLine: "Sigue después del cobro actual",
    },
    {
      id: "hero-empty",
      state: "day_complete",
      timeLabel: "Hoy",
      statusLabel: "Sin turnos",
      contextLine: "No quedan turnos por atender",
    },
  ],
  pendingItems: [
    {
      id: "pending-payment-a2",
      kind: "payment",
      title: "Cobro pendiente",
      reference: "Laura Pérez",
      subtitle: "10:00 · Full face con bioestimulador · $250.000",
      actionLabel: "Ir al cobro",
      targetPath: "/cobro/a2",
    },
    {
      id: "pending-receipt-a1",
      kind: "receipt",
      title: "Comprobante pendiente",
      reference: "Carla Fernández",
      subtitle: "09:00 · transferencia de $90.000 sin comprobante",
      actionLabel: "Ver cobro",
      targetPath: "/cobro/a1",
      receiptDetails: {
        treatment: "Bioestimulación facial + protector solar clínico",
        sessionTime: "09:00",
        totalLabel: "$140.000",
        paymentBreakdown: "Efectivo $50.000 · Transferencia $90.000",
      },
    },
  ],
  agendaItems: [
    {
      id: "agenda-a3",
      time: "11:00",
      patient: "Ana Ruiz",
      treatment: "Control con radiofrecuencia",
      status: "Confirmado",
      targetPath: "/turno/a3",
    },
    {
      id: "agenda-a4",
      time: "12:00",
      patient: "Julia Sosa",
      treatment: "Peeling despigmentante",
      status: "Confirmado",
      targetPath: "/turno/a4",
    },
    {
      id: "agenda-a5",
      time: "14:00",
      patient: "Micaela Ríos",
      treatment: "Láser vascular",
      status: "Pendiente",
      targetPath: "/turno/a5",
    },
    {
      id: "agenda-a6",
      time: "16:00",
      patient: "Marina López",
      treatment: "Control de relleno",
      status: "Confirmado",
      targetPath: "/turno/a6",
    },
  ],
};
