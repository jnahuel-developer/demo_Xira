import { useNavigate } from "react-router-dom";
import { todayMock } from "../mocks/today.mock";

function pendingIcon(kind: "consent" | "payment" | "session") {
  switch (kind) {
    case "consent":
      return "✓";
    case "payment":
      return "$";
    case "session":
      return "○";
    default:
      return "•";
  }
}

function upcomingStatusClass(status: "Confirmado" | "Por llegar" | "Esperando") {
  switch (status) {
    case "Confirmado":
      return "today-chip today-chip--success";
    case "Por llegar":
      return "today-chip today-chip--primary";
    case "Esperando":
      return "today-chip today-chip--warning";
    default:
      return "today-chip today-chip--primary";
  }
}

export default function TodayPage() {
  const navigate = useNavigate();

  return (
    <main className="today-screen">
      <div className="today-safe-top" />

      <section className="today-content">
        <header className="today-header">
          <div className="today-header__copy">
            <p className="today-header__greeting">Buen día</p>
            <h1 className="today-header__name">{todayMock.doctorName}</h1>
            <p className="today-header__clinic">{todayMock.clinicName}</p>
          </div>

          <button
            type="button"
            className="today-icon-button"
            aria-label="Notificaciones"
          >
            <span className="today-icon-button__icon">🔔</span>
            <span className="today-icon-button__badge" />
          </button>
        </header>

        <div className="today-stack">
          <article className="today-card today-card--hero">
            <div className="today-card__inner">
              <div className="today-hero__top">
                <span className="today-hero__eyebrow">Próximo turno</span>
                <span className="today-chip today-chip--primary">
                  {todayMock.hero.statusLabel}
                </span>
              </div>

              <h2 className="today-hero__time">{todayMock.hero.time}</h2>
              <p className="today-hero__patient">{todayMock.hero.patient}</p>
              <p className="today-hero__treatment">{todayMock.hero.treatment}</p>
              <p className="today-hero__meta">{todayMock.hero.lastSessionLabel}</p>

              <div className="today-hero__actions">
                <button
                  type="button"
                  className="today-btn today-btn--primary"
                  onClick={() => navigate(`/turno/${todayMock.hero.turnId}`)}
                >
                  Abrir turno
                </button>

                <button
                  type="button"
                  className="today-btn today-btn--secondary"
                  onClick={() => navigate(`/turno/${todayMock.hero.turnId}`)}
                >
                  Ver ficha
                </button>
              </div>
            </div>
          </article>

          <article className="today-card">
            <div className="today-card__inner">
              <h3 className="today-section-title">Pendientes de hoy</h3>

              <div className="today-pending-list">
                {todayMock.pendingItems.map((item) => (
                  <div key={item.id} className="today-pending-item">
                    <div className={`today-pending-item__icon today-pending-item__icon--${item.kind}`}>
                      {pendingIcon(item.kind)}
                    </div>

                    <div className="today-pending-item__copy">
                      <p className="today-pending-item__title">{item.title}</p>
                      {item.subtitle ? (
                        <p className="today-pending-item__subtitle">{item.subtitle}</p>
                      ) : null}
                    </div>

                    <button
                      type="button"
                      className="today-inline-link"
                      onClick={() => {
                        if (item.kind === "payment") {
                          navigate(`/cobro/${item.relatedId}`);
                        } else {
                          navigate(`/turno/${item.relatedId}`);
                        }
                      }}
                    >
                      {item.action}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </article>

          <article className="today-card">
            <div className="today-card__inner">
              <h3 className="today-section-title">Después sigue</h3>

              <div className="today-upcoming-list">
                {todayMock.upcomingItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="today-upcoming-item"
                    onClick={() => navigate(`/turno/${item.relatedId}`)}
                  >
                    <div className="today-upcoming-item__time">{item.time}</div>

                    <div className="today-upcoming-item__copy">
                      <p className="today-upcoming-item__title">{item.patient}</p>
                      <p className="today-upcoming-item__subtitle">{item.treatment}</p>
                    </div>

                    <span className={upcomingStatusClass(item.status)}>{item.status}</span>
                  </button>
                ))}
              </div>
            </div>
          </article>

          <section className="today-shortcuts" aria-label="Atajos">
            <button
              type="button"
              className="today-shortcut"
              onClick={() => navigate("/agenda")}
            >
              <span className="today-shortcut__icon">＋</span>
              <span className="today-shortcut__label">Nuevo turno</span>
            </button>

            <button
              type="button"
              className="today-shortcut"
              onClick={() => navigate("/agenda")}
            >
              <span className="today-shortcut__icon">🗓</span>
              <span className="today-shortcut__label">Ver agenda</span>
            </button>

            <button
              type="button"
              className="today-shortcut"
              onClick={() => navigate("/pacientes")}
            >
              <span className="today-shortcut__icon">👤</span>
              <span className="today-shortcut__label">Pacientes</span>
            </button>
          </section>
        </div>
      </section>

      <style>{`
        .today-screen {
          min-height: 100vh;
          background: var(--app-bg);
        }

        .today-safe-top {
          height: env(safe-area-inset-top, 0px);
          min-height: 8px;
        }

        .today-content {
          padding: 12px 16px 24px;
        }

        @media (min-width: 390px) {
          .today-content {
            padding-left: 20px;
            padding-right: 20px;
          }
        }

        .today-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          padding: 8px 0 16px;
        }

        .today-header__copy {
          min-width: 0;
        }

        .today-header__greeting {
          margin: 0 0 4px;
          font-size: 13px;
          line-height: 1.2;
          color: var(--app-muted);
          font-weight: 500;
        }

        .today-header__name {
          margin: 0;
          font-size: 28px;
          line-height: 1.05;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: var(--app-text);
        }

        .today-header__clinic {
          margin: 6px 0 0;
          font-size: 14px;
          line-height: 1.3;
          color: var(--app-muted);
          font-weight: 500;
        }

        .today-icon-button {
          width: 44px;
          height: 44px;
          border: 0;
          border-radius: 999px;
          background: var(--app-surface);
          box-shadow: var(--app-shadow);
          display: grid;
          place-items: center;
          position: relative;
          color: var(--app-text);
          cursor: pointer;
          flex-shrink: 0;
        }

        .today-icon-button__icon {
          font-size: 18px;
          line-height: 1;
        }

        .today-icon-button__badge {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: #ff7262;
          border: 2px solid var(--app-surface);
        }

        .today-stack {
          display: grid;
          gap: 16px;
        }

        .today-card {
          background: var(--app-surface);
          border: 1px solid var(--app-line);
          border-radius: 24px;
          box-shadow: var(--app-shadow);
        }

        .today-card--hero {
          overflow: hidden;
          background:
            radial-gradient(circle at top right, rgba(35, 74, 138, 0.08), transparent 32%),
            linear-gradient(180deg, #ffffff, #fbfcff);
        }

        .today-card__inner {
          padding: 18px;
        }

        .today-hero__top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 14px;
        }

        .today-hero__eyebrow {
          font-size: 12px;
          line-height: 1.2;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--app-muted);
        }

        .today-chip {
          display: inline-flex;
          align-items: center;
          min-height: 28px;
          padding: 0 12px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
          white-space: nowrap;
        }

        .today-chip--primary {
          background: var(--app-primary-soft);
          color: var(--app-primary);
        }

        .today-chip--success {
          background: #edf8f0;
          color: #257245;
        }

        .today-chip--warning {
          background: #fff6e9;
          color: #9a6400;
        }

        .today-hero__time {
          margin: 0 0 10px;
          font-size: 40px;
          line-height: 0.95;
          font-weight: 800;
          letter-spacing: -0.04em;
        }

        .today-hero__patient {
          margin: 0 0 6px;
          font-size: 24px;
          line-height: 1.05;
          font-weight: 750;
          letter-spacing: -0.03em;
        }

        .today-hero__treatment {
          margin: 0 0 10px;
          font-size: 15px;
          line-height: 1.35;
          font-weight: 600;
          color: var(--app-text);
        }

        .today-hero__meta {
          margin: 0;
          font-size: 14px;
          line-height: 1.35;
          color: var(--app-muted);
        }

        .today-hero__actions {
          display: grid;
          gap: 10px;
          margin-top: 18px;
        }

        @media (min-width: 390px) {
          .today-hero__actions {
            grid-template-columns: 1fr 1fr;
          }
        }

        .today-btn {
          min-height: 48px;
          border-radius: 16px;
          border: 0;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
        }

        .today-btn--primary {
          background: var(--app-primary);
          color: #fff;
        }

        .today-btn--secondary {
          background: #f8fafe;
          color: var(--app-text);
          border: 1px solid var(--app-line);
        }

        .today-section-title {
          margin: 0 0 14px;
          font-size: 16px;
          line-height: 1.25;
          font-weight: 750;
          letter-spacing: -0.02em;
        }

        .today-pending-list,
        .today-upcoming-list {
          display: grid;
          gap: 12px;
        }

        .today-pending-item {
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 12px;
          min-height: 56px;
        }

        .today-pending-item__icon {
          width: 36px;
          height: 36px;
          border-radius: 12px;
          display: grid;
          place-items: center;
          font-size: 16px;
          flex-shrink: 0;
        }

        .today-pending-item__icon--consent {
          background: #eef4ff;
        }

        .today-pending-item__icon--payment {
          background: #eff8f1;
        }

        .today-pending-item__icon--session {
          background: #fff5ea;
        }

        .today-pending-item__copy {
          min-width: 0;
        }

        .today-pending-item__title,
        .today-upcoming-item__title {
          margin: 0;
          font-size: 14px;
          line-height: 1.25;
          font-weight: 700;
          color: var(--app-text);
        }

        .today-pending-item__subtitle,
        .today-upcoming-item__subtitle {
          margin: 4px 0 0;
          font-size: 13px;
          line-height: 1.25;
          color: var(--app-muted);
        }

        .today-inline-link {
          border: 0;
          background: transparent;
          color: var(--app-primary);
          font-size: 13px;
          font-weight: 700;
          padding: 0;
          cursor: pointer;
          white-space: nowrap;
        }

        .today-upcoming-item {
          width: 100%;
          border: 0;
          background: transparent;
          padding: 0;
          display: grid;
          grid-template-columns: 56px 1fr auto;
          align-items: center;
          gap: 12px;
          text-align: left;
          cursor: pointer;
        }

        .today-upcoming-item__time {
          font-size: 16px;
          font-weight: 800;
          letter-spacing: -0.02em;
        }

        .today-upcoming-item__copy {
          min-width: 0;
        }

        .today-shortcuts {
          display: grid;
          gap: 12px;
          grid-template-columns: repeat(2, 1fr);
        }

        .today-shortcuts > :last-child {
          grid-column: 1 / -1;
        }

        @media (min-width: 390px) {
          .today-shortcuts {
            grid-template-columns: repeat(3, 1fr);
          }

          .today-shortcuts > :last-child {
            grid-column: auto;
          }
        }

        .today-shortcut {
          min-height: 84px;
          border: 1px solid var(--app-line);
          background: var(--app-surface);
          border-radius: 20px;
          box-shadow: var(--app-shadow);
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          padding: 14px 14px 12px;
          gap: 8px;
          cursor: pointer;
        }

        .today-shortcut__icon {
          width: 36px;
          height: 36px;
          border-radius: 12px;
          display: grid;
          place-items: center;
          background: var(--app-primary-soft);
          color: var(--app-primary);
          font-size: 16px;
          line-height: 1;
        }

        .today-shortcut__label {
          font-size: 14px;
          font-weight: 700;
          color: var(--app-text);
          line-height: 1.2;
        }
      `}</style>
    </main>
  );
}
