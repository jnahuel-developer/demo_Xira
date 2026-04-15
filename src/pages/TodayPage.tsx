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
  const notificationCount = todayMock.pendingItems.length;

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
            <span className="today-icon-button__icon">◌</span>
            {notificationCount > 0 ? (
              <span className="today-icon-button__badge">{notificationCount}</span>
            ) : null}
          </button>
        </header>

        <div className="today-stack">
          <article className="today-card today-card--hero">
            <div className="today-card__inner">
              <div className="today-hero__top">
                <p className="today-hero__eyebrow">Próximo turno</p>
                <span className="today-chip today-chip--primary">
                  {todayMock.hero.statusLabel}
                </span>
              </div>

              <div className="today-hero__summary">
                <p className="today-hero__time">{todayMock.hero.time}</p>
                <p className="today-hero__treatment">{todayMock.hero.treatment}</p>
              </div>

              <h2 className="today-hero__patient">{todayMock.hero.patient}</h2>
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
                  onClick={() =>
                    navigate(`/paciente/${todayMock.hero.patientId}/historial`)
                  }
                >
                  Historial
                </button>
              </div>
            </div>
          </article>

          <article className="today-card">
            <div className="today-card__inner">
              <div className="today-section-head">
                <h3 className="today-section-title">Pendientes de hoy</h3>
                <span className="today-section-count">
                  {todayMock.pendingItems.length}
                </span>
              </div>

              <div className="today-pending-list">
                {todayMock.pendingItems.slice(0, 3).map((item) => (
                  <div key={item.id} className="today-pending-item">
                    <div
                      className={`today-pending-item__icon today-pending-item__icon--${item.kind}`}
                      aria-hidden="true"
                    >
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
              <div className="today-section-head">
                <h3 className="today-section-title">Después sigue</h3>
                <button
                  type="button"
                  className="today-inline-link"
                  onClick={() => navigate("/agenda")}
                >
                  Ver agenda
                </button>
              </div>

              <div className="today-upcoming-list">
                {todayMock.upcomingItems.slice(0, 3).map((item) => (
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

                    <span className={upcomingStatusClass(item.status)}>
                      {item.status}
                    </span>
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
              <span className="today-shortcut__icon" aria-hidden="true">
                ＋
              </span>
              <span className="today-shortcut__label">Nuevo turno</span>
            </button>

            <button
              type="button"
              className="today-shortcut"
              onClick={() => navigate("/agenda")}
            >
              <span className="today-shortcut__icon" aria-hidden="true">
                ☷
              </span>
              <span className="today-shortcut__label">Ver agenda</span>
            </button>

            <button
              type="button"
              className="today-shortcut"
              onClick={() => navigate("/pacientes")}
            >
              <span className="today-shortcut__icon" aria-hidden="true">
                ⌕
              </span>
              <span className="today-shortcut__label">Pacientes</span>
            </button>
          </section>
        </div>
      </section>

      <style>{`
        .today-screen {
          min-height: 100vh;
          background: linear-gradient(180deg, #f7fbff 0%, #eef4fb 100%);
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
          color: #7387a1;
          font-weight: 600;
        }

        .today-header__name {
          margin: 0;
          font-size: 28px;
          line-height: 1.04;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: #163252;
        }

        .today-header__clinic {
          margin: 6px 0 0;
          font-size: 14px;
          line-height: 1.3;
          color: #6b7f99;
          font-weight: 600;
        }

        .today-icon-button {
          width: 44px;
          height: 44px;
          border: 1px solid #d6e2ef;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.9);
          box-shadow: 0 10px 22px rgba(45, 95, 147, 0.08);
          display: grid;
          place-items: center;
          position: relative;
          color: #163252;
          cursor: pointer;
          flex-shrink: 0;
        }

        .today-icon-button__icon {
          font-size: 18px;
          line-height: 1;
        }

        .today-icon-button__badge {
          position: absolute;
          top: 4px;
          right: 4px;
          min-width: 18px;
          height: 18px;
          padding: 0 4px;
          border-radius: 999px;
          background: #2d5f93;
          color: #fff;
          display: grid;
          place-items: center;
          font-size: 10px;
          font-weight: 800;
          border: 2px solid #fff;
        }

        .today-stack {
          display: grid;
          gap: 16px;
        }

        .today-card {
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid #dce7f3;
          border-radius: 24px;
          box-shadow: 0 10px 28px rgba(48, 90, 138, 0.07);
        }

        .today-card--hero {
          background: linear-gradient(180deg, #fbfdff 0%, #f1f7fe 100%);
        }

        .today-card__inner {
          padding: 16px;
        }

        .today-hero__top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 14px;
        }

        .today-hero__eyebrow {
          margin: 0;
          font-size: 12px;
          line-height: 1.2;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #7387a1;
        }

        .today-chip {
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

        .today-chip--primary {
          background: #e8f1fb;
          color: #2d5f93;
        }

        .today-chip--success {
          background: #edf7f2;
          color: #2d7b53;
        }

        .today-chip--warning {
          background: #fff5e8;
          color: #9d6d19;
        }

        .today-hero__summary {
          display: flex;
          align-items: baseline;
          gap: 10px;
          min-width: 0;
        }

        .today-hero__time {
          margin: 0;
          font-size: 34px;
          line-height: 0.95;
          font-weight: 800;
          letter-spacing: -0.05em;
          color: #163252;
          flex-shrink: 0;
        }

        .today-hero__treatment {
          margin: 0;
          min-width: 0;
          font-size: 15px;
          line-height: 1.2;
          color: #627791;
          font-weight: 700;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .today-hero__patient {
          margin: 12px 0 0;
          font-size: 22px;
          line-height: 1.06;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: #163252;
        }

        .today-hero__meta {
          margin: 8px 0 0;
          font-size: 13px;
          line-height: 1.35;
          color: #7387a1;
          font-weight: 600;
        }

        .today-hero__actions {
          display: grid;
          gap: 10px;
          margin-top: 16px;
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
          font-weight: 800;
          cursor: pointer;
        }

        .today-btn--primary {
          background: #2d5f93;
          color: #fff;
          box-shadow: 0 12px 24px rgba(45, 95, 147, 0.16);
        }

        .today-btn--secondary {
          background: #edf4fb;
          color: #163252;
          border: 1px solid #d9e6f4;
        }

        .today-section-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 14px;
        }

        .today-section-title {
          margin: 0;
          font-size: 18px;
          line-height: 1.15;
          font-weight: 800;
          color: #163252;
        }

        .today-section-count {
          min-width: 32px;
          height: 32px;
          border-radius: 999px;
          background: #edf4fb;
          color: #55759b;
          display: grid;
          place-items: center;
          font-size: 13px;
          font-weight: 800;
          flex-shrink: 0;
        }

        .today-pending-list,
        .today-upcoming-list {
          display: grid;
          gap: 10px;
        }

        .today-pending-item,
        .today-upcoming-item {
          width: 100%;
          border: 1px solid #dce8f5;
          background: #fbfdff;
          border-radius: 18px;
          padding: 14px;
        }

        .today-pending-item {
          display: grid;
          grid-template-columns: 36px minmax(0, 1fr) auto;
          gap: 12px;
          align-items: center;
        }

        .today-pending-item__icon {
          width: 36px;
          height: 36px;
          border-radius: 12px;
          display: grid;
          place-items: center;
          font-size: 15px;
          font-weight: 800;
        }

        .today-pending-item__icon--consent {
          background: #e8f1fb;
          color: #2d5f93;
        }

        .today-pending-item__icon--payment {
          background: #edf7f2;
          color: #2d7b53;
        }

        .today-pending-item__icon--session {
          background: #eef4f8;
          color: #617990;
        }

        .today-pending-item__copy,
        .today-upcoming-item__copy {
          min-width: 0;
        }

        .today-pending-item__title,
        .today-upcoming-item__title {
          margin: 0;
          font-size: 14px;
          line-height: 1.2;
          font-weight: 800;
          color: #163252;
        }

        .today-pending-item__subtitle,
        .today-upcoming-item__subtitle {
          margin: 4px 0 0;
          font-size: 13px;
          line-height: 1.3;
          color: #6e829a;
          font-weight: 600;
        }

        .today-inline-link {
          border: 0;
          background: transparent;
          padding: 0;
          color: #2d5f93;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
        }

        .today-upcoming-item {
          display: grid;
          grid-template-columns: 52px minmax(0, 1fr) auto;
          gap: 12px;
          align-items: center;
          text-align: left;
          cursor: pointer;
        }

        .today-upcoming-item__time {
          font-size: 17px;
          line-height: 1;
          font-weight: 800;
          color: #163252;
        }

        .today-shortcuts {
          display: grid;
          gap: 10px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .today-shortcut {
          min-height: 92px;
          border: 1px solid #dce7f3;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.9);
          box-shadow: 0 10px 24px rgba(48, 90, 138, 0.06);
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          gap: 10px;
          padding: 14px;
          color: #163252;
          cursor: pointer;
          text-align: left;
        }

        .today-shortcut__icon {
          width: 34px;
          height: 34px;
          border-radius: 12px;
          background: #edf4fb;
          color: #2d5f93;
          display: grid;
          place-items: center;
          font-size: 16px;
          line-height: 1;
        }

        .today-shortcut__label {
          font-size: 13px;
          line-height: 1.2;
          font-weight: 800;
        }

        @media (max-width: 374px) {
          .today-shortcuts {
            grid-template-columns: 1fr 1fr;
          }

          .today-shortcut:last-child {
            grid-column: 1 / -1;
            min-height: 72px;
          }

          .today-pending-item {
            grid-template-columns: 32px minmax(0, 1fr);
          }

          .today-inline-link {
            grid-column: 2;
            justify-self: start;
          }

          .today-upcoming-item {
            grid-template-columns: 44px minmax(0, 1fr);
          }

          .today-upcoming-item .today-chip {
            grid-column: 2;
            justify-self: start;
          }
        }

        @media (max-height: 700px) {
          .today-content {
            padding-top: 8px;
          }

          .today-header__name {
            font-size: 26px;
          }

          .today-card__inner {
            padding: 14px;
          }

          .today-hero__time {
            font-size: 30px;
          }

          .today-hero__patient {
            font-size: 20px;
          }

          .today-btn {
            min-height: 44px;
            font-size: 14px;
          }

          .today-pending-item,
          .today-upcoming-item {
            padding: 12px;
          }

          .today-shortcut {
            min-height: 82px;
          }
        }
      `}</style>
    </main>
  );
}
