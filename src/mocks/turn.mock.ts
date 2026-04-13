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
    time: "10:30",
    patient: "Carla Fernández",
    treatment: "Mesoterapia facial",
    status: "consent_pending",
    lastSessionLabel: "Hace 28 días",
    previousSettingsLabel: "Intensidad media · Duración 20 min",
    requiredEquipmentLabel: "Hydrafacial H2",
    usefulObservation: "Paciente con piel sensible",
    step: {
      title: "Registrar consentimiento",
      description:
        "Antes de iniciar la sesión, confirmá el consentimiento informado.",
      primaryAction: "Registrar consentimiento",
      secondaryAction: "Ya fue registrado",
    },
  },
  a2: {
    id: "a2",
    time: "11:15",
    patient: "Laura Pérez",
    treatment: "Peeling suave",
    status: "closed_pending_payment",
    lastSessionLabel: "Hace 21 días",
    previousSettingsLabel: "Peeling suave · Duración 15 min",
    usefulObservation: "Paciente esperando en sala",
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
    time: "12:00",
    patient: "Ana Ruiz",
    treatment: "Consulta control",
    status: "ready_to_start",
    lastSessionLabel: "Hace 14 días",
    usefulObservation: "Revisar evolución de última consulta",
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
    time: "13:30",
    patient: "Julia Sosa",
    treatment: "Botox frente",
    status: "in_progress",
    lastSessionLabel: "Hace 35 días",
    previousSettingsLabel: "Botox frente · 18 min",
    usefulObservation: "Comparar con fotos previas",
    step: {
      title: "Sesión en curso",
      description:
        "Mantené esta vista simple. Agregá una nota o una foto si hace falta y cerrá cuando termines.",
      primaryAction: "Cerrar sesión",
      secondaryAction: "Agregar nota",
    },
  },
  a5: {
    id: "a5",
    time: "15:00",
    patient: "Micaela Ríos",
    treatment: "Láser vascular",
    status: "ready_to_close",
    lastSessionLabel: "Hace 42 días",
    previousSettingsLabel: "Láser medio · 25 min",
    requiredEquipmentLabel: "Equipo láser VascuLite",
    usefulObservation: "Tratamiento con equipo requerido",
    step: {
      title: "Cerrar sesión",
      description:
        "La atención está lista para cerrar. Revisá si querés dejar alguna nota final antes de continuar.",
      primaryAction: "Cerrar sesión",
      secondaryAction: "Agregar nota final",
    },
  },
};

export function turnMockById(id?: string): TurnMock {
  if (id && turnMocks[id]) return turnMocks[id];
  return turnMocks.a1;
}