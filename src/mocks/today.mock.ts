import type { TurnFlowState } from "./turnFlow.mock";
import { resetTurnFlow } from "./turnFlow.mock";

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
  turnId: string;
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

export type TodayAgendaAppointmentRuntime = {
  id: string;
  patientId: string;
  time: string;
  patient: string;
  treatment: string;
  status: "Próximo" | "Hechos" | "Confirmado" | "Esperando" | "Pendiente" | "En curso";
  requiresAttention?: boolean;
  note?: string;
};

type DayStage =
  | "done_paid"
  | "receipt_pending"
  | "payment_pending"
  | "upcoming_confirmed"
  | "upcoming_pending"
  | "active";

type DayTurnRuntime = {
  id: string;
  patientId: string;
  patient: string;
  treatment: string;
  time: string;
  scheduledKind: "confirmed" | "pending";
  stage: DayStage;
  flowState?: TurnFlowState;
  receiptDetails?: TodayPendingItem["receiptDetails"];
};

const TODAY_TURN_IDS = ["a1", "a2", "a3", "a4", "a5", "a6"] as const;

const DOCTOR_NAME = "Brenda Mansilla";
const CLINIC_NAME = "Consultorio Melendez";

function createInitialRuntime() {
  return new Map<string, DayTurnRuntime>([
    [
      "a1",
      {
        id: "a1",
        patientId: "p1",
        patient: "Carla Fernández",
        treatment: "Bioestimulación facial",
        time: "09:00",
        scheduledKind: "confirmed",
        stage: "receipt_pending",
        receiptDetails: {
          treatment: "Bioestimulación facial + protector solar clínico",
          sessionTime: "09:00",
          totalLabel: "$140.000",
          paymentBreakdown: "Efectivo $50.000 · Transferencia $90.000",
        },
      },
    ],
    [
      "a2",
      {
        id: "a2",
        patientId: "p2",
        patient: "Laura Pérez",
        treatment: "Full face con bioestimulador",
        time: "10:00",
        scheduledKind: "confirmed",
        stage: "payment_pending",
      },
    ],
    [
      "a3",
      {
        id: "a3",
        patientId: "p3",
        patient: "Ana Ruiz",
        treatment: "Control con radiofrecuencia",
        time: "11:00",
        scheduledKind: "confirmed",
        stage: "upcoming_confirmed",
      },
    ],
    [
      "a4",
      {
        id: "a4",
        patientId: "p4",
        patient: "Julia Sosa",
        treatment: "Peeling despigmentante",
        time: "12:00",
        scheduledKind: "confirmed",
        stage: "upcoming_confirmed",
      },
    ],
    [
      "a5",
      {
        id: "a5",
        patientId: "p5",
        patient: "Micaela Ríos",
        treatment: "Láser vascular",
        time: "14:00",
        scheduledKind: "pending",
        stage: "upcoming_pending",
      },
    ],
    [
      "a6",
      {
        id: "a6",
        patientId: "p6",
        patient: "Marina López",
        treatment: "Control de relleno",
        time: "16:00",
        scheduledKind: "confirmed",
        stage: "upcoming_confirmed",
      },
    ],
  ]);
}

let runtimeByTurnId = createInitialRuntime();

function cloneRuntime(runtime: DayTurnRuntime) {
  return {
    ...runtime,
    receiptDetails: runtime.receiptDetails ? { ...runtime.receiptDetails } : undefined,
  };
}

function sortedRuntime() {
  return [...runtimeByTurnId.values()]
    .map(cloneRuntime)
    .sort((left, right) => left.time.localeCompare(right.time));
}

function nextUpcomingRuntime(items: DayTurnRuntime[]) {
  return items.find(
    (item) =>
      item.stage === "upcoming_confirmed" || item.stage === "upcoming_pending"
  );
}

function deriveHero(items: DayTurnRuntime[]): TodayHeroEvent {
  const inProgress = items.find(
    (item) => item.stage === "active" && item.flowState === "IN_PROGRESS"
  );

  if (inProgress) {
    return {
      id: `hero-${inProgress.id}`,
      state: "session_in_progress",
      turnId: inProgress.id,
      patientId: inProgress.patientId,
      patient: inProgress.patient,
      treatment: inProgress.treatment,
      timeLabel: inProgress.time,
      statusLabel: "Sesión en curso",
      contextLine: "Sesión iniciada y todavía sin cerrar",
    };
  }

  const paymentPending = items.find((item) => item.stage === "payment_pending");

  if (paymentPending) {
    return {
      id: `hero-${paymentPending.id}`,
      state: "payment_pending",
      turnId: paymentPending.id,
      patientId: paymentPending.patientId,
      patient: paymentPending.patient,
      treatment: paymentPending.treatment,
      timeLabel: paymentPending.time,
      statusLabel: "Cobro pendiente",
      contextLine: "Sesión cerrada y lista para cobrar",
    };
  }

  const activeReady = items.find((item) => item.stage === "active");

  if (activeReady) {
    return {
      id: `hero-${activeReady.id}`,
      state: "ready_to_start",
      turnId: activeReady.id,
      patientId: activeReady.patientId,
      patient: activeReady.patient,
      treatment: activeReady.treatment,
      timeLabel: activeReady.time,
      statusLabel: "Turno abierto",
      contextLine:
        activeReady.flowState === "CONSENT_REQUIRED"
          ? "Consentimiento sin registrar"
          : activeReady.flowState === "BEFORE_PHOTO_OPTIONAL"
            ? "Foto inicial pendiente"
            : "Faltan pasos para cerrar la sesión",
    };
  }

  const upcoming = nextUpcomingRuntime(items);

  if (upcoming) {
    return {
      id: `hero-${upcoming.id}`,
      state: "upcoming_turn",
      turnId: upcoming.id,
      patientId: upcoming.patientId,
      patient: upcoming.patient,
      treatment: upcoming.treatment,
      timeLabel: upcoming.time,
      statusLabel: "Próximo turno",
      contextLine:
        upcoming.stage === "upcoming_pending"
          ? "Turno pendiente de confirmar"
          : "Sigue después del paso actual",
    };
  }

  return {
    id: "hero-empty",
    state: "day_complete",
    timeLabel: "Hoy",
    statusLabel: "Sin turnos",
    contextLine: "No quedan turnos por atender",
  };
}

function buildPendingItems(items: DayTurnRuntime[]): TodayPendingItem[] {
  return items.reduce<TodayPendingItem[]>((acc, item) => {
    if (item.stage === "payment_pending") {
      acc.push(
        {
          id: `pending-payment-${item.id}`,
          kind: "payment" as const,
          title: "Cobro pendiente",
          reference: item.patient,
          subtitle: `${item.time} · ${item.treatment}`,
          actionLabel: "Ir al cobro",
          targetPath: `/cobro/${item.id}`,
          turnId: item.id,
        },
      );
      return acc;
    }

    if (item.stage === "receipt_pending" && item.receiptDetails) {
      acc.push(
        {
          id: `pending-receipt-${item.id}`,
          kind: "receipt" as const,
          title: "Comprobante pendiente",
          reference: item.patient,
          subtitle: `${item.time} · transferencia pendiente de respaldo`,
          actionLabel: "Resolver",
          targetPath: `/cobro/${item.id}`,
          turnId: item.id,
          receiptDetails: { ...item.receiptDetails },
        },
      );
      return acc;
    }

    if (item.stage === "active" && item.flowState === "IN_PROGRESS") {
      acc.push(
        {
          id: `pending-session-${item.id}`,
          kind: "session" as const,
          title: "Sesión en curso",
          reference: item.patient,
          subtitle: `${item.time} · ${item.treatment}`,
          actionLabel: "Reanudar",
          targetPath: `/turno/${item.id}`,
          turnId: item.id,
        },
      );
      return acc;
    }

    return acc;
  }, []);
}

function buildTodayAgendaItems(items: DayTurnRuntime[]): TodayAgendaItem[] {
  return items
    .filter(
      (item) =>
        item.stage === "upcoming_confirmed" ||
        item.stage === "upcoming_pending" ||
        item.stage === "active"
    )
    .map((item) => ({
      id: `agenda-${item.id}`,
      time: item.time,
      patient: item.patient,
      treatment: item.treatment,
      status:
        item.stage === "active" && item.flowState === "IN_PROGRESS"
          ? "En curso"
          : item.stage === "upcoming_pending"
            ? "Pendiente"
            : "Confirmado",
      targetPath: `/turno/${item.id}`,
    }));
}

export function getTodayAgendaAppointments(): TodayAgendaAppointmentRuntime[] {
  const items = sortedRuntime();
  const upcoming = nextUpcomingRuntime(items);

  return items.map((item) => {
    if (item.stage === "done_paid") {
      return {
        id: item.id,
        patientId: item.patientId,
        time: item.time,
        patient: item.patient,
        treatment: item.treatment,
        status: "Hechos",
      };
    }

    if (item.stage === "receipt_pending") {
      return {
        id: item.id,
        patientId: item.patientId,
        time: item.time,
        patient: item.patient,
        treatment: item.treatment,
        status: "Hechos",
        requiresAttention: true,
        note: "Transferencia sin comprobante",
      };
    }

    if (item.stage === "payment_pending") {
      return {
        id: item.id,
        patientId: item.patientId,
        time: item.time,
        patient: item.patient,
        treatment: item.treatment,
        status: "Hechos",
        requiresAttention: true,
        note: "Sesión cerrada · cobro pendiente",
      };
    }

    if (item.stage === "active") {
      return {
        id: item.id,
        patientId: item.patientId,
        time: item.time,
        patient: item.patient,
        treatment: item.treatment,
        status: item.flowState === "IN_PROGRESS" ? "En curso" : "Esperando",
      };
    }

    return {
      id: item.id,
      patientId: item.patientId,
      time: item.time,
      patient: item.patient,
      treatment: item.treatment,
      status:
        upcoming?.id === item.id
          ? "Próximo"
          : item.stage === "upcoming_pending"
            ? "Pendiente"
            : "Confirmado",
    };
  });
}

export function getTodayScreenMock(): TodayMock {
  const items = sortedRuntime();

  return {
    doctorName: DOCTOR_NAME,
    clinicName: CLINIC_NAME,
    heroEvents: [deriveHero(items)],
    pendingItems: buildPendingItems(items),
    agendaItems: buildTodayAgendaItems(items),
  };
}

export function syncTodayTurnFlow(turnId: string, state: TurnFlowState) {
  const current = runtimeByTurnId.get(turnId);
  if (!current) {
    return;
  }

  if (current.stage === "done_paid" || current.stage === "receipt_pending") {
    return;
  }

  if (state === "IN_PROGRESS") {
    runtimeByTurnId.set(turnId, {
      ...current,
      stage: "active",
      flowState: state,
    });
    return;
  }

  if (state === "PAYMENT_REQUIRED") {
    runtimeByTurnId.set(turnId, {
      ...current,
      stage: "payment_pending",
      flowState: state,
    });
    return;
  }

  if (
    state === "CONSENT_REQUIRED" ||
    state === "BEFORE_PHOTO_OPTIONAL" ||
    state === "AFTER_PHOTO_OPTIONAL" ||
    state === "PUBLIC_NOTE_OPTIONAL" ||
    state === "PRIVATE_NOTE_OPTIONAL"
  ) {
    runtimeByTurnId.set(turnId, {
      ...current,
      stage: "active",
      flowState: state,
    });
  }
}

export function completeTodayCharge(input: {
  turnId?: string;
  totalLabel: string;
  paymentBreakdown: string;
  productsLabel?: string;
  hasTransfer: boolean;
}) {
  if (!input.turnId) {
    return;
  }

  const current = runtimeByTurnId.get(input.turnId);
  if (!current) {
    return;
  }

  runtimeByTurnId.set(input.turnId, {
    ...current,
    stage: input.hasTransfer ? "receipt_pending" : "done_paid",
    flowState: undefined,
    receiptDetails: input.hasTransfer
      ? {
          treatment: input.productsLabel
            ? `${current.treatment} + ${input.productsLabel}`
            : current.treatment,
          sessionTime: current.time,
          totalLabel: input.totalLabel,
          paymentBreakdown: input.paymentBreakdown,
        }
      : undefined,
  });
}

export function resolveTodayReceipt(turnId: string) {
  const current = runtimeByTurnId.get(turnId);
  if (!current) {
    return;
  }

  runtimeByTurnId.set(turnId, {
    ...current,
    stage: "done_paid",
    receiptDetails: undefined,
  });
}

export function resetTodaySimulation() {
  runtimeByTurnId = createInitialRuntime();
  TODAY_TURN_IDS.forEach((turnId) => resetTurnFlow(turnId));
  return getTodayScreenMock();
}
