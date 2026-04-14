import { turnMockById } from "./turn.mock";

export type TurnFlowState =
  | "CONSENT_REQUIRED"
  | "BEFORE_PHOTO_OPTIONAL"
  | "IN_PROGRESS"
  | "AFTER_PHOTO_OPTIONAL"
  | "PUBLIC_NOTE_OPTIONAL"
  | "PRIVATE_NOTE_OPTIONAL"
  | "PAYMENT_REQUIRED";

export type OptionalCaptureStatus = "pending" | "done" | "skipped";

export type TurnFlowRuntime = {
  turnId: string;
  patient: string;
  treatment: string;
  durationSeconds: number;
  slotLabel: string;
  observation?: string;
  state: TurnFlowState;
  secondsLeft: number;
  canCloseSession: boolean;
  consentTaken: boolean;
  beforePhotoStatus: OptionalCaptureStatus;
  afterPhotoStatus: OptionalCaptureStatus;
  publicNoteStatus: OptionalCaptureStatus;
  privateNoteStatus: OptionalCaptureStatus;
  publicNoteText?: string;
  privateNoteText?: string;
};

const runtimeByTurnId = new Map<string, TurnFlowRuntime>();

function addMinute(time: string) {
  const [hour, minute] = time.split(":").map(Number);
  const total = hour * 60 + minute + 1;
  const nextHour = Math.floor(total / 60)
    .toString()
    .padStart(2, "0");
  const nextMinute = (total % 60).toString().padStart(2, "0");

  return `${nextHour}:${nextMinute}`;
}

export function getInitialTurnFlow(turnId?: string): TurnFlowRuntime {
  const turn = turnMockById(turnId);

  return {
    turnId: turn.id,
    patient: turn.patient,
    treatment: turn.treatment,
    durationSeconds: 60,
    slotLabel: `${turn.time} - ${addMinute(turn.time)}`,
    observation: turn.usefulObservation,
    state: "CONSENT_REQUIRED",
    secondsLeft: 60,
    canCloseSession: false,
    consentTaken: false,
    beforePhotoStatus: "pending",
    afterPhotoStatus: "pending",
    publicNoteStatus: "pending",
    privateNoteStatus: "pending",
    publicNoteText: "",
    privateNoteText: "",
  };
}

export function normalizeTurnFlow(runtime: TurnFlowRuntime): TurnFlowRuntime {
  const canCloseSession =
    runtime.state === "IN_PROGRESS" && runtime.secondsLeft <= 30;

  return {
    ...runtime,
    secondsLeft: Math.max(runtime.secondsLeft, 0),
    canCloseSession,
  };
}

export function getTurnFlow(turnId?: string): TurnFlowRuntime {
  const initial = getInitialTurnFlow(turnId);
  const existing = runtimeByTurnId.get(initial.turnId);

  if (existing) {
    return normalizeTurnFlow({ ...existing });
  }

  runtimeByTurnId.set(initial.turnId, initial);
  return { ...initial };
}

export function saveTurnFlow(runtime: TurnFlowRuntime): TurnFlowRuntime {
  const normalized = normalizeTurnFlow(runtime);
  runtimeByTurnId.set(normalized.turnId, normalized);
  return { ...normalized };
}

export function resetTurnFlow(turnId?: string): TurnFlowRuntime {
  const initial = getInitialTurnFlow(turnId);
  runtimeByTurnId.set(initial.turnId, initial);
  return { ...initial };
}
