import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  availabilityMock,
  weekdayLabels,
  type AvailabilityException,
  type AvailabilityMode,
  type TimeRange,
  type WeekdayKey,
} from "../mocks/availability.mock";

const DAY_ORDER: WeekdayKey[] = ["mon", "tue", "wed", "thu", "fri", "sat"];

function timeToMinutes(value: string) {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

function rangesOverlap(
  leftStart: string,
  leftEnd: string,
  rightStart: string,
  rightEnd: string
) {
  return (
    timeToMinutes(leftStart) < timeToMinutes(rightEnd) &&
    timeToMinutes(rightStart) < timeToMinutes(leftEnd)
  );
}

function sortRanges(ranges: TimeRange[]) {
  return [...ranges].sort((left, right) => {
    return timeToMinutes(left.start) - timeToMinutes(right.start);
  });
}

function sortExceptions(ranges: AvailabilityException[]) {
  return [...ranges].sort((left, right) => {
    const leftKey = `${left.date}-${left.start}`;
    const rightKey = `${right.date}-${right.start}`;
    return leftKey.localeCompare(rightKey);
  });
}

function getWeekdayFromDate(date: string): WeekdayKey | null {
  if (!date) {
    return null;
  }

  const day = new Date(`${date}T12:00:00`).getDay();

  if (day === 1) return "mon";
  if (day === 2) return "tue";
  if (day === 3) return "wed";
  if (day === 4) return "thu";
  if (day === 5) return "fri";
  if (day === 6) return "sat";

  return null;
}

function formatDateLabel(date: string) {
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}

function hasOverlapWithRanges(
  start: string,
  end: string,
  ranges: Array<TimeRange | AvailabilityException>
) {
  return ranges.some((range) => rangesOverlap(start, end, range.start, range.end));
}

function isContainedInHabitual(
  date: string,
  start: string,
  end: string,
  weeklySchedule: Record<WeekdayKey, TimeRange[]>
) {
  const weekday = getWeekdayFromDate(date);

  if (!weekday) {
    return false;
  }

  return weeklySchedule[weekday].some((range) => {
    return (
      timeToMinutes(range.start) <= timeToMinutes(start) &&
      timeToMinutes(range.end) >= timeToMinutes(end)
    );
  });
}

function overlapsHabitual(
  date: string,
  start: string,
  end: string,
  weeklySchedule: Record<WeekdayKey, TimeRange[]>
) {
  const weekday = getWeekdayFromDate(date);

  if (!weekday) {
    return false;
  }

  return weeklySchedule[weekday].some((range) => {
    return rangesOverlap(start, end, range.start, range.end);
  });
}

function createId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function AvailabilityPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AvailabilityMode>("habitual");
  const [selectedDay, setSelectedDay] = useState<WeekdayKey>("mon");
  const [weeklySchedule, setWeeklySchedule] = useState(availabilityMock.weeklySchedule);
  const [blockedRanges, setBlockedRanges] = useState(availabilityMock.blockedRanges);
  const [extraRanges, setExtraRanges] = useState(availabilityMock.extraRanges);
  const [habitualStart, setHabitualStart] = useState("09:00");
  const [habitualEnd, setHabitualEnd] = useState("13:00");
  const [exceptionDate, setExceptionDate] = useState("2026-04-21");
  const [exceptionStart, setExceptionStart] = useState("10:00");
  const [exceptionEnd, setExceptionEnd] = useState("11:00");

  const selectedDayRanges = useMemo(() => {
    return sortRanges(weeklySchedule[selectedDay]);
  }, [selectedDay, weeklySchedule]);

  const visibleBlockedRanges = useMemo(() => {
    return sortExceptions(blockedRanges);
  }, [blockedRanges]);

  const visibleExtraRanges = useMemo(() => {
    return sortExceptions(extraRanges);
  }, [extraRanges]);

  const isHabitualTimeValid =
    Boolean(habitualStart) &&
    Boolean(habitualEnd) &&
    timeToMinutes(habitualEnd) > timeToMinutes(habitualStart);

  const canAddHabitual =
    isHabitualTimeValid &&
    !hasOverlapWithRanges(habitualStart, habitualEnd, weeklySchedule[selectedDay]);

  const exceptionWeekday = getWeekdayFromDate(exceptionDate);
  const isExceptionTimeValid =
    Boolean(exceptionDate) &&
    Boolean(exceptionStart) &&
    Boolean(exceptionEnd) &&
    timeToMinutes(exceptionEnd) > timeToMinutes(exceptionStart);

  const canAddBlocked =
    Boolean(exceptionWeekday) &&
    isExceptionTimeValid &&
    isContainedInHabitual(exceptionDate, exceptionStart, exceptionEnd, weeklySchedule) &&
    !hasOverlapWithRanges(
      exceptionStart,
      exceptionEnd,
      blockedRanges.filter((range) => range.date === exceptionDate)
    );

  const canAddExtra =
    Boolean(exceptionWeekday) &&
    isExceptionTimeValid &&
    !overlapsHabitual(exceptionDate, exceptionStart, exceptionEnd, weeklySchedule) &&
    !hasOverlapWithRanges(
      exceptionStart,
      exceptionEnd,
      extraRanges.filter((range) => range.date === exceptionDate)
    );

  function addHabitualRange() {
    if (!canAddHabitual) {
      return;
    }

    setWeeklySchedule((current) => ({
      ...current,
      [selectedDay]: sortRanges([
        ...current[selectedDay],
        {
          id: createId(selectedDay),
          start: habitualStart,
          end: habitualEnd,
        },
      ]),
    }));
  }

  function removeHabitualRange(rangeId: string) {
    setWeeklySchedule((current) => ({
      ...current,
      [selectedDay]: current[selectedDay].filter((range) => range.id !== rangeId),
    }));
  }

  function addBlockedRange() {
    if (!canAddBlocked) {
      return;
    }

    setBlockedRanges((current) =>
      sortExceptions([
        ...current,
        {
          id: createId("block"),
          date: exceptionDate,
          start: exceptionStart,
          end: exceptionEnd,
        },
      ])
    );
  }

  function removeBlockedRange(rangeId: string) {
    setBlockedRanges((current) => current.filter((range) => range.id !== rangeId));
  }

  function addExtraRange() {
    if (!canAddExtra) {
      return;
    }

    setExtraRanges((current) =>
      sortExceptions([
        ...current,
        {
          id: createId("extra"),
          date: exceptionDate,
          start: exceptionStart,
          end: exceptionEnd,
        },
      ])
    );
  }

  function removeExtraRange(rangeId: string) {
    setExtraRanges((current) => current.filter((range) => range.id !== rangeId));
  }

  const editorToneClass =
    mode === "habitual"
      ? ""
      : mode === "blocked"
        ? "availability-editor-card--blocked"
        : "availability-editor-card--extra";

  const listTitle =
    mode === "habitual"
      ? weekdayLabels[selectedDay]
      : mode === "blocked"
        ? "Bloqueos"
        : "Extras";

  return (
    <main className="availability-screen">
      <div className="availability-safe-top" />

      <section className="availability-content">
        <header className="availability-topbar">
          <button
            type="button"
            className="availability-icon-button"
            aria-label="Volver"
            onClick={() => navigate("/mas")}
          >
            ‹
          </button>
        </header>

        <section className="availability-center-card" aria-label="Centro actual">
          <span className="availability-center-card__label">Centro actual</span>
          <p className="availability-center-card__value">{availabilityMock.centerName}</p>
        </section>

        <section className="availability-mode-card" aria-label="Modo de disponibilidad">
          {[
            { value: "habitual", label: "Habitual" },
            { value: "blocked", label: "Bloqueo" },
            { value: "extra", label: "Extra" },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              className={`availability-mode-button ${
                mode === option.value ? "availability-mode-button--active" : ""
              }`.trim()}
              onClick={() => setMode(option.value as AvailabilityMode)}
            >
              {option.label}
            </button>
          ))}
        </section>

        <section className={`availability-editor-card ${editorToneClass}`.trim()}>
          <div className="availability-editor-scroll">
            {mode === "habitual" ? (
              <>
                <div className="availability-section availability-section--tight">
                  <p className="availability-title">Nueva franja</p>

                  <div className="availability-day-chips">
                    {DAY_ORDER.map((day) => (
                      <button
                        key={day}
                        type="button"
                        className={`availability-day-chip ${
                          selectedDay === day ? "availability-day-chip--active" : ""
                        }`.trim()}
                        onClick={() => setSelectedDay(day)}
                      >
                        {weekdayLabels[day]}
                      </button>
                    ))}
                  </div>

                  <div className="availability-compact-row">
                    <label className="availability-field">
                      <span className="availability-field__label">Inicio</span>
                      <input
                        type="time"
                        className="availability-field__input"
                        value={habitualStart}
                        onChange={(event) => setHabitualStart(event.target.value)}
                      />
                    </label>

                    <label className="availability-field">
                      <span className="availability-field__label">Fin</span>
                      <input
                        type="time"
                        className="availability-field__input"
                        value={habitualEnd}
                        onChange={(event) => setHabitualEnd(event.target.value)}
                      />
                    </label>

                    <button
                      type="button"
                      className="availability-action-button"
                      aria-label="Agregar franja"
                      onClick={addHabitualRange}
                      disabled={!canAddHabitual}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="availability-section availability-section--list">
                  <p className="availability-list-title">{listTitle}</p>

                  {selectedDayRanges.length ? (
                    <div className="availability-range-list">
                      {selectedDayRanges.map((range) => (
                        <div key={range.id} className="availability-range-item">
                          <div className="availability-range-chip">
                            <span className="availability-range-chip__main">
                              {range.start} - {range.end}
                            </span>
                          </div>

                          <button
                            type="button"
                            className="availability-delete-button"
                            aria-label="Eliminar franja"
                            onClick={() => removeHabitualRange(range.id)}
                          >
                            -
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="availability-empty-state">Sin franjas cargadas.</div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="availability-section availability-section--tight">
                  <p className="availability-title">
                    {mode === "blocked" ? "Nuevo bloqueo" : "Nuevo horario extra"}
                  </p>

                  <label className="availability-field availability-field--date">
                    <span className="availability-field__label">Fecha</span>
                    <input
                      type="date"
                      className="availability-field__input"
                      value={exceptionDate}
                      onChange={(event) => setExceptionDate(event.target.value)}
                    />
                  </label>

                  <div className="availability-compact-row">
                    <label className="availability-field">
                      <span className="availability-field__label">Inicio</span>
                      <input
                        type="time"
                        className="availability-field__input"
                        value={exceptionStart}
                        onChange={(event) => setExceptionStart(event.target.value)}
                      />
                    </label>

                    <label className="availability-field">
                      <span className="availability-field__label">Fin</span>
                      <input
                        type="time"
                        className="availability-field__input"
                        value={exceptionEnd}
                        onChange={(event) => setExceptionEnd(event.target.value)}
                      />
                    </label>

                    <button
                      type="button"
                      className="availability-action-button"
                      aria-label={
                        mode === "blocked"
                          ? "Agregar bloqueo"
                          : "Agregar horario extra"
                      }
                      onClick={mode === "blocked" ? addBlockedRange : addExtraRange}
                      disabled={mode === "blocked" ? !canAddBlocked : !canAddExtra}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="availability-section availability-section--list">
                  <p className="availability-list-title">{listTitle}</p>

                  {(mode === "blocked" ? visibleBlockedRanges : visibleExtraRanges).length ? (
                    <div className="availability-range-list">
                      {(mode === "blocked"
                        ? visibleBlockedRanges
                        : visibleExtraRanges
                      ).map((range) => (
                        <div key={range.id} className="availability-range-item">
                          <div className="availability-range-chip">
                            <span className="availability-range-chip__main">
                              {formatDateLabel(range.date)}
                            </span>
                            <span className="availability-range-chip__sub">
                              {range.start} - {range.end}
                            </span>
                          </div>

                          <button
                            type="button"
                            className="availability-delete-button"
                            aria-label={
                              mode === "blocked"
                                ? "Eliminar bloqueo"
                                : "Eliminar horario extra"
                            }
                            onClick={() =>
                              mode === "blocked"
                                ? removeBlockedRange(range.id)
                                : removeExtraRange(range.id)
                            }
                          >
                            -
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="availability-empty-state">Sin franjas cargadas.</div>
                  )}
                </div>
              </>
            )}
          </div>
        </section>
      </section>

      <style>{`
        .availability-screen {
          min-height: calc(100dvh - 92px - env(safe-area-inset-bottom, 0px));
          height: calc(100dvh - 92px - env(safe-area-inset-bottom, 0px));
          background:
            radial-gradient(circle at top left, rgba(84, 140, 190, 0.15), transparent 34%),
            linear-gradient(180deg, #f7fbff 0%, #eef4fb 100%);
          overflow: hidden;
        }

        .availability-safe-top {
          height: env(safe-area-inset-top, 0px);
          min-height: 8px;
        }

        .availability-content {
          height: calc(100% - env(safe-area-inset-top, 0px));
          padding: 12px 16px 0;
          display: grid;
          grid-template-rows: auto auto auto minmax(0, 1fr);
          gap: 12px;
          overflow: hidden;
        }

        @media (min-width: 390px) {
          .availability-content {
            padding-left: 20px;
            padding-right: 20px;
          }
        }

        .availability-topbar {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          padding-top: 2px;
        }

        .availability-icon-button {
          width: 44px;
          height: 44px;
          border: 1px solid #d6e2ef;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.92);
          box-shadow: 0 10px 22px rgba(45, 95, 147, 0.08);
          display: grid;
          place-items: center;
          color: #163252;
          cursor: pointer;
          font-size: 22px;
          line-height: 1;
          font-weight: 700;
          flex-shrink: 0;
        }

        .availability-center-card,
        .availability-mode-card,
        .availability-editor-card {
          border: 1px solid #dce7f3;
          background: rgba(255, 255, 255, 0.92);
          box-shadow: 0 12px 28px rgba(48, 90, 138, 0.08);
        }

        .availability-center-card {
          border-radius: 20px;
          padding: 14px 16px;
          display: grid;
          gap: 4px;
          justify-items: center;
          text-align: center;
        }

        .availability-center-card__label,
        .availability-field__label {
          color: #53708f;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .availability-center-card__value {
          margin: 0;
          color: #163252;
          font-size: 19px;
          line-height: 1.2;
          font-weight: 800;
          letter-spacing: -0.02em;
          text-align: center;
        }

        .availability-mode-card {
          border-radius: 20px;
          padding: 6px;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 6px;
        }

        .availability-mode-button {
          border: 0;
          border-radius: 14px;
          background: transparent;
          color: #58728f;
          font-size: 15px;
          font-weight: 800;
          padding: 12px 6px;
          cursor: pointer;
        }

        .availability-mode-button--active {
          background: linear-gradient(180deg, #1f5d95 0%, #184d7d 100%);
          color: #f8fbff;
          box-shadow: 0 10px 22px rgba(24, 77, 125, 0.22);
        }

        .availability-editor-card {
          min-height: 0;
          border-radius: 26px 26px 0 0;
          overflow: hidden;
        }

        .availability-editor-card--blocked {
          border-color: rgba(186, 86, 86, 0.26);
          background: linear-gradient(180deg, rgba(255, 241, 241, 0.96) 0%, rgba(255, 232, 232, 0.98) 100%);
        }

        .availability-editor-card--extra {
          border-color: rgba(70, 145, 93, 0.24);
          background: linear-gradient(180deg, rgba(239, 250, 243, 0.96) 0%, rgba(229, 246, 235, 0.98) 100%);
        }

        .availability-editor-scroll {
          height: 100%;
          overflow-y: auto;
          padding: 18px 18px 22px;
          display: grid;
          gap: 18px;
          align-content: start;
        }

        .availability-section {
          display: grid;
          gap: 14px;
        }

        .availability-section--tight {
          gap: 12px;
        }

        .availability-title,
        .availability-list-title {
          margin: 0;
          text-align: center;
          color: #163252;
          font-size: 18px;
          line-height: 1.15;
          font-weight: 800;
          letter-spacing: -0.02em;
        }

        .availability-day-chips {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 8px 10px;
        }

        .availability-day-chip {
          min-width: 0;
          min-height: 48px;
          border: 1px solid #d9e5f1;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.76);
          color: #45617f;
          padding: 10px 4px;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
        }

        .availability-day-chip--active {
          border-color: #1f5d95;
          background: rgba(31, 93, 149, 0.12);
          color: #174973;
        }

        .availability-compact-row {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) 52px;
          gap: 10px;
          align-items: end;
        }

        .availability-field {
          display: grid;
          gap: 8px;
        }

        .availability-field--date {
          max-width: 220px;
          justify-self: center;
          width: 100%;
        }

        .availability-field__input {
          width: 100%;
          min-width: 0;
          min-height: 48px;
          border: 1px solid #d8e4f0;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.82);
          color: #163252;
          padding: 12px 14px;
          font-size: 15px;
          font-weight: 700;
          font-family: inherit;
        }

        .availability-action-button,
        .availability-delete-button {
          width: 52px;
          height: 48px;
          border: 0;
          border-radius: 16px;
          color: #f8fbff;
          font-size: 26px;
          line-height: 1;
          font-weight: 700;
          cursor: pointer;
          display: grid;
          place-items: center;
        }

        .availability-action-button {
          background: linear-gradient(180deg, #1f5d95 0%, #184d7d 100%);
          box-shadow: 0 12px 26px rgba(24, 77, 125, 0.2);
        }

        .availability-action-button:disabled {
          opacity: 0.42;
          cursor: not-allowed;
          box-shadow: none;
        }

        .availability-delete-button {
          background: linear-gradient(180deg, #d96464 0%, #c24747 100%);
          box-shadow: 0 10px 22px rgba(194, 71, 71, 0.2);
        }

        .availability-range-list {
          display: grid;
          gap: 10px;
          justify-items: center;
        }

        .availability-range-item {
          width: 100%;
          display: grid;
          grid-template-columns: minmax(0, 240px) 52px;
          justify-content: center;
          gap: 10px;
          align-items: center;
        }

        .availability-range-chip {
          min-width: 0;
          min-height: 48px;
          border: 1px solid rgba(214, 226, 238, 0.9);
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.78);
          display: grid;
          align-content: center;
          justify-items: center;
          gap: 2px;
          padding: 8px 14px;
          text-align: center;
        }

        .availability-range-chip__main,
        .availability-range-chip__sub {
          color: #163252;
          font-weight: 800;
          letter-spacing: -0.02em;
        }

        .availability-range-chip__main {
          font-size: 16px;
          line-height: 1.15;
        }

        .availability-range-chip__sub {
          font-size: 13px;
          line-height: 1.15;
          color: #5b7491;
        }

        .availability-empty-state {
          border: 1px dashed #ccdced;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.5);
          color: #5f7894;
          font-size: 15px;
          line-height: 1.35;
          font-weight: 700;
          text-align: center;
          padding: 14px 16px;
        }

        @media (max-height: 700px) {
          .availability-content {
            padding-top: 8px;
            gap: 10px;
          }

          .availability-center-card {
            padding: 12px 14px;
          }

          .availability-center-card__value,
          .availability-title,
          .availability-list-title {
            font-size: 16px;
          }

          .availability-mode-button {
            padding-top: 10px;
            padding-bottom: 10px;
            font-size: 14px;
          }

          .availability-editor-scroll {
            padding: 14px 14px 18px;
            gap: 14px;
          }

          .availability-day-chip,
          .availability-field__input,
          .availability-action-button,
          .availability-delete-button,
          .availability-range-chip {
            min-height: 42px;
          }

          .availability-day-chip,
          .availability-field__input,
          .availability-range-chip__main {
            font-size: 14px;
          }

          .availability-field__label {
            font-size: 11px;
          }

          .availability-action-button,
          .availability-delete-button {
            width: 46px;
            height: 42px;
            font-size: 24px;
          }

          .availability-compact-row {
            grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) 46px;
            gap: 8px;
          }

          .availability-range-item {
            grid-template-columns: minmax(0, 220px) 46px;
            gap: 8px;
          }

          .availability-empty-state {
            padding: 12px 14px;
            font-size: 14px;
          }
        }
      `}</style>
    </main>
  );
}
