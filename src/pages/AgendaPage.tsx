import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { agendaMock, type AgendaAppointment, type AgendaAppointmentStatus } from "../mocks/agenda.mock";

type AgendaDayView = {
  id: string;
  label: string;
  helper: string;
};

const agendaDayViews: AgendaDayView[] = [
  {
    id: "previous",
    label: "Lunes 13 de mayo",
    helper: "Ayer",
  },
  {
    id: "current",
    label: agendaMock.dateLabel,
    helper: "Hoy",
  },
  {
    id: "next",
    label: "Miércoles 15 de mayo",
    helper: "Mañana",
  },
];

const currentDayIndex = 1;

const sortedAppointments = [...agendaMock.appointments].sort((left, right) => {
  const [leftHour, leftMinute] = left.time.split(":").map(Number);
  const [rightHour, rightMinute] = right.time.split(":").map(Number);

  return leftHour * 60 + leftMinute - (rightHour * 60 + rightMinute);
});

function statusClass(status: AgendaAppointmentStatus) {
  switch (status) {
    case "Próximo":
      return "agenda-chip agenda-chip--primary";
    case "Confirmado":
      return "agenda-chip agenda-chip--success";
    case "Esperando":
      return "agenda-chip agenda-chip--warning";
    case "En curso":
      return "agenda-chip agenda-chip--accent";
    case "Pendiente":
      return "agenda-chip agenda-chip--danger";
    case "Reprogramado":
      return "agenda-chip agenda-chip--muted";
    default:
      return "agenda-chip agenda-chip--primary";
  }
}

function statusPriority(status: AgendaAppointmentStatus) {
  switch (status) {
    case "En curso":
      return 0;
    case "Esperando":
      return 1;
    case "Próximo":
      return 2;
    case "Confirmado":
      return 3;
    case "Pendiente":
      return 4;
    case "Reprogramado":
      return 5;
    default:
      return 10;
  }
}

function pickPriorityAppointment(appointments: AgendaAppointment[]) {
  return [...appointments].sort((left, right) => {
    const priorityDiff = statusPriority(left.status) - statusPriority(right.status);

    if (priorityDiff !== 0) {
      return priorityDiff;
    }

    const [leftHour, leftMinute] = left.time.split(":").map(Number);
    const [rightHour, rightMinute] = right.time.split(":").map(Number);

    return leftHour * 60 + leftMinute - (rightHour * 60 + rightMinute);
  })[0];
}

function collapsedWindow(
  appointments: AgendaAppointment[],
  anchorId: string,
  windowSize: number
) {
  const anchorIndex = appointments.findIndex((item) => item.id === anchorId);
  const safeAnchorIndex = anchorIndex >= 0 ? anchorIndex : 0;
  const start = Math.max(
    0,
    Math.min(safeAnchorIndex, Math.max(appointments.length - windowSize, 0))
  );

  return appointments.slice(start, start + windowSize);
}

export default function AgendaPage() {
  const navigate = useNavigate();
  const priorityAppointment = pickPriorityAppointment(sortedAppointments);
  const [selectedId, setSelectedId] = useState<string>(
    priorityAppointment?.id ?? sortedAppointments[0]?.id ?? ""
  );
  const [activeDayIndex, setActiveDayIndex] = useState<number>(currentDayIndex);
  const [isExpanded, setIsExpanded] = useState(false);

  const activeDay = agendaDayViews[activeDayIndex];

  const selected = useMemo(() => {
    return (
      sortedAppointments.find((item) => item.id === selectedId) ??
      priorityAppointment ??
      sortedAppointments[0]
    );
  }, [selectedId, priorityAppointment]);

  const visibleAppointments = useMemo(() => {
    if (isExpanded) {
      return sortedAppointments;
    }

    return collapsedWindow(
      sortedAppointments,
      priorityAppointment?.id ?? sortedAppointments[0]?.id ?? "",
      3
    );
  }, [isExpanded, priorityAppointment]);

  const hiddenCount = Math.max(sortedAppointments.length - visibleAppointments.length, 0);

  function moveDay(direction: -1 | 1) {
    setActiveDayIndex((current) => {
      const next = current + direction;

      if (next < 0) {
        return agendaDayViews.length - 1;
      }

      if (next >= agendaDayViews.length) {
        return 0;
      }

      return next;
    });
  }

  return (
    <main className="agenda-screen">
      <div className="agenda-safe-top" />

      <section className="agenda-content">
        <header className="agenda-header">
          <div className="agenda-header__copy">
            <h1 className="agenda-header__title">Agenda</h1>
          </div>

          <button
            type="button"
            className="agenda-icon-button"
            aria-label="Nuevo turno"
            onClick={() => navigate("/agenda")}
          >
            <span className="agenda-icon-button__icon">＋</span>
          </button>
        </header>

        <article className="agenda-card agenda-card--date">
          <div className="agenda-date-bar">
            <button
              type="button"
              className="agenda-date-bar__nav"
              aria-label="Día anterior"
              onClick={() => moveDay(-1)}
            >
              ‹
            </button>

            <div className="agenda-date-bar__center">
              <div className="agenda-date-bar__meta-row">
                <span className="agenda-date-bar__helper">{activeDay.helper}</span>

                {activeDayIndex !== currentDayIndex ? (
                  <button
                    type="button"
                    className="agenda-date-bar__today"
                    onClick={() => setActiveDayIndex(currentDayIndex)}
                  >
                    Volver a hoy
                  </button>
                ) : null}
              </div>

              <span className="agenda-date-bar__label">{activeDay.label}</span>
            </div>

            <button
              type="button"
              className="agenda-date-bar__nav"
              aria-label="Día siguiente"
              onClick={() => moveDay(1)}
            >
              ›
            </button>
          </div>
        </article>

        <section className="agenda-list-card">
          <div className="agenda-list-card__head">
            <h2 className="agenda-section-title">Turnos del día</h2>

            {sortedAppointments.length > 3 ? (
              <button
                type="button"
                className="agenda-inline-link"
                onClick={() => setIsExpanded((current) => !current)}
              >
                {isExpanded ? "Ver menos" : "Ver toda"}
              </button>
            ) : null}
          </div>

          <div className="agenda-list-scroll">
            <div className="agenda-list">
              {visibleAppointments.map((item) => {
                const isSelected = item.id === selected?.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`agenda-row ${
                      isSelected ? "agenda-row--selected" : ""
                    }`.trim()}
                    aria-pressed={isSelected}
                    onClick={() => setSelectedId(item.id)}
                  >
                    <div className="agenda-row__time">{item.time}</div>

                    <div className="agenda-row__content">
                      <p className="agenda-row__patient">{item.patient}</p>
                      <p className="agenda-row__treatment">{item.treatment}</p>
                    </div>

                    <div className="agenda-row__meta">
                      <span className={statusClass(item.status)}>{item.status}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {!isExpanded && hiddenCount > 0 ? (
              <p className="agenda-list-card__foot">
                {hiddenCount} turnos más ocultos
              </p>
            ) : null}
          </div>
        </section>

        {selected ? (
          <article className="agenda-card agenda-card--selected">
            <div className="agenda-card__inner">
              <div className="agenda-selected__top">
                <h3 className="agenda-selected__patient">{selected.patient}</h3>

                <span className={statusClass(selected.status)}>{selected.status}</span>
              </div>

              <div className="agenda-selected__summary-line">
                <p className="agenda-selected__time">{selected.time}</p>
                <p className="agenda-selected__treatment">{selected.treatment}</p>
              </div>

              {selected.note ? (
                <p className="agenda-selected__note">{selected.note}</p>
              ) : null}

              <div className="agenda-selected__actions">
                <button
                  type="button"
                  className="agenda-btn agenda-btn--primary"
                  onClick={() => navigate(`/turno/${selected.id}`)}
                >
                  Abrir turno
                </button>

                <button
                  type="button"
                  className="agenda-btn agenda-btn--secondary"
                  onClick={() => navigate(`/turno/${selected.id}`)}
                >
                  Ficha
                </button>
              </div>
            </div>
          </article>
        ) : null}
      </section>

      <style>{`
        .agenda-screen {
          min-height: calc(100dvh - 92px - env(safe-area-inset-bottom, 0px));
          height: calc(100dvh - 92px - env(safe-area-inset-bottom, 0px));
          background: linear-gradient(180deg, #f7fbff 0%, #eef4fb 100%);
          overflow: hidden;
        }

        .agenda-safe-top {
          height: env(safe-area-inset-top, 0px);
          min-height: 8px;
        }

        .agenda-content {
          height: calc(100% - env(safe-area-inset-top, 0px));
          padding: 12px 16px 16px;
          display: grid;
          grid-template-rows: auto auto minmax(0, 1fr) auto;
          gap: 12px;
          overflow: hidden;
        }

        @media (min-width: 390px) {
          .agenda-content {
            padding-left: 20px;
            padding-right: 20px;
          }
        }

        .agenda-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding-top: 2px;
        }

        .agenda-header__copy {
          min-width: 0;
        }

        .agenda-header__title {
          margin: 0;
          font-size: 30px;
          line-height: 1;
          font-weight: 800;
          letter-spacing: -0.04em;
          color: #163252;
        }

        .agenda-icon-button {
          width: 44px;
          height: 44px;
          border: 1px solid #d6e2ef;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.9);
          box-shadow: 0 10px 22px rgba(45, 95, 147, 0.08);
          display: grid;
          place-items: center;
          color: #163252;
          cursor: pointer;
          flex-shrink: 0;
        }

        .agenda-icon-button__icon {
          font-size: 22px;
          line-height: 1;
          font-weight: 700;
        }

        .agenda-card,
        .agenda-list-card {
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid #dce7f3;
          border-radius: 22px;
          box-shadow: 0 10px 28px rgba(48, 90, 138, 0.07);
        }

        .agenda-card__inner {
          padding: 16px;
        }

        .agenda-card--date {
          padding: 12px 14px;
        }

        .agenda-card--selected {
          background: linear-gradient(180deg, #fafdff 0%, #f2f7fd 100%);
        }

        .agenda-date-bar {
          display: grid;
          grid-template-columns: 44px minmax(0, 1fr) 44px;
          align-items: center;
          gap: 8px;
        }

        .agenda-date-bar__nav {
          width: 44px;
          height: 44px;
          border-radius: 999px;
          border: 1px solid #d8e4f1;
          background: #ffffff;
          color: #163252;
          cursor: pointer;
          font-size: 22px;
          line-height: 1;
        }

        .agenda-date-bar__center {
          min-width: 0;
          display: grid;
          gap: 4px;
          justify-items: center;
          text-align: center;
        }

        .agenda-date-bar__meta-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .agenda-date-bar__helper {
          min-height: 24px;
          padding: 0 10px;
          border-radius: 999px;
          background: #eaf2fb;
          color: #4b6d96;
          display: inline-flex;
          align-items: center;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .agenda-date-bar__today {
          border: 0;
          background: transparent;
          padding: 0;
          color: #2d5f93;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .agenda-date-bar__label {
          font-size: 18px;
          line-height: 1.18;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: #163252;
        }

        .agenda-list-card {
          min-height: 0;
          padding: 14px 14px 12px;
          display: grid;
          grid-template-rows: auto minmax(0, 1fr);
          gap: 12px;
          overflow: hidden;
        }

        .agenda-list-card__head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .agenda-section-title {
          margin: 0;
          font-size: 18px;
          line-height: 1.15;
          font-weight: 800;
          color: #163252;
        }

        .agenda-list-scroll {
          min-height: 0;
          overflow-y: auto;
          padding-right: 2px;
          scrollbar-width: none;
        }

        .agenda-list-scroll::-webkit-scrollbar {
          display: none;
        }

        .agenda-list {
          display: grid;
          gap: 10px;
        }

        .agenda-list-card__foot {
          margin: 12px 0 0;
          font-size: 12px;
          line-height: 1.3;
          color: #788aa1;
          font-weight: 600;
          text-align: center;
        }

        .agenda-row {
          width: 100%;
          border: 1px solid #dce8f5;
          background: #fbfdff;
          border-radius: 18px;
          padding: 14px;
          display: grid;
          grid-template-columns: 54px minmax(0, 1fr) auto;
          gap: 12px;
          text-align: left;
          cursor: pointer;
        }

        .agenda-row--selected {
          border-color: #bfd4ea;
          background: #f2f8fe;
          box-shadow: 0 10px 22px rgba(55, 95, 145, 0.08);
        }

        .agenda-row__time {
          font-size: 18px;
          line-height: 1;
          font-weight: 800;
          color: #163252;
          padding-top: 2px;
        }

        .agenda-row__content {
          min-width: 0;
        }

        .agenda-row__patient {
          margin: 0;
          font-size: 15px;
          line-height: 1.2;
          font-weight: 800;
          color: #163252;
        }

        .agenda-row__treatment {
          margin: 4px 0 0;
          font-size: 13px;
          line-height: 1.3;
          color: #627791;
          font-weight: 600;
        }

        .agenda-row__meta {
          display: flex;
          align-items: flex-start;
          justify-content: flex-end;
        }

        .agenda-chip {
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

        .agenda-chip--primary {
          background: #e8f1fb;
          color: #2d5f93;
        }

        .agenda-chip--success {
          background: #edf7f2;
          color: #2d7b53;
        }

        .agenda-chip--warning {
          background: #fff5e8;
          color: #9d6d19;
        }

        .agenda-chip--danger {
          background: #fff0ef;
          color: #b1594e;
        }

        .agenda-chip--accent {
          background: #edf1fb;
          color: #516a9c;
        }

        .agenda-chip--muted {
          background: #eef4f8;
          color: #667e97;
        }

        .agenda-selected__top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 8px;
        }

        .agenda-selected__patient {
          margin: 0;
          font-size: 18px;
          line-height: 1.12;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: #163252;
        }

        .agenda-selected__summary-line {
          display: flex;
          align-items: baseline;
          gap: 10px;
          min-width: 0;
        }

        .agenda-selected__time {
          margin: 0;
          font-size: 24px;
          line-height: 1;
          font-weight: 800;
          letter-spacing: -0.04em;
          color: #163252;
          flex-shrink: 0;
        }

        .agenda-selected__treatment {
          margin: 0;
          font-size: 14px;
          line-height: 1.2;
          color: #627791;
          font-weight: 700;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .agenda-selected__note {
          margin: 6px 0 0;
          font-size: 12px;
          line-height: 1.32;
          color: #74869c;
          font-weight: 600;
        }

        .agenda-selected__actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-top: 14px;
        }

        .agenda-btn {
          min-height: 48px;
          border-radius: 16px;
          border: 0;
          min-width: 0;
          padding: 0 10px;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          white-space: nowrap;
        }

        .agenda-btn--primary {
          background: #2d5f93;
          color: #fff;
          box-shadow: 0 12px 24px rgba(45, 95, 147, 0.16);
        }

        .agenda-btn--secondary {
          background: #edf4fb;
          color: #163252;
          border: 1px solid #d9e6f4;
        }

        .agenda-inline-link {
          border: 0;
          background: transparent;
          padding: 0;
          color: #2d5f93;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
        }

        @media (max-width: 374px) {
          .agenda-content {
            gap: 10px;
          }

          .agenda-card--date {
            padding: 10px 12px;
          }

          .agenda-date-bar__label {
            font-size: 16px;
          }

          .agenda-list-card {
            padding: 12px;
          }

          .agenda-row {
            grid-template-columns: 48px minmax(0, 1fr);
          }

          .agenda-row__meta {
            grid-column: 2;
            justify-content: flex-start;
          }

          .agenda-btn {
            font-size: 13px;
            padding: 0 8px;
          }

          .agenda-selected__summary-line {
            gap: 8px;
          }

          .agenda-selected__time {
            font-size: 22px;
          }

          .agenda-selected__treatment {
            font-size: 13px;
          }
        }

        @media (max-height: 700px) {
          .agenda-content {
            padding-top: 8px;
            gap: 10px;
          }

          .agenda-header__title {
            font-size: 27px;
          }

          .agenda-card--date {
            padding: 10px 12px;
          }

          .agenda-date-bar__label {
            font-size: 16px;
          }

          .agenda-list-card {
            padding: 12px;
            gap: 10px;
          }

          .agenda-section-title {
            font-size: 16px;
          }

          .agenda-row {
            padding: 12px;
            gap: 10px;
          }

          .agenda-row__time {
            font-size: 16px;
          }

          .agenda-row__patient {
            font-size: 14px;
          }

          .agenda-row__treatment {
            font-size: 12px;
          }

          .agenda-card__inner {
            padding: 14px;
          }

          .agenda-selected__patient {
            font-size: 17px;
          }

          .agenda-selected__time {
            font-size: 21px;
          }

          .agenda-selected__treatment,
          .agenda-selected__note {
            font-size: 12px;
          }

          .agenda-btn {
            min-height: 44px;
            font-size: 13px;
          }
        }
      `}</style>
    </main>
  );
}
