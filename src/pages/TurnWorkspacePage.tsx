import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getTurnFlow,
  saveTurnFlow,
  type OptionalCaptureStatus,
  type TurnFlowRuntime,
  type TurnFlowState,
} from "../mocks/turnFlow.mock";

type ModalKind = "public" | "private" | null;

type HeroConfig = {
  chip: string;
  title: string;
  primaryAction?: string;
  secondaryAction?: string;
  singleCta?: boolean;
};

function chipClass(state: TurnFlowState, canCloseSession: boolean) {
  if (state === "PAYMENT_REQUIRED") return "turn-chip turn-chip--success";
  if (state === "IN_PROGRESS" && canCloseSession) {
    return "turn-chip turn-chip--warning";
  }
  if (state === "IN_PROGRESS") return "turn-chip turn-chip--accent";
  if (state === "CONSENT_REQUIRED") return "turn-chip turn-chip--warning";
  return "turn-chip turn-chip--primary";
}

function heroConfig(state: TurnFlowState, canCloseSession: boolean): HeroConfig {
  switch (state) {
    case "CONSENT_REQUIRED":
      return {
        chip: "Consentimiento pendiente",
        title: "Registrar el consentimiento",
        primaryAction: "Registrar consentimiento",
        singleCta: true,
      };
    case "BEFORE_PHOTO_OPTIONAL":
      return {
        chip: "Antes de iniciar",
        title: "Registrar el antes",
        primaryAction: "Tomar foto",
        secondaryAction: "Omitir",
      };
    case "IN_PROGRESS":
      return {
        chip: "Sesión en curso",
        title: "Sesión en marcha",
        primaryAction: canCloseSession ? "Cerrar sesión" : undefined,
        singleCta: true,
      };
    case "AFTER_PHOTO_OPTIONAL":
      return {
        chip: "Sesión cerrada",
        title: "Registrar el después",
        primaryAction: "Tomar foto",
        secondaryAction: "Omitir",
      };
    case "PUBLIC_NOTE_OPTIONAL":
      return {
        chip: "Sesión cerrada",
        title: "Agregar nota pública",
        primaryAction: "Tomar nota",
        secondaryAction: "Omitir",
      };
    case "PRIVATE_NOTE_OPTIONAL":
      return {
        chip: "Sesión cerrada",
        title: "Agregar nota privada",
        primaryAction: "Tomar nota",
        secondaryAction: "Omitir",
      };
    case "PAYMENT_REQUIRED":
      return {
        chip: "Lista para cobrar",
        title: "Turno finalizado",
        primaryAction: "Ir al cobro",
        secondaryAction: "Volver a Hoy",
      };
    default:
      return {
        chip: "Turno",
        title: "Continuar flujo",
      };
  }
}

function progressIndex(state: TurnFlowState) {
  switch (state) {
    case "CONSENT_REQUIRED":
      return 0;
    case "BEFORE_PHOTO_OPTIONAL":
      return 1;
    case "IN_PROGRESS":
      return 2;
    case "AFTER_PHOTO_OPTIONAL":
    case "PUBLIC_NOTE_OPTIONAL":
    case "PRIVATE_NOTE_OPTIONAL":
      return 3;
    case "PAYMENT_REQUIRED":
      return 4;
    default:
      return 0;
  }
}

function formatSeconds(secondsLeft: number) {
  const safe = Math.max(secondsLeft, 0);
  const minutes = Math.floor(safe / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (safe % 60).toString().padStart(2, "0");

  return `${minutes}:${seconds}`;
}

function summaryStatus(status: OptionalCaptureStatus) {
  switch (status) {
    case "done":
      return "Tomada";
    case "skipped":
      return "Omitida";
    case "pending":
    default:
      return "Pendiente";
  }
}

function noteStatus(status: OptionalCaptureStatus) {
  switch (status) {
    case "done":
      return "Agregada";
    case "skipped":
      return "Omitida";
    case "pending":
    default:
      return "Pendiente";
  }
}

function isAfterClosingState(state: TurnFlowState) {
  return (
    state === "AFTER_PHOTO_OPTIONAL" ||
    state === "PUBLIC_NOTE_OPTIONAL" ||
    state === "PRIVATE_NOTE_OPTIONAL" ||
    state === "PAYMENT_REQUIRED"
  );
}

export default function TurnWorkspacePage() {
  const params = useParams();
  const turnId = params.id ?? "a1";

  return <TurnWorkspacePageContent key={turnId} turnId={turnId} />;
}

function TurnWorkspacePageContent({ turnId }: { turnId: string }) {
  const navigate = useNavigate();
  const [flow, setFlow] = useState<TurnFlowRuntime>(() => getTurnFlow(turnId));
  const [modalKind, setModalKind] = useState<ModalKind>(null);
  const [draftNote, setDraftNote] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (flow.state !== "IN_PROGRESS" || flow.secondsLeft <= 0) {
      return;
    }

    const interval = window.setInterval(() => {
      setFlow((current) => {
        if (current.state !== "IN_PROGRESS") {
          return current;
        }

        return saveTurnFlow({
          ...current,
          secondsLeft: Math.max(current.secondsLeft - 1, 0),
        });
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [flow.state, flow.secondsLeft]);

  useEffect(() => {
    if (modalKind && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [modalKind]);

  const hero = heroConfig(flow.state, flow.canCloseSession);
  const currentProgress = progressIndex(flow.state);
  const progressSteps = ["Pre", "Antes", "Sesión", "Después", "Cobro"];
  const showTimer = flow.state === "IN_PROGRESS";
  const showContextCard = !isAfterClosingState(flow.state);
  const sessionSummary = useMemo(
    () => [
      { label: "Paciente", value: flow.patient },
      { label: "Tratamiento", value: flow.treatment },
      {
        label: "Foto del antes",
        value: summaryStatus(flow.beforePhotoStatus),
      },
      {
        label: "Foto del después",
        value: summaryStatus(flow.afterPhotoStatus),
      },
      {
        label: "Nota pública",
        value: noteStatus(flow.publicNoteStatus),
      },
      {
        label: "Nota privada",
        value: noteStatus(flow.privateNoteStatus),
      },
    ],
    [flow]
  );

  function updateFlow(updater: (current: TurnFlowRuntime) => TurnFlowRuntime) {
    setFlow((current) => saveTurnFlow(updater(current)));
  }

  function handlePrimaryAction() {
    switch (flow.state) {
      case "CONSENT_REQUIRED":
        updateFlow((current) => ({
          ...current,
          consentTaken: true,
          state: "BEFORE_PHOTO_OPTIONAL",
        }));
        return;
      case "BEFORE_PHOTO_OPTIONAL":
        updateFlow((current) => ({
          ...current,
          beforePhotoStatus: "done",
          state: "IN_PROGRESS",
          secondsLeft: current.durationSeconds,
          canCloseSession: false,
        }));
        return;
      case "IN_PROGRESS":
        if (!flow.canCloseSession) return;
        updateFlow((current) => ({
          ...current,
          state: "AFTER_PHOTO_OPTIONAL",
        }));
        return;
      case "AFTER_PHOTO_OPTIONAL":
        updateFlow((current) => ({
          ...current,
          afterPhotoStatus: "done",
          state: "PUBLIC_NOTE_OPTIONAL",
        }));
        return;
      case "PUBLIC_NOTE_OPTIONAL":
        setDraftNote(flow.publicNoteText ?? "");
        setModalKind("public");
        return;
      case "PRIVATE_NOTE_OPTIONAL":
        setDraftNote(flow.privateNoteText ?? "");
        setModalKind("private");
        return;
      case "PAYMENT_REQUIRED":
        navigate(`/cobro/${flow.turnId}`);
        return;
      default:
        return;
    }
  }

  function handleSecondaryAction() {
    switch (flow.state) {
      case "BEFORE_PHOTO_OPTIONAL":
        updateFlow((current) => ({
          ...current,
          beforePhotoStatus: "skipped",
          state: "IN_PROGRESS",
          secondsLeft: current.durationSeconds,
          canCloseSession: false,
        }));
        return;
      case "AFTER_PHOTO_OPTIONAL":
        updateFlow((current) => ({
          ...current,
          afterPhotoStatus: "skipped",
          state: "PUBLIC_NOTE_OPTIONAL",
        }));
        return;
      case "PUBLIC_NOTE_OPTIONAL":
        updateFlow((current) => ({
          ...current,
          publicNoteStatus: "skipped",
          state: "PRIVATE_NOTE_OPTIONAL",
        }));
        return;
      case "PRIVATE_NOTE_OPTIONAL":
        updateFlow((current) => ({
          ...current,
          privateNoteStatus: "skipped",
          state: "PAYMENT_REQUIRED",
        }));
        return;
      case "PAYMENT_REQUIRED":
        navigate("/");
        return;
      default:
        return;
    }
  }

  function closeModal() {
    setModalKind(null);
    setDraftNote("");
  }

  function saveNote() {
    const trimmed = draftNote.trim();
    if (!trimmed) return;

    if (modalKind === "public") {
      updateFlow((current) => ({
        ...current,
        publicNoteStatus: "done",
        publicNoteText: trimmed,
        state: "PRIVATE_NOTE_OPTIONAL",
      }));
    }

    if (modalKind === "private") {
      updateFlow((current) => ({
        ...current,
        privateNoteStatus: "done",
        privateNoteText: trimmed,
        state: "PAYMENT_REQUIRED",
      }));
    }

    closeModal();
  }

  return (
    <main className="turn-screen">
      <div className="turn-safe-top" />

      <section className="turn-content">
        <header className="turn-topbar">
          <button
            type="button"
            className="turn-icon-button"
            aria-label="Volver a Hoy"
            onClick={() => navigate("/")}
          >
            ‹
          </button>
        </header>

        <article
          className={`turn-card turn-card--hero ${
            flow.state === "CONSENT_REQUIRED"
              ? "turn-card--critical"
              : flow.state === "IN_PROGRESS" && flow.canCloseSession
                ? "turn-card--warm"
                : flow.state === "PAYMENT_REQUIRED"
                  ? "turn-card--success"
                  : ""
          }`.trim()}
        >
          <div className="turn-card__inner">
            <div className="turn-hero__top">
              <span className={chipClass(flow.state, flow.canCloseSession)}>
                {hero.chip}
              </span>
            </div>

            <h1 className="turn-hero__title">{hero.title}</h1>

            <div className="turn-progress" aria-label="Progreso del turno">
              {progressSteps.map((step, index) => {
                const stepClass = [
                  "turn-progress__item",
                  index < currentProgress ? "turn-progress__item--done" : "",
                  index === currentProgress ? "turn-progress__item--current" : "",
                ]
                  .join(" ")
                  .trim();

                return (
                  <div key={step} className={stepClass}>
                    <span className="turn-progress__dot" aria-hidden="true" />
                    <span className="turn-progress__label">{step}</span>
                  </div>
                );
              })}
            </div>

            {showTimer ? (
              <div className="turn-timer-block">
                <p className="turn-timer-block__label">Tiempo restante</p>
                <p className="turn-timer-block__value">
                  {formatSeconds(flow.secondsLeft)}
                </p>
              </div>
            ) : null}

            {hero.primaryAction || hero.secondaryAction ? (
              <div
                className={`turn-actions ${hero.singleCta || !hero.secondaryAction ? "turn-actions--single" : ""
                  }`.trim()}
              >
                {hero.primaryAction ? (
                  <button
                    type="button"
                    className="turn-btn turn-btn--primary"
                    onClick={handlePrimaryAction}
                  >
                    {hero.primaryAction}
                  </button>
                ) : null}

                {hero.secondaryAction ? (
                  <button
                    type="button"
                    className="turn-btn turn-btn--secondary"
                    onClick={handleSecondaryAction}
                  >
                    {hero.secondaryAction}
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>
        </article>

        <section className="turn-lower-region">
          {showContextCard ? (
            <article className="turn-card turn-card--bottom">
              <div className="turn-card__inner turn-card__inner--bottom">
                <h2 className="turn-section-title">Contexto útil</h2>

                <div className="turn-bottom-scroll">
                  <div className="turn-context-grid">
                    <div className="turn-context-item">
                      <span className="turn-context-item__label">Paciente</span>
                      <span className="turn-context-item__value">{flow.patient}</span>
                    </div>

                    <div className="turn-context-item">
                      <span className="turn-context-item__label">Tratamiento</span>
                      <span className="turn-context-item__value">{flow.treatment}</span>
                    </div>

                    {flow.observation ? (
                      <div className="turn-context-item turn-context-item--full">
                        <span className="turn-context-item__label">
                          Observación breve
                        </span>
                        <span className="turn-context-item__value">
                          {flow.observation}
                        </span>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </article>
          ) : (
            <article
              className={`turn-card turn-card--bottom ${flow.state === "PAYMENT_REQUIRED" ? "turn-card--success-soft" : ""
                }`.trim()}
            >
              <div className="turn-card__inner turn-card__inner--bottom">
                <h2 className="turn-section-title">Resumen de sesión</h2>

                <div className="turn-bottom-scroll turn-summary-list">
                  {sessionSummary.map((item) => (
                    <div key={item.label} className="turn-summary-row">
                      <span className="turn-summary-row__label">{item.label}</span>
                      <span className="turn-summary-row__value">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          )}
        </section>
      </section>

      {modalKind ? (
        <div className="turn-modal-backdrop" role="presentation">
          <div
            className="turn-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="turn-note-modal-title"
          >
            <div className="turn-modal__header">
              <div>
                <h2 id="turn-note-modal-title" className="turn-modal__title">
                  {modalKind === "public" ? "Nota pública" : "Nota privada"}
                </h2>
                <p className="turn-modal__description">
                  {modalKind === "public"
                    ? "Quedará visible en el historial clínico del paciente y para otros médicos con acceso."
                    : "Solo será visible para vos. El paciente no podrá verla."}
                </p>
              </div>

              <button
                type="button"
                className="turn-modal__close"
                aria-label="Cerrar"
                onClick={closeModal}
              >
                ×
              </button>
            </div>

            <textarea
              ref={textareaRef}
              className="turn-modal__textarea"
              placeholder={
                modalKind === "public"
                  ? "Escribí una nota pública."
                  : "Escribí una nota privada."
              }
              value={draftNote}
              onChange={(event) => setDraftNote(event.target.value)}
            />

            <div className="turn-modal__actions">
              <button
                type="button"
                className="turn-btn turn-btn--secondary"
                onClick={closeModal}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="turn-btn turn-btn--primary"
                onClick={saveNote}
                disabled={!draftNote.trim()}
              >
                Guardar nota
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <style>{`
        .turn-screen {
          min-height: calc(100dvh - 92px - env(safe-area-inset-bottom, 0px));
          height: calc(100dvh - 92px - env(safe-area-inset-bottom, 0px));
          background: linear-gradient(180deg, #f7fbff 0%, #eef4fb 100%);
          overflow: hidden;
        }

        .turn-safe-top {
          height: env(safe-area-inset-top, 0px);
          min-height: 8px;
        }

        .turn-content {
          height: calc(100% - env(safe-area-inset-top, 0px));
          padding: 12px 16px 16px;
          display: grid;
          grid-template-rows: auto auto minmax(0, 1fr);
          gap: 12px;
          overflow: hidden;
        }

        @media (min-width: 390px) {
          .turn-content {
            padding-left: 20px;
            padding-right: 20px;
          }
        }

        .turn-topbar {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: 12px;
          padding-top: 8px;
        }

        .turn-icon-button {
          min-height: 40px;
          border-radius: 999px;
          border: 1px solid #d6e2ef;
          background: rgba(255, 255, 255, 0.9);
          box-shadow: 0 10px 22px rgba(45, 95, 147, 0.08);
          color: #163252;
          cursor: pointer;
          font-weight: 800;
        }

        .turn-icon-button {
          width: 40px;
          display: grid;
          place-items: center;
          font-size: 22px;
          line-height: 1;
          flex-shrink: 0;
        }

        .turn-lower-region {
          min-height: 0;
          overflow: hidden;
        }

        .turn-card {
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid #dce7f3;
          border-radius: 24px;
          box-shadow: 0 10px 28px rgba(48, 90, 138, 0.07);
        }

        .turn-card--hero {
          background: linear-gradient(180deg, #fbfdff 0%, #f2f7fd 100%);
        }

        .turn-card--warm {
          background: linear-gradient(180deg, #fffdf9 0%, #fff7ec 100%);
        }

        .turn-card--critical {
          background: linear-gradient(180deg, #fff8f8 0%, #ffecec 100%);
        }

        .turn-card--success {
          background: linear-gradient(180deg, #fbfefd 0%, #f1f8f4 100%);
        }

        .turn-card--success-soft {
          background: linear-gradient(180deg, rgba(251, 254, 253, 0.95) 0%, rgba(241, 248, 244, 0.96) 100%);
        }

        .turn-card--bottom {
          height: 100%;
          min-height: 0;
          overflow: hidden;
        }

        .turn-card__inner {
          padding: 16px;
        }

        .turn-card__inner--bottom {
          height: 100%;
          min-height: 0;
          display: grid;
          grid-template-rows: auto minmax(0, 1fr);
        }

        .turn-hero__top {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .turn-chip {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 28px;
          padding: 0 10px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 800;
          white-space: nowrap;
        }

        .turn-chip--primary {
          background: #e8f1fb;
          color: #2d5f93;
        }

        .turn-chip--warning {
          background: #fff5e8;
          color: #9d6d19;
        }

        .turn-chip--success {
          background: #edf7f2;
          color: #2d7b53;
        }

        .turn-chip--accent {
          background: #edf1fb;
          color: #516a9c;
        }

        .turn-hero__title {
          margin: 14px 0 0;
          font-size: 26px;
          line-height: 1.08;
          font-weight: 800;
          color: #163252;
          letter-spacing: -0.03em;
          text-align: center;
        }

        .turn-progress {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 8px;
          margin-top: 18px;
        }

        .turn-progress__item {
          min-width: 0;
          display: grid;
          gap: 6px;
          justify-items: center;
          text-align: center;
        }

        .turn-progress__dot {
          width: 100%;
          height: 6px;
          border-radius: 999px;
          background: #e3ebf5;
        }

        .turn-progress__label {
          font-size: 10px;
          line-height: 1.2;
          color: #7a8ca3;
          font-weight: 700;
        }

        .turn-progress__item--done .turn-progress__dot {
          background: #8db0d7;
        }

        .turn-progress__item--current .turn-progress__dot {
          background: #2d5f93;
        }

        .turn-progress__item--current .turn-progress__label {
          color: #2d5f93;
        }

        .turn-timer-block {
          margin-top: 18px;
          display: grid;
          justify-items: center;
          text-align: center;
          width: 100%;
        }

        .turn-timer-block__label {
          margin: 0 0 6px;
          font-size: 12px;
          line-height: 1.2;
          color: #74869d;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .turn-timer-block__value {
          margin: 0;
          font-size: 42px;
          line-height: 0.95;
          font-weight: 800;
          letter-spacing: -0.06em;
          color: #163252;
        }

        .turn-actions {
          display: grid;
          gap: 10px;
          margin-top: 18px;
        }

        .turn-actions--single {
          grid-template-columns: 1fr;
        }

        @media (min-width: 390px) {
          .turn-actions:not(.turn-actions--single) {
            grid-template-columns: 1fr 1fr;
          }
        }

        .turn-btn {
          min-height: 48px;
          border-radius: 16px;
          border: 0;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
        }

        .turn-btn--primary {
          background: #2d5f93;
          color: #fff;
          box-shadow: 0 12px 24px rgba(45, 95, 147, 0.16);
        }

        .turn-btn--primary:disabled {
          opacity: 0.55;
          cursor: not-allowed;
          box-shadow: none;
        }

        .turn-btn--secondary {
          background: #edf4fb;
          color: #163252;
          border: 1px solid #d9e6f4;
        }

        .turn-section-title {
          margin: 0 0 14px;
          font-size: 18px;
          line-height: 1.15;
          font-weight: 800;
          color: #163252;
        }

        .turn-context-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .turn-bottom-scroll {
          min-height: 0;
          overflow-y: auto;
          padding-right: 2px;
          scrollbar-width: none;
        }

        .turn-bottom-scroll::-webkit-scrollbar {
          display: none;
        }

        .turn-context-item,
        .turn-summary-row {
          min-width: 0;
          padding: 12px;
          border-radius: 18px;
          background: #fbfdff;
          border: 1px solid #dce8f5;
        }

        .turn-context-item {
          display: grid;
          gap: 4px;
        }

        .turn-context-item--full {
          grid-column: 1 / -1;
        }

        .turn-context-item__label,
        .turn-summary-row__label {
          font-size: 12px;
          line-height: 1.2;
          color: #70829d;
          font-weight: 700;
        }

        .turn-context-item__value,
        .turn-summary-row__value {
          font-size: 14px;
          line-height: 1.35;
          color: #163252;
          font-weight: 700;
        }

        .turn-summary-list {
          display: grid;
          gap: 10px;
        }

        .turn-summary-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .turn-summary-row__value {
          text-align: right;
        }

        .turn-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(17, 25, 40, 0.36);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          z-index: 20;
        }

        .turn-modal {
          width: min(100%, 390px);
          border-radius: 24px;
          background: #ffffff;
          border: 1px solid #dce7f3;
          box-shadow: 0 20px 40px rgba(17, 25, 40, 0.18);
          padding: 16px;
        }

        .turn-modal__header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 14px;
        }

        .turn-modal__title {
          margin: 0;
          font-size: 20px;
          line-height: 1.1;
          font-weight: 800;
          color: #163252;
        }

        .turn-modal__description {
          margin: 6px 0 0;
          font-size: 13px;
          line-height: 1.35;
          color: #6b7f99;
          font-weight: 600;
        }

        .turn-modal__close {
          width: 36px;
          height: 36px;
          border-radius: 999px;
          border: 1px solid #dce7f3;
          background: #f8fbff;
          color: #163252;
          font-size: 22px;
          line-height: 1;
          cursor: pointer;
          flex-shrink: 0;
        }

        .turn-modal__textarea {
          width: 100%;
          min-height: 132px;
          border-radius: 16px;
          border: 1px solid #d6e2ef;
          background: #fbfdff;
          padding: 14px;
          resize: vertical;
          color: #163252;
          font: inherit;
          line-height: 1.4;
        }

        .turn-modal__actions {
          display: grid;
          gap: 10px;
          margin-top: 14px;
        }

        @media (min-width: 390px) {
          .turn-modal__actions {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 374px) {
          .turn-context-grid {
            grid-template-columns: 1fr;
          }

          .turn-progress__label {
            font-size: 9px;
          }

          .turn-actions:not(.turn-actions--single),
          .turn-modal__actions {
            grid-template-columns: 1fr;
          }

          .turn-summary-row {
            align-items: flex-start;
            flex-direction: column;
          }
        }

        @media (max-height: 700px) {
          .turn-content {
            padding-top: 8px;
            gap: 10px;
          }

          .turn-topbar {
            padding-top: 2px;
            padding-bottom: 2px;
          }

          .turn-card__inner,
          .turn-modal {
            padding: 14px;
          }

          .turn-hero__title {
            font-size: 23px;
          }

          .turn-context-item__value,
          .turn-summary-row__value,
          .turn-modal__description {
            font-size: 12px;
          }

          .turn-timer-block__value {
            font-size: 36px;
          }

          .turn-btn,
          .turn-icon-button {
            min-height: 44px;
          }

          .turn-btn {
            font-size: 13px;
          }

          .turn-progress {
            gap: 6px;
          }
        }
      `}</style>
    </main>
  );
}
