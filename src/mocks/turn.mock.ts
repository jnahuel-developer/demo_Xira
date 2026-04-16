export type TurnStatus =
  | "consent_pending"
  | "ready_to_start"
  | "in_progress"
  | "ready_to_close"
  | "closed_pending_payment";

export type TurnMock = {
  id: string;
  time: string;
  patient: string;
  treatment: string;
  status: TurnStatus;
  durationMin: number;
  lastSessionLabel: string;
  previousSettingsLabel?: string;
  requiredEquipmentLabel?: string;
  usefulObservation?: string;
  step: {
    title: string;
    description: string;
    primaryAction: string;
    secondaryAction?: string;
  };
};

const turnMocks: Record<string, TurnMock> = {
  a1: {
    id: "a1",
    time: "09:00",
    patient: "Carla Fernández",
    treatment: "Bioestimulación facial",
    status: "closed_pending_payment",
    durationMin: 60,
    lastSessionLabel: "Hace 28 días",
    previousSettingsLabel: "Bioestimulación suave · Duración 60 min",
    usefulObservation: "Paciente con piel sensible",
    step: {
      title: "Ir al cobro",
      description:
        "La sesión ya fue realizada. Podés revisar el cobro registrado o el comprobante pendiente.",
      primaryAction: "Ir al cobro",
      secondaryAction: "Volver a Hoy",
    },
  },
  a2: {
    id: "a2",
    time: "10:00",
    patient: "Laura Pérez",
    treatment: "Full face con bioestimulador",
    status: "closed_pending_payment",
    durationMin: 60,
    lastSessionLabel: "Hace 21 días",
    previousSettingsLabel: "Bioestimulador facial · Duración 60 min",
    usefulObservation: "Sesión recién cerrada",
    step: {
      title: "Ir al cobro",
      description:
        "La sesión ya fue cerrada. Ahora podés registrar el pago o agendar el siguiente turno.",
      primaryAction: "Ir al cobro",
      secondaryAction: "Agendar próximo turno",
    },
  },
  a3: {
    id: "a3",
    time: "11:00",
    patient: "Ana Ruiz",
    treatment: "Control con radiofrecuencia",
    status: "ready_to_start",
    durationMin: 60,
    lastSessionLabel: "Hace 14 días",
    usefulObservation: "Comparar con respuesta al último control",
    step: {
      title: "Iniciar sesión",
      description:
        "El consentimiento ya está resuelto. Podés revisar la referencia previa o empezar ahora.",
      primaryAction: "Iniciar sesión",
      secondaryAction: "Ver ficha",
    },
  },
  a4: {
    id: "a4",
    time: "12:00",
    patient: "Julia Sosa",
    treatment: "Peeling despigmentante",
    status: "ready_to_start",
    durationMin: 60,
    lastSessionLabel: "Hace 35 días",
    previousSettingsLabel: "Peeling despigmentante · 60 min",
    usefulObservation: "Revisar fotos previas antes de iniciar",
    step: {
      title: "Iniciar sesión",
      description:
        "El turno está confirmado. Podés registrar el consentimiento y continuar.",
      primaryAction: "Iniciar sesión",
      secondaryAction: "Ver ficha",
    },
  },
  a5: {
    id: "a5",
    time: "14:00",
    patient: "Micaela Ríos",
    treatment: "Láser vascular",
    status: "consent_pending",
    durationMin: 60,
    lastSessionLabel: "Hace 42 días",
    previousSettingsLabel: "Láser medio · 60 min",
    requiredEquipmentLabel: "Equipo láser VascuLite",
    usefulObservation: "Tratamiento con equipo requerido",
    step: {
      title: "Registrar consentimiento",
      description:
        "Antes de iniciar la sesión, confirmá el consentimiento informado.",
      primaryAction: "Registrar consentimiento",
      secondaryAction: "Ya fue registrado",
    },
  },
  a6: {
    id: "a6",
    time: "16:00",
    patient: "Marina López",
    treatment: "Control de relleno",
    status: "ready_to_start",
    durationMin: 60,
    lastSessionLabel: "Hace 30 días",
    usefulObservation: "Revisar simetría y evolución del volumen",
    step: {
      title: "Iniciar sesión",
      description:
        "El turno está confirmado. Podés registrar el consentimiento y continuar.",
      primaryAction: "Iniciar sesión",
      secondaryAction: "Ver ficha",
    },
  },
};

export function turnMockById(id?: string): TurnMock {
  if (id && turnMocks[id]) return turnMocks[id];
  return turnMocks.a1;
}
