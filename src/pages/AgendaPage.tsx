import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  agendaDateKeys,
  getAgendaDay,
  mockNow,
  type AgendaAppointment,
  type AgendaAppointmentStatus,
} from "../mocks/agenda.mock";

function timeToMinutes(time: string) {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
}

function sortAppointments(appointments: AgendaAppointment[]) {
  return [...appointments].sort((left, right) => {
    return timeToMinutes(left.time) - timeToMinutes(right.time);
  });
}

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

function findNextAvailableAppointment(
  appointments: AgendaAppointment[],
  nowTime: string
) {
  const nowMinutes = timeToMinutes(nowTime);
  return appointments.find((item) => timeToMinutes(item.time) >= nowMinutes);
}

function getDefaultSelectedId(
  appointments: AgendaAppointment[],
  selectedDate: string
) {
  if (!appointments.length) {
    return "";
  }

  if (selectedDate === agendaDateKeys.today) {
    return (
      findNextAvailableAppointment(appointments, mockNow)?.id ?? appointments[0].id
    );
  }

  return appointments[0].id;
}

function getCollapsedAppointments(
  appointments: AgendaAppointment[],
  selectedDate: string
) {
  if (appointments.length <= 3) {
    return appointments;
  }

  if (selectedDate !== agendaDateKeys.today) {
    return appointments.slice(0, 3);
  }

  const nextAvailable = findNextAvailableAppointment(appointments, mockNow);
  const anchorIndex = nextAvailable
    ? appointments.findIndex((item) => item.id === nextAvailable.id)
    : 0;

  return appointments.slice(anchorIndex >= 0 ? anchorIndex : 0, anchorIndex + 3);
}

export default function AgendaPage() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<string>(agendaDateKeys.today);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [draftDate, setDraftDate] = useState<string>(agendaDateKeys.today);

  const activeDay = useMemo(() => getAgendaDay(selectedDate), [selectedDate]);
  const sortedAppointments = useMemo(
    () => sortAppointments(activeDay.appointments),
    [activeDay]
  );
  const [selectedId, setSelectedId] = useState(() =>
    getDefaultSelectedId(
      sortAppointments(getAgendaDay(agendaDateKeys.today).appointments),
      agendaDateKeys.today
    )
  );

  const todayAppointments = useMemo(
    () => sortAppointments(getAgendaDay(agendaDateKeys.today).appointments),
    []
  );
  const nextAvailableToday = useMemo(
    () => findNextAvailableAppointment(todayAppointments, mockNow),
    [todayAppointments]
  );
  const isTodaySelected = selectedDate === agendaDateKeys.today;

  const selected = useMemo(() => {
    return (
      sortedAppointments.find((item) => item.id === selectedId) ?? sortedAppointments[0]
    );
  }, [selectedId, sortedAppointments]);

  const visibleAppointments = useMemo(() => {
    if (isExpanded) {
      return sortedAppointments;
    }

    return getCollapsedAppointments(sortedAppointments, selectedDate);
  }, [isExpanded, selectedDate, sortedAppointments]);

  const hiddenCount = Math.max(sortedAppointments.length - visibleAppointments.length, 0);
  const minutesUntilSelected = selected
    ? timeToMinutes(selected.time) - timeToMinutes(mockNow)
    : Number.POSITIVE_INFINITY;
  const showOpenTurn = Boolean(
    selected &&
      isTodaySelected &&
      nextAvailableToday &&
      selected.id === nextAvailableToday.id &&
      minutesUntilSelected >= 0 &&
      minutesUntilSelected < 5
  );

  const quickChips = [
    { label: "Ayer", dateKey: agendaDateKeys.yesterday },
    { label: "Hoy", dateKey: agendaDateKeys.today },
    { label: "Mañana", dateKey: agendaDateKeys.tomorrow },
  ];

  function applySelectedDate(nextDate: string) {
    const nextAppointments = sortAppointments(getAgendaDay(nextDate).appointments);

    setSelectedDate(nextDate);
    setSelectedId(getDefaultSelectedId(nextAppointments, nextDate));
    setIsExpanded(false);
  }

  function openDateModal() {
    setDraftDate(selectedDate);
    setIsDateModalOpen(true);
  }

  function applyCustomDate() {
    applySelectedDate(draftDate);
    setIsDateModalOpen(false);
  }

  return (
    <main className="agenda-screen">
      <div className="agenda-safe-top" />

      <section className="agenda-content">
        <header className="agenda-header">
          <button
            type="button"
            className="agenda-icon-button"
            aria-label="Elegir fecha"
            onClick={openDateModal}
          >
            <svg
              className="agenda-icon-button__svg"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <rect x="4" y="5" width="16" height="15" rx="3" />
              <path d="M8 3v4M16 3v4M4 9h16" />
            </svg>
          </button>

          <button
            type="button"
            className="agenda-icon-button"
            aria-label="Nuevo turno"
            onClick={() => navigate("/nuevo-turno")}
          >
            <span className="agenda-icon-button__icon">+</span>
          </button>
        </header>

        <article
          className={`agenda-card agenda-card--date ${
            isTodaySelected ? "agenda-card--date-today" : ""
          }`.trim()}
        >
          <div className="agenda-date-bar">
            <div className="agenda-date-bar__chips">
              {quickChips.map((chip) => (
                <button
                  key={chip.dateKey}
                  type="button"
                  className={`agenda-date-chip ${
                    selectedDate === chip.dateKey ? "agenda-date-chip--active" : ""
                  }`.trim()}
                  onClick={() => applySelectedDate(chip.dateKey)}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            <span className="agenda-date-bar__label">{activeDay.dateLabel}</span>
            <span className="agenda-date-bar__availability">
              {activeDay.availabilityLabel}
            </span>
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
            {visibleAppointments.length ? (
              <div className="agenda-list">
                {visibleAppointments.map((item) => {
                  const isSelected = item.id === selected?.id;

                  return (
                    <button
                      key={`${selectedDate}-${item.id}-${item.time}`}
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
            ) : (
              <div className="agenda-empty-state">
                <p className="agenda-empty-state__title">No hay turnos para este día</p>
                <p className="agenda-empty-state__copy">
                  Probá con otra fecha desde el calendario.
                </p>
              </div>
            )}

            {!isExpanded && hiddenCount > 0 ? (
              <p className="agenda-list-card__foot">{hiddenCount} turnos más ocultos</p>
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

              <div
                className={`agenda-selected__actions ${
                  showOpenTurn ? "" : "agenda-selected__actions--single"
                }`.trim()}
              >
                {showOpenTurn ? (
                  <button
                    type="button"
                    className="agenda-btn agenda-btn--primary"
                    onClick={() => navigate(`/turno/${selected.id}`)}
                  >
                    Abrir turno
                  </button>
                ) : null}

                <button
                  type="button"
                  className={showOpenTurn ? "agenda-btn agenda-btn--secondary" : "agenda-btn agenda-btn--primary"}
                  onClick={() => navigate(`/paciente/${selected.patientId}/historial`)}
                >
                  Historial
                </button>
              </div>
            </div>
          </article>
        ) : null}
      </section>

      {isDateModalOpen ? (
        <div className="agenda-modal-backdrop" role="presentation">
          <div
            className="agenda-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="agenda-date-modal-title"
          >
            <div className="agenda-modal__header">
              <div>
                <h2 id="agenda-date-modal-title" className="agenda-modal__title">
                  Elegir fecha
                </h2>
                <p className="agenda-modal__description">
                  Seleccioná un día para ver disponibilidad y turnos.
                </p>
              </div>

              <button
                type="button"
                className="agenda-modal__close"
                aria-label="Cerrar"
                onClick={() => setIsDateModalOpen(false)}
              >
                ×
              </button>
            </div>

            <input
              type="date"
              className="agenda-modal__input"
              value={draftDate}
              onChange={(event) => setDraftDate(event.target.value)}
            />

            <div className="agenda-modal__actions">
              <button
                type="button"
                className="agenda-btn agenda-btn--secondary"
                onClick={() => setIsDateModalOpen(false)}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="agenda-btn agenda-btn--primary"
                onClick={applyCustomDate}
                disabled={!draftDate}
              >
                Aplicar
              </button>
            </div>
          </div>
        </div>
      ) : null}

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
          font-size: 24px;
          line-height: 1;
          font-weight: 700;
        }

        .agenda-icon-button__svg {
          width: 22px;
          height: 22px;
          fill: none;
          stroke: currentColor;
          stroke-width: 1.8;
          stroke-linecap: round;
          stroke-linejoin: round;
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
          padding: 14px;
          background: linear-gradient(180deg, #fbfdff 0%, #f2f7fd 100%);
        }

        .agenda-card--date-today {
          background: linear-gradient(180deg, #fbfefd 0%, #eef8f1 100%);
          border-color: #d9eadf;
        }

        .agenda-card--selected {
          background: linear-gradient(180deg, #fafdff 0%, #f2f7fd 100%);
        }

        .agenda-date-bar {
          display: grid;
          gap: 10px;
          justify-items: center;
          text-align: center;
        }

        .agenda-date-bar__chips {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 8px;
        }

        .agenda-date-chip {
          min-height: 36px;
          border-radius: 999px;
          border: 1px solid #d7e3f0;
          background: rgba(255, 255, 255, 0.82);
          color: #4f6785;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
        }

        .agenda-date-chip--active {
          background: #2d5f93;
          border-color: #2d5f93;
          color: #ffffff;
          box-shadow: 0 10px 18px rgba(45, 95, 147, 0.14);
        }

        .agenda-card--date-today .agenda-date-chip--active {
          background: #2f7b56;
          border-color: #2f7b56;
          box-shadow: 0 10px 18px rgba(47, 123, 86, 0.16);
        }

        .agenda-date-bar__label {
          font-size: 20px;
          line-height: 1.16;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: #163252;
        }

        .agenda-date-bar__availability {
          font-size: 13px;
          line-height: 1.3;
          color: #647a93;
          font-weight: 700;
        }

        .agenda-card--date-today .agenda-date-bar__availability {
          color: #467357;
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

        .agenda-empty-state {
          min-height: 100%;
          display: grid;
          place-content: center;
          gap: 6px;
          padding: 18px 12px;
          text-align: center;
        }

        .agenda-empty-state__title {
          margin: 0;
          font-size: 16px;
          line-height: 1.2;
          color: #163252;
          font-weight: 800;
        }

        .agenda-empty-state__copy {
          margin: 0;
          font-size: 13px;
          line-height: 1.35;
          color: #70829d;
          font-weight: 600;
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
          border-color: #6e9ccc;
          background: linear-gradient(180deg, #f4f9ff 0%, #ebf4fd 100%);
          box-shadow: 0 12px 22px rgba(45, 95, 147, 0.13);
          outline: 2px solid rgba(45, 95, 147, 0.12);
          outline-offset: 0;
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

        .agenda-selected__actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-top: 14px;
        }

        .agenda-selected__actions--single {
          grid-template-columns: 1fr;
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

        .agenda-btn--primary:disabled {
          opacity: 0.55;
          cursor: not-allowed;
          box-shadow: none;
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

        .agenda-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(17, 25, 40, 0.36);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          z-index: 20;
        }

        .agenda-modal {
          width: min(100%, 390px);
          border-radius: 24px;
          background: #ffffff;
          border: 1px solid #dce7f3;
          box-shadow: 0 20px 40px rgba(17, 25, 40, 0.18);
          padding: 16px;
        }

        .agenda-modal__header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 14px;
        }

        .agenda-modal__title {
          margin: 0;
          font-size: 20px;
          line-height: 1.1;
          font-weight: 800;
          color: #163252;
        }

        .agenda-modal__description {
          margin: 6px 0 0;
          font-size: 13px;
          line-height: 1.35;
          color: #6b7f99;
          font-weight: 600;
        }

        .agenda-modal__close {
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

        .agenda-modal__input {
          width: 100%;
          min-height: 52px;
          border-radius: 16px;
          border: 1px solid #d6e2ef;
          background: #fbfdff;
          padding: 0 14px;
          color: #163252;
          font: inherit;
        }

        .agenda-modal__actions {
          display: grid;
          gap: 10px;
          margin-top: 14px;
        }

        @media (min-width: 390px) {
          .agenda-modal__actions {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 374px) {
          .agenda-content {
            gap: 10px;
          }

          .agenda-card--date {
            padding: 12px;
          }

          .agenda-date-bar__chips {
            gap: 6px;
          }

          .agenda-date-chip {
            min-height: 34px;
            font-size: 11px;
          }

          .agenda-date-bar__label {
            font-size: 17px;
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

          .agenda-selected__actions {
            grid-template-columns: 1fr;
          }
        }

        @media (max-height: 700px) {
          .agenda-content {
            padding-top: 8px;
            gap: 10px;
          }

          .agenda-card--date {
            padding: 12px;
          }

          .agenda-date-bar {
            gap: 8px;
          }

          .agenda-date-chip {
            min-height: 34px;
          }

          .agenda-date-bar__label {
            font-size: 17px;
          }

          .agenda-date-bar__availability {
            font-size: 12px;
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

          .agenda-card__inner,
          .agenda-modal {
            padding: 14px;
          }

          .agenda-selected__patient {
            font-size: 17px;
          }

          .agenda-selected__time {
            font-size: 21px;
          }

          .agenda-selected__treatment,
          .agenda-empty-state__copy,
          .agenda-modal__description {
            font-size: 12px;
          }

          .agenda-btn,
          .agenda-icon-button {
            min-height: 44px;
          }

          .agenda-btn {
            font-size: 13px;
          }
        }
      `}</style>
    </main>
  );
}
