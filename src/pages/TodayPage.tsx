import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  todayMock,
  type TodayPendingItem,
  type TodayAgendaStatus,
  type TodayHeroEvent,
  type TodayHeroState,
  type TodayPendingKind,
} from "../mocks/today.mock";

type TodayView = "pending" | "agenda";

const HERO_PRIORITY: Record<TodayHeroState, number> = {
  session_in_progress: 1,
  payment_pending: 2,
  ready_to_start: 3,
  upcoming_turn: 4,
  day_complete: 5,
};

function resolveHero(events: TodayHeroEvent[]) {
  return [...events].sort(
    (left, right) => HERO_PRIORITY[left.state] - HERO_PRIORITY[right.state]
  )[0];
}

function heroToneClass(state: TodayHeroState) {
  switch (state) {
    case "session_in_progress":
      return "today-hero today-hero--active";
    case "payment_pending":
      return "today-hero today-hero--warm";
    case "ready_to_start":
      return "today-hero today-hero--info";
    case "upcoming_turn":
      return "today-hero today-hero--primary";
    case "day_complete":
      return "today-hero today-hero--calm";
    default:
      return "today-hero today-hero--primary";
  }
}

function heroPrimaryLabel(state: TodayHeroState) {
  switch (state) {
    case "session_in_progress":
      return "Reanudar sesión";
    case "payment_pending":
      return "Ir al cobro";
    case "ready_to_start":
    case "upcoming_turn":
      return "Abrir turno";
    case "day_complete":
      return "Ver agenda";
    default:
      return "Abrir turno";
  }
}

function heroPrimaryPath(hero: TodayHeroEvent) {
  switch (hero.state) {
    case "session_in_progress":
    case "ready_to_start":
    case "upcoming_turn":
      return hero.turnId ? `/turno/${hero.turnId}` : "/agenda";
    case "payment_pending":
      return hero.turnId ? `/cobro/${hero.turnId}` : "/agenda";
    case "day_complete":
      return "/agenda";
    default:
      return "/agenda";
  }
}

function heroDetailLine(hero: TodayHeroEvent) {
  if (hero.state === "day_complete") {
    return "Hoy";
  }

  if (hero.treatment) {
    return `${hero.timeLabel} · ${hero.treatment}`;
  }

  return hero.timeLabel;
}

function pendingIcon(kind: TodayPendingKind) {
  switch (kind) {
    case "payment":
      return "$";
    case "receipt":
      return "↗";
    case "consent":
      return "✓";
    case "waiting":
      return "●";
    case "session":
      return "◌";
    default:
      return "•";
  }
}

function pendingIconClass(kind: TodayPendingKind) {
  switch (kind) {
    case "payment":
      return "today-item-icon today-item-icon--warm";
    case "receipt":
      return "today-item-icon today-item-icon--violet";
    case "consent":
      return "today-item-icon today-item-icon--danger";
    case "waiting":
      return "today-item-icon today-item-icon--info";
    case "session":
      return "today-item-icon today-item-icon--primary";
    default:
      return "today-item-icon today-item-icon--primary";
  }
}

function agendaStatusClass(status: TodayAgendaStatus) {
  switch (status) {
    case "Hechos":
      return "today-status-chip today-status-chip--done";
    case "Confirmado":
      return "today-status-chip today-status-chip--success";
    case "Por llegar":
      return "today-status-chip today-status-chip--primary";
    case "Esperando":
      return "today-status-chip today-status-chip--warning";
    case "Pendiente":
      return "today-status-chip today-status-chip--muted";
    case "En curso":
      return "today-status-chip today-status-chip--active";
    default:
      return "today-status-chip today-status-chip--primary";
  }
}

export default function TodayPage() {
  const navigate = useNavigate();
  const hero = useMemo(() => resolveHero(todayMock.heroEvents), []);
  const [pendingItems, setPendingItems] = useState(todayMock.pendingItems);
  const [activeView, setActiveView] = useState<TodayView>(
    todayMock.pendingItems.length ? "pending" : "agenda"
  );
  const [activeReceiptItem, setActiveReceiptItem] = useState<TodayPendingItem | null>(null);
  const [confirmPermanentSkip, setConfirmPermanentSkip] = useState(false);
  const receiptInputRef = useRef<HTMLInputElement | null>(null);

  const pendingCount = pendingItems.length;
  const canOpenHistory = Boolean(hero.patientId);

  function handlePendingAction(item: TodayPendingItem) {
    if (item.kind === "receipt") {
      setConfirmPermanentSkip(false);
      setActiveReceiptItem(item);
      return;
    }

    navigate(item.targetPath);
  }

  return (
    <main className="today-screen">
      <div className="today-safe-top" />

      <section className="today-content">
        <header className="today-header">
          <div className="today-header__meta">
            {pendingCount ? (
              <span className="today-header__badge">{pendingCount} pendientes</span>
            ) : null}
          </div>
        </header>

        <article className={heroToneClass(hero.state)}>
          <div className="today-hero__top">
            <h2 className="today-hero__patient">{hero.patient ?? "Jornada al día"}</h2>
            <span className="today-hero__chip">{hero.statusLabel}</span>
          </div>

          <div className="today-hero__body">
            <p className="today-hero__treatment">{heroDetailLine(hero)}</p>
            <p className="today-hero__context">{hero.contextLine}</p>
          </div>

          <div className="today-hero__actions">
            <button
              type="button"
              className="today-btn today-btn--primary"
              onClick={() => navigate(heroPrimaryPath(hero))}
            >
              {heroPrimaryLabel(hero.state)}
            </button>

            <button
              type="button"
              className="today-btn today-btn--secondary"
              disabled={!canOpenHistory}
              onClick={() => {
                if (!hero.patientId) {
                  return;
                }

                navigate(`/paciente/${hero.patientId}/historial`);
              }}
            >
              Historial
            </button>
          </div>
        </article>

        <div className="today-view-switch" role="tablist" aria-label="Vista de hoy">
          <button
            type="button"
            role="tab"
            aria-selected={activeView === "pending"}
            className={`today-view-switch__button ${
              activeView === "pending" ? "today-view-switch__button--active" : ""
            }`.trim()}
            onClick={() => setActiveView("pending")}
          >
            Pendientes
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeView === "agenda"}
            className={`today-view-switch__button ${
              activeView === "agenda" ? "today-view-switch__button--active" : ""
            }`.trim()}
            onClick={() => setActiveView("agenda")}
          >
            Agenda de hoy
          </button>
        </div>

        <section className="today-panel">
          {activeView === "pending" ? (
            <>
              <div className="today-panel__head">
                <div>
                  <h3 className="today-panel__title">Pendientes accionables</h3>
                </div>
                <span className="today-panel__count">{pendingCount}</span>
              </div>

              <div className="today-panel__scroll">
                <div className="today-list">
                  {pendingItems.length ? pendingItems.map((item) => (
                    <article key={item.id} className="today-list-item today-list-item--pending">
                      <div className="today-list-item__copy">
                        <p className="today-list-item__title">{item.title}</p>
                        <p className="today-list-item__reference">{item.reference}</p>
                        <p className="today-list-item__subtitle">{item.subtitle}</p>
                      </div>

                      <div className="today-list-item__aside">
                        <button
                          type="button"
                          className="today-list-item__action-button"
                          onClick={() => handlePendingAction(item)}
                        >
                          {item.actionLabel}
                        </button>

                        <div className={pendingIconClass(item.kind)} aria-hidden="true">
                          {pendingIcon(item.kind)}
                        </div>
                      </div>
                    </article>
                  )) : (
                    <div className="today-empty-state">
                      <p className="today-empty-state__title">No quedan pendientes</p>
                      <p className="today-empty-state__copy">
                        El día quedó al día. Podés seguir con la agenda.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="today-panel__head">
                <div>
                  <h3 className="today-panel__title">Agenda de hoy</h3>
                </div>
                <button
                  type="button"
                  className="today-panel__link"
                  onClick={() => navigate("/agenda")}
                >
                  Ver agenda completa
                </button>
              </div>

              <div className="today-panel__scroll">
                <div className="today-list">
                  {todayMock.agendaItems.slice(0, 4).map((item) => (
                    <article
                      key={item.id}
                      className="today-list-item today-list-item--agenda"
                    >
                      <div className="today-list-item__time">{item.time}</div>

                      <div className="today-list-item__copy">
                        <p className="today-list-item__title">{item.patient}</p>
                        <p className="today-list-item__subtitle">{item.treatment}</p>
                      </div>

                      <span className={agendaStatusClass(item.status)}>{item.status}</span>
                    </article>
                  ))}
                </div>
              </div>
            </>
          )}
        </section>
      </section>

      {activeReceiptItem ? (
        <div className="today-modal-backdrop" role="presentation">
          <div
            className="today-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="today-receipt-title"
          >
            <div className="today-modal__header">
              <div>
                <h2 id="today-receipt-title" className="today-modal__title">
                  Comprobante pendiente
                </h2>
                <p className="today-modal__description">
                  {activeReceiptItem.reference} · {activeReceiptItem.receiptDetails?.sessionTime}
                </p>
              </div>

              <button
                type="button"
                className="today-modal__close"
                aria-label="Cerrar"
                onClick={() => {
                  setActiveReceiptItem(null);
                  setConfirmPermanentSkip(false);
                }}
              >
                ×
              </button>
            </div>

            <div className="today-receipt-card">
              <p className="today-receipt-card__title">
                {activeReceiptItem.receiptDetails?.treatment}
              </p>
              <p className="today-receipt-card__line">
                Total cobrado: {activeReceiptItem.receiptDetails?.totalLabel}
              </p>
              <p className="today-receipt-card__line">
                {activeReceiptItem.receiptDetails?.paymentBreakdown}
              </p>
            </div>

            {confirmPermanentSkip ? (
              <div className="today-modal__warning">
                <p className="today-modal__warning-title">
                  Confirmar omisión definitiva
                </p>
                <p className="today-modal__warning-copy">
                  Este cobro quedará marcado como sin comprobante y no se volverá a pedir
                  desde Hoy.
                </p>
              </div>
            ) : null}

            <div className="today-modal__actions today-modal__actions--stacked">
              <input
                ref={receiptInputRef}
                type="file"
                accept="image/*,.pdf"
                className="today-modal__file-input"
                onChange={() => {
                  setPendingItems((current) =>
                    current.filter((item) => item.id !== activeReceiptItem.id)
                  );
                  setActiveReceiptItem(null);
                  setConfirmPermanentSkip(false);
                  if (receiptInputRef.current) {
                    receiptInputRef.current.value = "";
                  }
                }}
              />

              <button
                type="button"
                className="today-modal__button today-modal__button--primary"
                onClick={() => receiptInputRef.current?.click()}
              >
                Cargar comprobante
              </button>

              <button
                type="button"
                className="today-modal__button today-modal__button--secondary"
                onClick={() => {
                  setActiveReceiptItem(null);
                  setConfirmPermanentSkip(false);
                }}
              >
                Omitir por ahora
              </button>

              {confirmPermanentSkip ? (
                <button
                  type="button"
                  className="today-modal__button today-modal__button--danger"
                  onClick={() => {
                    setPendingItems((current) =>
                      current.filter((item) => item.id !== activeReceiptItem.id)
                    );
                    setActiveReceiptItem(null);
                    setConfirmPermanentSkip(false);
                  }}
                >
                  Confirmar que no se subirá
                </button>
              ) : (
                <button
                  type="button"
                  className="today-modal__button today-modal__button--ghost"
                  onClick={() => setConfirmPermanentSkip(true)}
                >
                  No se subirá
                </button>
              )}
            </div>
          </div>
        </div>
      ) : null}

      <style>{`
        .today-screen {
          min-height: calc(100dvh - 92px - env(safe-area-inset-bottom, 0px));
          height: calc(100dvh - 92px - env(safe-area-inset-bottom, 0px));
          background:
            radial-gradient(circle at top left, rgba(84, 140, 190, 0.16), transparent 32%),
            linear-gradient(180deg, #f7fbff 0%, #eef4fb 100%);
          overflow: hidden;
        }

        .today-safe-top {
          height: env(safe-area-inset-top, 0px);
          min-height: 8px;
        }

        .today-content {
          height: calc(100% - env(safe-area-inset-top, 0px));
          padding: 12px 16px 12px;
          display: grid;
          grid-template-rows: auto auto auto minmax(0, 1fr);
          gap: 12px;
          overflow: hidden;
        }

        @media (min-width: 390px) {
          .today-content {
            padding-left: 20px;
            padding-right: 20px;
          }
        }

        .today-header {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
          padding-top: 2px;
        }

        .today-header__meta {
          min-width: 0;
        }

        .today-header__meta {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .today-header__badge {
          min-height: 24px;
          padding: 0 10px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          background: rgba(31, 93, 149, 0.1);
          color: #1f5d95;
          font-size: 11px;
          line-height: 1;
          font-weight: 800;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .today-hero,
        .today-view-switch,
        .today-panel {
          border: 1px solid #dce7f3;
          background: rgba(255, 255, 255, 0.92);
          box-shadow: 0 12px 28px rgba(48, 90, 138, 0.08);
        }

        .today-hero {
          border-radius: 28px;
          padding: 16px;
          display: grid;
          gap: 14px;
        }

        .today-hero--active {
          background: linear-gradient(180deg, #eff7ff 0%, #e3f0ff 100%);
        }

        .today-hero--warm {
          background: linear-gradient(180deg, #fff7ee 0%, #ffeed9 100%);
        }

        .today-hero--info {
          background: linear-gradient(180deg, #eefbfa 0%, #e2f5f2 100%);
        }

        .today-hero--primary {
          background: linear-gradient(180deg, #f3f7ff 0%, #eaf1ff 100%);
        }

        .today-hero--calm {
          background: linear-gradient(180deg, #f9fbfd 0%, #f1f5f9 100%);
        }

        .today-hero__top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }

        .today-hero__chip {
          min-height: 28px;
          padding: 0 12px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          background: rgba(22, 50, 82, 0.08);
          color: #163252;
          font-size: 11px;
          line-height: 1;
          font-weight: 800;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .today-hero__body {
          display: grid;
          gap: 4px;
        }

        .today-hero__patient {
          margin: 0;
          color: #163252;
          font-size: 28px;
          line-height: 0.98;
          font-weight: 800;
          letter-spacing: -0.04em;
        }

        .today-hero__treatment {
          margin: 0;
          color: #35506d;
          font-size: 16px;
          line-height: 1.2;
          font-weight: 700;
        }

        .today-hero__context {
          margin: 4px 0 0;
          color: #617893;
          font-size: 14px;
          line-height: 1.3;
          font-weight: 600;
        }

        .today-hero__actions {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 10px;
        }

        .today-btn {
          min-height: 48px;
          border-radius: 18px;
          border: 0;
          cursor: pointer;
          font-size: 14px;
          line-height: 1.1;
          font-weight: 800;
          padding: 0 16px;
        }

        .today-btn--primary {
          background: linear-gradient(180deg, #1f5d95 0%, #184d7d 100%);
          color: #ffffff;
          box-shadow: 0 12px 24px rgba(24, 77, 125, 0.18);
        }

        .today-btn--secondary {
          border: 1px solid #d6e2ef;
          background: rgba(255, 255, 255, 0.82);
          color: #163252;
        }

        .today-btn--secondary:disabled {
          opacity: 0.45;
          cursor: default;
        }

        .today-view-switch {
          border-radius: 20px;
          padding: 6px;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 6px;
        }

        .today-view-switch__button {
          min-height: 42px;
          border: 0;
          border-radius: 16px;
          background: transparent;
          color: #6a809a;
          font-size: 14px;
          line-height: 1.1;
          font-weight: 800;
          cursor: pointer;
        }

        .today-view-switch__button--active {
          background: #edf4ff;
          color: #1f5d95;
          box-shadow: inset 0 0 0 1px #d6e3f2;
        }

        .today-panel {
          border-radius: 28px;
          min-height: 0;
          display: grid;
          grid-template-rows: auto minmax(0, 1fr);
          overflow: hidden;
        }

        .today-panel__head {
          padding: 16px 16px 12px;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          border-bottom: 1px solid #e6eef6;
        }

        .today-panel__title {
          margin: 0;
          color: #163252;
          font-size: 20px;
          line-height: 1.1;
          font-weight: 800;
          letter-spacing: -0.03em;
        }

        .today-panel__count {
          min-width: 34px;
          min-height: 34px;
          padding: 0 10px;
          border-radius: 999px;
          display: grid;
          place-items: center;
          background: #edf4ff;
          color: #1f5d95;
          font-size: 14px;
          line-height: 1;
          font-weight: 800;
          flex-shrink: 0;
        }

        .today-panel__link {
          border: 0;
          background: transparent;
          color: #1f5d95;
          font-size: 13px;
          line-height: 1.2;
          font-weight: 800;
          cursor: pointer;
          padding: 2px 0 0;
          flex-shrink: 0;
        }

        .today-panel__scroll {
          min-height: 0;
          overflow-y: auto;
          padding: 10px 16px 16px;
        }

        .today-list {
          display: grid;
          gap: 10px;
        }

        .today-empty-state {
          border: 1px dashed #ccdced;
          border-radius: 20px;
          background: #f7fbff;
          padding: 18px 16px;
          text-align: center;
        }

        .today-empty-state__title {
          margin: 0;
          color: #163252;
          font-size: 16px;
          line-height: 1.2;
          font-weight: 800;
        }

        .today-empty-state__copy {
          margin: 6px 0 0;
          color: #627791;
          font-size: 14px;
          line-height: 1.35;
          font-weight: 600;
        }

        .today-list-item {
          border: 1px solid #dce7f3;
          border-radius: 22px;
          background: #f8fbff;
          display: grid;
          align-items: center;
          gap: 12px;
          padding: 14px;
          text-align: left;
        }

        .today-list-item--pending {
          grid-template-columns: minmax(0, 1fr) auto;
        }

        .today-list-item--agenda {
          grid-template-columns: auto minmax(0, 1fr) auto;
        }

        .today-item-icon {
          width: 34px;
          height: 34px;
          border-radius: 12px;
          display: grid;
          place-items: center;
          font-size: 14px;
          line-height: 1;
          font-weight: 800;
          flex-shrink: 0;
        }

        .today-item-icon--primary {
          background: rgba(31, 93, 149, 0.1);
          color: #1f5d95;
        }

        .today-item-icon--warm {
          background: rgba(240, 160, 61, 0.15);
          color: #c47616;
        }

        .today-item-icon--violet {
          background: rgba(111, 92, 188, 0.14);
          color: #6f5cbc;
        }

        .today-item-icon--danger {
          background: rgba(207, 77, 77, 0.14);
          color: #bd4242;
        }

        .today-item-icon--info {
          background: rgba(54, 161, 168, 0.14);
          color: #23838a;
        }

        .today-list-item__time {
          min-width: 52px;
          color: #163252;
          font-size: 19px;
          line-height: 1;
          font-weight: 800;
          letter-spacing: -0.03em;
        }

        .today-list-item__copy {
          min-width: 0;
        }

        .today-list-item__aside {
          display: grid;
          justify-items: end;
          align-self: stretch;
          gap: 8px;
        }

        .today-list-item__title {
          margin: 0;
          color: #163252;
          font-size: 14px;
          line-height: 1.2;
          font-weight: 800;
        }

        .today-list-item__reference {
          margin: 3px 0 0;
          color: #3f5b78;
          font-size: 12px;
          line-height: 1.2;
          font-weight: 700;
        }

        .today-list-item__subtitle {
          margin: 4px 0 0;
          color: #6a8099;
          font-size: 12px;
          line-height: 1.25;
          font-weight: 600;
        }

        .today-list-item__action-button {
          min-height: 34px;
          padding: 0 12px;
          border: 0;
          border-radius: 12px;
          background: linear-gradient(180deg, #1f5d95 0%, #184d7d 100%);
          color: #ffffff;
          font-size: 12px;
          line-height: 1;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 10px 18px rgba(24, 77, 125, 0.16);
        }

        .today-status-chip {
          min-height: 28px;
          padding: 0 10px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          line-height: 1;
          font-weight: 800;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .today-status-chip--success {
          background: #e7f5eb;
          color: #1f6f47;
        }

        .today-status-chip--done {
          background: #edf1f5;
          color: #6a7d92;
        }

        .today-status-chip--primary {
          background: #edf4ff;
          color: #1f5d95;
        }

        .today-status-chip--warning {
          background: #fff0dc;
          color: #c47616;
        }

        .today-status-chip--muted {
          background: #eef2f6;
          color: #5f738b;
        }

        .today-status-chip--active {
          background: #e5f4ff;
          color: #0d6ea8;
        }

        .today-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(17, 31, 47, 0.42);
          display: grid;
          align-items: center;
          padding: 18px 16px calc(24px + env(safe-area-inset-bottom, 0px));
          z-index: 30;
        }

        .today-modal {
          width: min(100%, 430px);
          justify-self: center;
          border: 1px solid #dce7f3;
          border-radius: 28px;
          background: #ffffff;
          box-shadow: 0 12px 28px rgba(48, 90, 138, 0.12);
          padding: 18px;
          display: grid;
          gap: 14px;
        }

        .today-modal__header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }

        .today-modal__title {
          margin: 0;
          color: #163252;
          font-size: 22px;
          line-height: 1.08;
          font-weight: 800;
          letter-spacing: -0.03em;
        }

        .today-modal__description {
          margin: 6px 0 0;
          color: #627791;
          font-size: 13px;
          line-height: 1.25;
          font-weight: 700;
        }

        .today-modal__close {
          width: 38px;
          height: 38px;
          border: 1px solid #dce6f2;
          border-radius: 999px;
          background: #f8fbff;
          color: #163252;
          cursor: pointer;
          font-size: 24px;
          line-height: 1;
          flex-shrink: 0;
        }

        .today-receipt-card {
          border: 1px solid #dce7f3;
          border-radius: 20px;
          background: #f8fbff;
          padding: 14px;
          display: grid;
          gap: 6px;
        }

        .today-receipt-card__title {
          margin: 0;
          color: #163252;
          font-size: 15px;
          line-height: 1.2;
          font-weight: 800;
        }

        .today-receipt-card__line {
          margin: 0;
          color: #5e7793;
          font-size: 13px;
          line-height: 1.3;
          font-weight: 700;
        }

        .today-modal__warning {
          border-radius: 18px;
          background: #fff3f0;
          padding: 12px 14px;
        }

        .today-modal__warning-title {
          margin: 0;
          color: #b94a3f;
          font-size: 13px;
          line-height: 1.2;
          font-weight: 800;
        }

        .today-modal__warning-copy {
          margin: 4px 0 0;
          color: #8e5a53;
          font-size: 12px;
          line-height: 1.3;
          font-weight: 700;
        }

        .today-modal__actions {
          display: grid;
          gap: 10px;
        }

        .today-modal__actions--stacked {
          grid-template-columns: 1fr;
        }

        .today-modal__button {
          min-height: 46px;
          border: 0;
          border-radius: 16px;
          cursor: pointer;
          font-size: 14px;
          line-height: 1.1;
          font-weight: 800;
          padding: 0 14px;
        }

        .today-modal__button--primary {
          background: linear-gradient(180deg, #1f5d95 0%, #184d7d 100%);
          color: #ffffff;
        }

        .today-modal__button--secondary {
          background: #eef4fb;
          color: #174973;
        }

        .today-modal__button--ghost {
          background: transparent;
          color: #6a8099;
          border: 1px solid #dce7f3;
        }

        .today-modal__button--danger {
          background: #c94d43;
          color: #ffffff;
        }

        .today-modal__file-input {
          display: none;
        }

        @media (max-height: 700px) {
          .today-content {
            padding-top: 8px;
            gap: 10px;
          }

          .today-hero {
            padding: 14px;
            gap: 12px;
          }

          .today-panel__head {
            padding: 14px 14px 10px;
          }

          .today-panel__scroll {
            padding: 8px 14px 14px;
          }

          .today-hero__patient {
            font-size: 24px;
          }

          .today-hero__treatment {
            font-size: 15px;
          }

          .today-panel__title {
            font-size: 18px;
          }

          .today-btn,
          .today-view-switch__button {
            min-height: 42px;
          }

          .today-list-item {
            padding: 12px;
            gap: 10px;
          }

          .today-item-icon {
            width: 30px;
            height: 30px;
            border-radius: 10px;
            font-size: 13px;
          }

          .today-list-item__time {
            min-width: 46px;
            font-size: 17px;
          }

          .today-list-item__title,
          .today-list-item__reference,
          .today-list-item__subtitle,
          .today-list-item__action-button,
          .today-hero__context,
          .today-modal__description,
          .today-receipt-card__line {
            font-size: 12px;
          }
        }
      `}</style>
    </main>
  );
}
