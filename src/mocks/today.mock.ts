export type TodayPendingKind = "consent" | "payment" | "session";

export type TodayPendingItem = {
  id: string;
  title: string;
  subtitle?: string;
  action: string;
  kind: TodayPendingKind;
  relatedId: string;
};

export type TodayUpcomingItem = {
  id: string;
  time: string;
  patient: string;
  treatment: string;
  status: "Confirmado" | "Por llegar" | "Esperando";
  relatedId: string;
};

export type TodayMock = {
  doctorName: string;
  clinicName: string;
  hero: {
    turnId: string;
    patientId: string;
    time: string;
    patient: string;
    treatment: string;
    statusLabel: string;
    lastSessionLabel: string;
  };
  pendingItems: TodayPendingItem[];
  upcomingItems: TodayUpcomingItem[];
};

export const todayMock: TodayMock = {
  doctorName: "Dra. Martina López",
  clinicName: "Consultorio Martina López",
  hero: {
    turnId: "a1",
    patientId: "p1",
    time: "10:30",
    patient: "Carla Fernández",
    treatment: "Mesoterapia facial",
    statusLabel: "En 18 min",
    lastSessionLabel: "Última sesión hace 28 días",
  },
  pendingItems: [
    {
      id: "p1",
      title: "Consentimiento pendiente",
      subtitle: "Carla Fernández",
      action: "Resolver",
      kind: "consent",
      relatedId: "a1",
    },
    {
      id: "p2",
      title: "Cobro pendiente",
      subtitle: "Laura Pérez",
      action: "Cobrar",
      kind: "payment",
      relatedId: "a2",
    },
    {
      id: "p3",
      title: "Turno sin cerrar",
      subtitle: "Ayer 18:40",
      action: "Cerrar",
      kind: "session",
      relatedId: "a5",
    },
  ],
  upcomingItems: [
    {
      id: "u1",
      time: "11:15",
      patient: "Laura Pérez",
      treatment: "Peeling suave",
      status: "Confirmado",
      relatedId: "a2",
    },
    {
      id: "u2",
      time: "12:00",
      patient: "Ana Ruiz",
      treatment: "Consulta control",
      status: "Confirmado",
      relatedId: "a3",
    },
    {
      id: "u3",
      time: "13:30",
      patient: "Julia Sosa",
      treatment: "Botox frente",
      status: "Por llegar",
      relatedId: "a4",
    },
  ],
};
