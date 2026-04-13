import { useNavigate, useParams } from "react-router-dom";
import { turnMockById } from "../mocks/turn.mock";

function statusClass(status: string) {
  switch (status) {
    case "consent_pending":
      return "turn-chip turn-chip--warning";
    case "ready_to_start":
      return "turn-chip turn-chip--primary";
    case "in_progress":
      return "turn-chip turn-chip--primary";
    case "ready_to_close":
      return "turn-chip turn-chip--warning";
    case "closed_pending_payment":
      return "turn-chip turn-chip--success";
    default:
      return "turn-chip turn-chip--primary";
  }
}

function statusLabel(status: string) {
  switch (status) {
    case "consent_pending":
      return "Consentimiento pendiente";
    case "ready_to_start":
      return "Lista para iniciar";
    case "in_progress":
      return "Sesión en curso";
    case "ready_to_close":
      return "Lista para cerrar";
    case "closed_pending_payment":
      return "Sesión cerrada";
    default:
      return "En curso";
  }
}

export default function TurnWorkspacePage() {
  const navigate = useNavigate();
  const params = useParams();
  const turn = turnMockById(params.id);

  const primaryAction = () => {
    if (turn.status === "closed_pending_payment") {
      navigate(`/cobro/${turn.id}`);
      return;
    }

    navigate(`/turno/${turn.id}`);
  };

  return (
    <main className="turn-screen">
      <div className="turn-safe-top" />

      <section className="turn-content">
        <header className="turn-header">
          <div className="turn-header__left">
            <button
              type="button"
              className="turn-icon-button"
              aria-label="Volver"
              onClick={() => navigate(-1)}
            >
              ‹
            </button>

            <div className="turn-header__copy">
              <p className="turn-header__eyebrow">Turno</p>
              <h1 className="turn-header__title">
                {turn.time} · {turn.patient}
              </h1>
              <p className="turn-header__subtitle">{turn.treatment}</p>
            </div>
          </div>

          <button
            type="button"
            className="turn-icon-button"
            aria-label="Ficha del paciente"
            onClick={() => navigate(`/turno/${turn.id}`)}
          >
            👤
          </button>
        </header>

        <div className="turn-stack">
          <article className="turn-card">
            <div className="turn-card__inner">
              <div className="turn-top">
                <div>
                  <p className="turn-patient">{turn.patient}</p>
                  <p className="turn-treatment">{turn.treatment}</p>
                  <p className="turn-meta">Última sesión {turn.lastSessionLabel}</p>
                </div>

                <span className={statusClass(turn.status)}>
                  {statusLabel(turn.status)}
                </span>
              </div>
            </div>
          </article>

          <article className="turn-card turn-card--step">
            <div className="turn-card__inner">
              <p className="turn-step__label">Siguiente paso</p>
              <h2 className="turn-step__title">{turn.step.title}</h2>
              <p className="turn-step__copy">{turn.step.description}</p>

              <div className="turn-actions turn-actions--two">
                <button
                  type="button"
                  className="turn-btn turn-btn--primary"
                  onClick={primaryAction}
                >
                  {turn.step.primaryAction}
                </button>

                {turn.step.secondaryAction ? (
                  <button
                    type="button"
                    className="turn-btn turn-btn--secondary"
                    onClick={() => navigate(`/turno/${turn.id}`)}
                  >
                    {turn.step.secondaryAction}
                  </button>
                ) : null}
              </div>
            </div>
          </article>

          <article className="turn-card">
            <div className="turn-card__inner">
              <h3 className="turn-section-title">Antes de empezar</h3>

              <div className="turn-info-list">
                <div className="turn-info-item">
                  <div className="turn-info-item__icon">⚙️</div>
                  <div>
                    <p className="turn-info-item__title">
                      Última configuración usada
                    </p>
                    <p className="turn-info-item__subtitle">
                      {turn.previousSettingsLabel ?? "Sin registro previo"}
                    </p>
                  </div>
                </div>

                {turn.requiredEquipmentLabel ? (
                  <div className="turn-info-item">
                    <div className="turn-info-item__icon">🖥️</div>
                    <div>
                      <p className="turn-info-item__title">Equipo requerido</p>
                      <p className="turn-info-item__subtitle">
                        {turn.requiredEquipmentLabel}
                      </p>
                    </div>
                  </div>
                ) : null}

                {turn.usefulObservation ? (
                  <div className="turn-info-item">
                    <div className="turn-info-item__icon">ℹ️</div>
                    <div>
                      <p className="turn-info-item__title">Observación útil</p>
                      <p className="turn-info-item__subtitle">
                        {turn.usefulObservation}
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </article>

          <article className="turn-card">
            <div className="turn-card__inner">
              <h3 className="turn-section-title">Acciones opcionales</h3>

              <div className="turn-optional-grid">
                <button
                  type="button"
                  className="turn-optional-item"
                  onClick={() => navigate(`/turno/${turn.id}`)}
                >
                  <div className="turn-optional-item__icon">📷</div>
                  <div>
                    <p className="turn-optional-item__title">Foto antes</p>
                    <p className="turn-optional-item__status">Pendiente</p>
                  </div>
                  <span className="turn-chip turn-chip--primary">Opcional</span>
                </button>

                <button
                  type="button"
                  className="turn-optional-item"
                  onClick={() => navigate(`/turno/${turn.id}`)}
                >
                  <div className="turn-optional-item__icon">📝</div>
                  <div>
                    <p className="turn-optional-item__title">Nota breve</p>
                    <p className="turn-optional-item__status">Sin cargar</p>
                  </div>
                  <span className="turn-chip turn-chip--primary">Opcional</span>
                </button>

                <button
                  type="button"
                  className="turn-optional-item"
                  onClick={() => navigate(`/turno/${turn.id}`)}
                >
                  <div className="turn-optional-item__icon">📷</div>
                  <div>
                    <p className="turn-optional-item__title">Foto después</p>
                    <p className="turn-optional-item__status">Pendiente</p>
                  </div>
                  <span className="turn-chip turn-chip--primary">Opcional</span>
                </button>
              </div>
            </div>
          </article>
        </div>
      </section>

      <footer className="turn-footer">
        <p className="turn-footer__meta">
          {turn.status === "closed_pending_payment"
            ? "La sesión ya fue cerrada. Ahora podés continuar con el cobro."
            : "Este bloque acompaña el siguiente paso operativo del turno."}
        </p>

        <button
          type="button"
          className="turn-btn turn-btn--primary turn-btn--full"
          onClick={primaryAction}
        >
          {turn.step.primaryAction}
        </button>

        <button
          type="button"
          className="turn-footer__link"
          onClick={() => navigate("/agenda")}
        >
          Volver a Agenda
        </button>
      </footer>

      <style>{`
        .turn-screen {
          min-height: 100vh;
          background: var(--app-bg);
        }

        .turn-safe-top {
          height: env(safe-area-inset-top, 0px);
          min-height: 8px;
        }

        .turn-content {
          padding: 12px 16px 24px;
        }

        @media (min-width: 390px) {
          .turn-content {
            padding-left: 20px;
            padding-right: 20px;
          }
        }

        .turn-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          padding: 8px 0 16px;
        }

        .turn-header__left {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          min-width: 0;
        }

        .turn-icon-button {
          width: 44px;
          height: 44px;
          border: 0;
          border-radius: 999px;
          background: var(--app-surface);
          box-shadow: var(--app-shadow);
          display: grid;
          place-items: center;
          color: var(--app-text);
          cursor: pointer;
          flex-shrink: 0;
          font-size: 22px;
          line-height: 1;
        }

        .turn-header__copy {
          min-width: 0;
        }

        .turn-header__eyebrow {
          margin: 0 0 4px;
          font-size: 12px;
          line-height: 1.2;
          color: var(--app-muted);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .turn-header__title {
          margin: 0;
          font-size: 24px;
          line-height: 1.05;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: var(--app-text);
        }

        .turn-header__subtitle {
          margin: 6px 0 0;
          font-size: 14px;
          line-height: 1.3;
          color: var(--app-muted);
          font-weight: 500;
        }

        .turn-stack {
          display: grid;
          gap: 16px;
        }

        .turn-card {
          background: var(--app-surface);
          border: 1px solid var(--app-line);
          border-radius: 24px;
          box-shadow: var(--app-shadow);
        }

        .turn-card--step {
          overflow: hidden;
          background:
            radial-gradient(circle at top right, rgba(35, 74, 138, 0.08), transparent 32%),
            linear-gradient(180deg, #ffffff, #fbfcff);
        }

        .turn-card__inner {
          padding: 16px;
        }

        .turn-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }

        .turn-patient {
          margin: 0 0 6px;
          font-size: 24px;
          line-height: 1.05;
          font-weight: 800;
          letter-spacing: -0.03em;
        }

        .turn-treatment {
          margin: 0;
          font-size: 15px;
          line-height: 1.35;
          font-weight: 600;
        }

        .turn-meta {
          margin: 8px 0 0;
          font-size: 14px;
          line-height: 1.35;
          color: var(--app-muted);
        }

        .turn-chip {
          display: inline-flex;
          align-items: center;
          min-height: 28px;
          padding: 0 12px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
          white-space: nowrap;
        }

        .turn-chip--primary {
          background: var(--app-primary-soft);
          color: var(--app-primary);
        }

        .turn-chip--success {
          background: #edf8f0;
          color: #257245;
        }

        .turn-chip--warning {
          background: #fff6e9;
          color: #9a6400;
        }

        .turn-chip--danger {
          background: #fff0ee;
          color: #b6483b;
        }

        .turn-step__label {
          margin: 0 0 8px;
          font-size: 13px;
          line-height: 1.3;
          color: var(--app-muted);
          font-weight: 700;
        }

        .turn-step__title {
          margin: 0 0 8px;
          font-size: 24px;
          line-height: 1.05;
          font-weight: 800;
          letter-spacing: -0.03em;
        }

        .turn-step__copy {
          margin: 0;
          font-size: 14px;
          line-height: 1.4;
          color: var(--app-muted);
        }

        .turn-section-title {
          margin: 0 0 14px;
          font-size: 16px;
          line-height: 1.25;
          font-weight: 750;
          letter-spacing: -0.02em;
        }

        .turn-actions {
          display: grid;
          gap: 10px;
          margin-top: 16px;
        }

        @media (min-width: 390px) {
          .turn-actions--two {
            grid-template-columns: 1fr 1fr;
          }
        }

        .turn-btn {
          min-height: 48px;
          border-radius: 16px;
          border: 0;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
        }

        .turn-btn--primary {
          background: var(--app-primary);
          color: #fff;
        }

        .turn-btn--secondary {
          background: #f8fafe;
          color: var(--app-text);
          border: 1px solid var(--app-line);
        }

        .turn-btn--full {
          width: 100%;
        }

        .turn-info-list {
          display: grid;
          gap: 12px;
        }

        .turn-info-item {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 12px;
          align-items: start;
        }

        .turn-info-item__icon {
          width: 36px;
          height: 36px;
          border-radius: 12px;
          display: grid;
          place-items: center;
          background: var(--app-primary-soft);
          color: var(--app-primary);
          flex-shrink: 0;
        }

        .turn-info-item__title {
          margin: 0;
          font-size: 14px;
          line-height: 1.25;
          font-weight: 700;
        }

        .turn-info-item__subtitle {
          margin: 4px 0 0;
          font-size: 13px;
          line-height: 1.35;
          color: var(--app-muted);
        }

        .turn-optional-grid {
          display: grid;
          gap: 12px;
        }

        .turn-optional-item {
          width: 100%;
          border: 1px solid var(--app-line);
          background: var(--app-surface);
          border-radius: 18px;
          box-shadow: var(--app-shadow);
          padding: 14px;
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 12px;
          align-items: center;
          text-align: left;
          cursor: pointer;
        }

        .turn-optional-item__icon {
          width: 36px;
          height: 36px;
          border-radius: 12px;
          display: grid;
          place-items: center;
          background: #f8fafe;
        }

        .turn-optional-item__title {
          margin: 0;
          font-size: 14px;
          line-height: 1.25;
          font-weight: 700;
        }

        .turn-optional-item__status {
          margin: 4px 0 0;
          font-size: 13px;
          line-height: 1.25;
          color: var(--app-muted);
        }

        .turn-footer {
          position: fixed;
          left: 50%;
          transform: translateX(-50%);
          bottom: 0;
          width: 100%;
          max-width: 430px;
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(16px);
          border-top: 1px solid var(--app-line);
          padding: 12px 16px calc(12px + env(safe-area-inset-bottom, 0px));
        }

        @media (min-width: 390px) {
          .turn-footer {
            padding-left: 20px;
            padding-right: 20px;
          }
        }

        .turn-footer__meta {
          margin: 0 0 10px;
          font-size: 12px;
          line-height: 1.3;
          color: var(--app-muted);
          font-weight: 600;
        }

        .turn-footer__link {
          margin-top: 10px;
          border: 0;
          background: transparent;
          color: var(--app-primary);
          padding: 0;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
        }
      `}</style>
    </main>
  );
}
