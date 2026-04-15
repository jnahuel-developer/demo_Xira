import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { patientsMock, type PatientListItem } from "../mocks/patients.mock";

type PatientFilter = "scheduled" | "all" | "without_scheduled";
type PatientOrder = "next_appointment" | "last_name" | "last_activity";

const NEW_PATIENT_PATH = "/nuevo-paciente";
const NEW_TURN_PATH = "/nuevo-turno";

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function initialsFromName(patient: PatientListItem) {
  return `${patient.firstName[0] ?? ""}${patient.lastName[0] ?? ""}`;
}

function filterPatients(
  patients: PatientListItem[],
  search: string,
  filter: PatientFilter
) {
  const normalizedSearch = normalizeText(search.trim());

  return patients.filter((patient) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "scheduled" && patient.hasScheduledTurn) ||
      (filter === "without_scheduled" && !patient.hasScheduledTurn);

    if (!matchesFilter) {
      return false;
    }

    if (!normalizedSearch) {
      return true;
    }

    const haystack = normalizeText(`${patient.fullName} ${patient.phone}`);
    return haystack.includes(normalizedSearch);
  });
}

function sortPatients(patients: PatientListItem[], order: PatientOrder) {
  return [...patients].sort((left, right) => {
    if (order === "last_name") {
      const lastNameDiff = left.lastName.localeCompare(right.lastName, "es");
      if (lastNameDiff !== 0) {
        return lastNameDiff;
      }

      return left.firstName.localeCompare(right.firstName, "es");
    }

    if (order === "last_activity") {
      const leftKey = left.lastTreatment?.sortKey ?? "";
      const rightKey = right.lastTreatment?.sortKey ?? "";

      if (leftKey !== rightKey) {
        return rightKey.localeCompare(leftKey);
      }

      return left.fullName.localeCompare(right.fullName, "es");
    }

    const leftKey = left.nextAppointment?.sortKey ?? "9999-12-31T23:59:59";
    const rightKey = right.nextAppointment?.sortKey ?? "9999-12-31T23:59:59";

    if (leftKey !== rightKey) {
      return leftKey.localeCompare(rightKey);
    }

    return left.fullName.localeCompare(right.fullName, "es");
  });
}

function PatientAvatar({ patient }: { patient: PatientListItem }) {
  if (patient.avatarUrl) {
    return (
      <img
        className="patients-avatar__image"
        src={patient.avatarUrl}
        alt=""
        aria-hidden="true"
      />
    );
  }

  return <span className="patients-avatar__initials">{initialsFromName(patient)}</span>;
}

function FilterButtonIcon() {
  return (
    <svg
      className="patients-filter-button__icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M4 7h16M7 12h10M10 17h4" />
    </svg>
  );
}

export default function PatientsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<PatientFilter>("scheduled");
  const [order, setOrder] = useState<PatientOrder>("next_appointment");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const visiblePatients = useMemo(() => {
    return sortPatients(filterPatients(patientsMock, search, filter), order);
  }, [filter, order, search]);

  const selectedPatient = useMemo(() => {
    if (!visiblePatients.length) {
      return null;
    }

    return (
      visiblePatients.find((patient) => patient.id === selectedId) ?? visiblePatients[0]
    );
  }, [selectedId, visiblePatients]);

  const filterOptions: Array<{ label: string; value: PatientFilter }> = [
    { label: "Con turno agendado", value: "scheduled" },
    { label: "Todos", value: "all" },
    { label: "Sin turno agendado", value: "without_scheduled" },
  ];

  const orderOptions: Array<{ label: string; value: PatientOrder }> = [
    { label: "Próximo turno", value: "next_appointment" },
    { label: "Apellido", value: "last_name" },
    { label: "Última actividad", value: "last_activity" },
  ];

  function clearSecondaryFilters() {
    setFilter("scheduled");
    setOrder("next_appointment");
  }

  return (
    <main className="patients-screen">
      <div className="patients-safe-top" />

      <section className="patients-content">
        <header className="patients-topbar">
          <button
            type="button"
            className="patients-icon-button"
            aria-label="Nuevo paciente"
            onClick={() => navigate(NEW_PATIENT_PATH)}
          >
            +
          </button>
        </header>

        <section className="patients-filters-card">
          <div className="patients-search-row">
            <div className="patients-search">
              <span className="patients-search__icon" aria-hidden="true">
                ⌕
              </span>
              <input
                type="search"
                className="patients-search__input"
                placeholder="Buscar por nombre o teléfono"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            <button
              type="button"
              className="patients-filter-button"
              aria-label="Abrir filtros"
              onClick={() => setIsFiltersOpen(true)}
            >
              <FilterButtonIcon />
            </button>
          </div>
        </section>

        <section className="patients-list-card">
          <div className="patients-list-card__head">
            <h2 className="patients-section-title">Pacientes</h2>
            <span className="patients-list-card__count">{visiblePatients.length}</span>
          </div>

          <div className="patients-list-scroll">
            {visiblePatients.length ? (
              <div className="patients-list">
                {visiblePatients.map((patient) => {
                  const isSelected = patient.id === selectedPatient?.id;

                  return (
                    <button
                      key={patient.id}
                      type="button"
                      className={`patients-row ${
                        isSelected ? "patients-row--selected" : ""
                      }`.trim()}
                      aria-pressed={isSelected}
                      onClick={() => setSelectedId(patient.id)}
                    >
                      <span className="patients-avatar">
                        <PatientAvatar patient={patient} />
                      </span>

                      <span className="patients-row__copy">
                        <span className="patients-row__name">{patient.fullName}</span>
                        <span className="patients-row__phone">{patient.phone}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="patients-empty-state">
                <p className="patients-empty-state__title">No se encontraron pacientes</p>
                <p className="patients-empty-state__copy">
                  Probá con otro filtro o buscá por otro dato.
                </p>
              </div>
            )}
          </div>
        </section>

        <article className="patients-summary-card">
          <div className="patients-summary-card__inner">
            {selectedPatient ? (
              <>
                <div className="patients-summary-grid">
                  <div className="patients-summary-item">
                    {selectedPatient.lastTreatment ? (
                      <>
                        <span className="patients-summary-item__value">
                          {selectedPatient.lastTreatment.dateLabel}
                        </span>
                        <span className="patients-summary-item__meta">
                          {selectedPatient.lastTreatment.treatment}
                        </span>
                      </>
                    ) : (
                      <span className="patients-summary-item__value">
                        Sin turno previo
                      </span>
                    )}
                  </div>

                  <div className="patients-summary-item patients-summary-item--next">
                    {selectedPatient.nextAppointment ? (
                      <>
                        <span className="patients-summary-item__value">
                          {selectedPatient.nextAppointment.dateLabel}
                        </span>
                        <span className="patients-summary-item__meta">
                          {selectedPatient.nextAppointment.treatment}
                        </span>
                      </>
                    ) : (
                      <span className="patients-summary-item__value">
                        Sin turno próximo
                      </span>
                    )}
                  </div>
                </div>

                <div className="patients-summary-actions">
                  <button
                    type="button"
                    className="patients-btn patients-btn--secondary"
                    onClick={() => navigate(`/paciente/${selectedPatient.id}/editar`)}
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    className="patients-btn patients-btn--primary"
                    onClick={() =>
                      navigate(NEW_TURN_PATH, { state: { patientId: selectedPatient.id } })
                    }
                  >
                    Agendar turno
                  </button>
                </div>
              </>
            ) : (
              <div className="patients-summary-empty">
                <p className="patients-summary-empty__title">Sin paciente seleccionado</p>
                <p className="patients-summary-empty__copy">
                  Ajustá la búsqueda o elegí un paciente para ver su resumen.
                </p>
              </div>
            )}
          </div>
        </article>
      </section>

      {isFiltersOpen ? (
        <div className="patients-modal-backdrop" role="presentation">
          <div
            className="patients-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="patients-filters-title"
          >
            <div className="patients-modal__header">
              <div>
                <h2 id="patients-filters-title" className="patients-modal__title">
                  Filtros
                </h2>
                <p className="patients-modal__description">
                  Elegí filtro y orden sin ocupar espacio en la pantalla principal.
                </p>
              </div>

              <button
                type="button"
                className="patients-modal__close"
                aria-label="Cerrar"
                onClick={() => setIsFiltersOpen(false)}
              >
                ×
              </button>
            </div>

            <div className="patients-modal__section">
              <p className="patients-modal__label">Pacientes</p>
              <div className="patients-modal__stack">
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`patients-modal-option ${
                      filter === option.value ? "patients-modal-option--active" : ""
                    }`.trim()}
                    onClick={() => setFilter(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="patients-modal__section">
              <p className="patients-modal__label">Ordenar</p>
              <div className="patients-modal__stack">
                {orderOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`patients-modal-option ${
                      order === option.value ? "patients-modal-option--active" : ""
                    }`.trim()}
                    onClick={() => setOrder(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="patients-modal__actions">
              <button
                type="button"
                className="patients-btn patients-btn--secondary"
                onClick={clearSecondaryFilters}
              >
                Limpiar filtros
              </button>

              <button
                type="button"
                className="patients-btn patients-btn--primary"
                onClick={() => setIsFiltersOpen(false)}
              >
                Aplicar
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <style>{`
        .patients-screen {
          min-height: calc(100dvh - 92px - env(safe-area-inset-bottom, 0px));
          height: calc(100dvh - 92px - env(safe-area-inset-bottom, 0px));
          background: linear-gradient(180deg, #f7fbff 0%, #eef4fb 100%);
          overflow: hidden;
        }

        .patients-safe-top {
          height: env(safe-area-inset-top, 0px);
          min-height: 8px;
        }

        .patients-content {
          height: calc(100% - env(safe-area-inset-top, 0px));
          padding: 12px 16px 16px;
          display: grid;
          grid-template-rows: auto auto minmax(0, 1fr) auto;
          gap: 10px;
          overflow: hidden;
        }

        @media (min-width: 390px) {
          .patients-content {
            padding-left: 20px;
            padding-right: 20px;
          }
        }

        .patients-topbar {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          padding-top: 2px;
        }

        .patients-icon-button,
        .patients-filter-button {
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

        .patients-icon-button {
          font-size: 24px;
          font-weight: 700;
          line-height: 1;
        }

        .patients-filter-button__icon {
          width: 20px;
          height: 20px;
          fill: none;
          stroke: currentColor;
          stroke-width: 1.9;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .patients-filters-card,
        .patients-list-card,
        .patients-summary-card {
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid #dce7f3;
          border-radius: 22px;
          box-shadow: 0 10px 28px rgba(48, 90, 138, 0.07);
        }

        .patients-filters-card {
          padding: 12px;
        }

        .patients-search-row {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 10px;
        }

        .patients-search {
          min-height: 44px;
          border-radius: 16px;
          border: 1px solid #dbe7f3;
          background: #fbfdff;
          display: grid;
          grid-template-columns: auto minmax(0, 1fr);
          gap: 10px;
          align-items: center;
          padding: 0 14px;
        }

        .patients-search__icon {
          color: #6d829d;
          font-size: 14px;
        }

        .patients-search__input {
          min-width: 0;
          border: 0;
          outline: 0;
          background: transparent;
          color: #163252;
          font: inherit;
          font-size: 14px;
          font-weight: 600;
        }

        .patients-search__input::placeholder {
          color: #7c90a7;
        }

        .patients-list-card {
          min-height: 0;
          padding: 12px;
          display: grid;
          grid-template-rows: auto minmax(0, 1fr);
          gap: 10px;
          overflow: hidden;
        }

        .patients-list-card__head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .patients-section-title {
          margin: 0;
          font-size: 18px;
          line-height: 1.15;
          font-weight: 800;
          color: #163252;
        }

        .patients-list-card__count {
          min-height: 28px;
          min-width: 28px;
          padding: 0 10px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #ecf3fb;
          color: #4d6b90;
          font-size: 12px;
          font-weight: 800;
        }

        .patients-list-scroll {
          min-height: 0;
          overflow-y: auto;
          padding-right: 2px;
          scrollbar-width: none;
        }

        .patients-list-scroll::-webkit-scrollbar {
          display: none;
        }

        .patients-list {
          display: grid;
          gap: 10px;
        }

        .patients-row {
          width: 100%;
          border: 1px solid #dce8f5;
          background: #fbfdff;
          border-radius: 18px;
          padding: 11px;
          display: grid;
          grid-template-columns: 50px minmax(0, 1fr);
          gap: 12px;
          align-items: center;
          text-align: left;
          cursor: pointer;
        }

        .patients-row--selected {
          border-color: #6e9ccc;
          background: linear-gradient(180deg, #f4f9ff 0%, #ebf4fd 100%);
          box-shadow: 0 12px 22px rgba(45, 95, 147, 0.13);
          outline: 2px solid rgba(45, 95, 147, 0.12);
          outline-offset: 0;
        }

        .patients-avatar {
          width: 50px;
          height: 50px;
          border-radius: 18px;
          overflow: hidden;
          background: linear-gradient(180deg, #edf4fb 0%, #dfeaf6 100%);
          display: grid;
          place-items: center;
          color: #325f8d;
          font-size: 16px;
          font-weight: 800;
        }

        .patients-avatar__image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .patients-avatar__initials {
          letter-spacing: 0.02em;
        }

        .patients-row__copy {
          min-width: 0;
          display: grid;
          gap: 4px;
        }

        .patients-row__name {
          font-size: 15px;
          line-height: 1.2;
          font-weight: 800;
          color: #163252;
        }

        .patients-row__phone {
          font-size: 13px;
          line-height: 1.3;
          color: #627791;
          font-weight: 600;
        }

        .patients-empty-state,
        .patients-summary-empty {
          min-height: 100%;
          display: grid;
          place-content: center;
          gap: 6px;
          text-align: center;
          padding: 16px 10px;
        }

        .patients-empty-state__title,
        .patients-summary-empty__title {
          margin: 0;
          font-size: 16px;
          line-height: 1.2;
          color: #163252;
          font-weight: 800;
        }

        .patients-empty-state__copy,
        .patients-summary-empty__copy {
          margin: 0;
          font-size: 13px;
          line-height: 1.35;
          color: #70829d;
          font-weight: 600;
        }

        .patients-summary-card__inner {
          padding: 12px;
          display: grid;
          gap: 10px;
        }

        .patients-summary-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .patients-summary-item {
          min-height: 94px;
          padding: 12px 10px;
          border-radius: 18px;
          background: #fbfdff;
          border: 1px solid #dce8f5;
          display: grid;
          align-content: center;
          justify-items: center;
          gap: 6px;
          text-align: center;
        }

        .patients-summary-item--next {
          background: linear-gradient(180deg, #fbfefd 0%, #eef8f1 100%);
          border-color: #d9eadf;
        }

        .patients-summary-item__value {
          font-size: 16px;
          line-height: 1.22;
          color: #163252;
          font-weight: 800;
        }

        .patients-summary-item__meta {
          font-size: 14px;
          line-height: 1.28;
          color: #627791;
          font-weight: 600;
        }

        .patients-summary-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .patients-btn {
          min-height: 46px;
          border-radius: 16px;
          border: 0;
          padding: 0 12px;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
        }

        .patients-btn--primary {
          background: #2d5f93;
          color: #ffffff;
          box-shadow: 0 12px 24px rgba(45, 95, 147, 0.16);
        }

        .patients-btn--secondary {
          background: #edf4fb;
          color: #163252;
          border: 1px solid #d9e6f4;
        }

        .patients-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(17, 25, 40, 0.36);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          z-index: 20;
        }

        .patients-modal {
          width: min(100%, 390px);
          border-radius: 24px;
          background: #ffffff;
          border: 1px solid #dce7f3;
          box-shadow: 0 20px 40px rgba(17, 25, 40, 0.18);
          padding: 16px;
          display: grid;
          gap: 14px;
        }

        .patients-modal__header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }

        .patients-modal__title {
          margin: 0;
          font-size: 20px;
          line-height: 1.1;
          font-weight: 800;
          color: #163252;
        }

        .patients-modal__description {
          margin: 6px 0 0;
          font-size: 13px;
          line-height: 1.35;
          color: #6b7f99;
          font-weight: 600;
        }

        .patients-modal__close {
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

        .patients-modal__section {
          display: grid;
          gap: 8px;
        }

        .patients-modal__label {
          margin: 0;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #7388a2;
        }

        .patients-modal__stack {
          display: grid;
          gap: 8px;
        }

        .patients-modal-option {
          min-height: 42px;
          border-radius: 14px;
          border: 1px solid #d9e4ef;
          background: #fbfdff;
          color: #163252;
          text-align: left;
          padding: 0 12px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
        }

        .patients-modal-option--active {
          background: #f2f8fe;
          border-color: #bfd4ea;
          box-shadow: 0 10px 18px rgba(55, 95, 145, 0.08);
        }

        .patients-modal__actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        @media (max-width: 374px) {
          .patients-content {
            gap: 8px;
          }

          .patients-summary-actions,
          .patients-modal__actions {
            grid-template-columns: 1fr;
          }

          .patients-summary-item {
            min-height: 86px;
          }
        }

        @media (max-height: 700px) {
          .patients-content {
            padding-top: 8px;
            gap: 8px;
          }

          .patients-filters-card,
          .patients-list-card,
          .patients-summary-card__inner,
          .patients-modal {
            padding: 12px;
          }

          .patients-search,
          .patients-filter-button {
            min-height: 42px;
          }

          .patients-row {
            padding: 10px;
            gap: 10px;
          }

          .patients-avatar {
            width: 46px;
            height: 46px;
          }

          .patients-row__name {
            font-size: 14px;
          }

          .patients-row__phone,
          .patients-summary-item__meta,
          .patients-empty-state__copy,
          .patients-summary-empty__copy,
          .patients-modal__description {
            font-size: 12px;
          }

          .patients-summary-item {
            min-height: 82px;
            padding-top: 10px;
            padding-bottom: 10px;
          }

          .patients-btn,
          .patients-icon-button,
          .patients-filter-button {
            min-height: 42px;
          }

          .patients-btn {
            font-size: 13px;
          }

          .patients-summary-item__value {
            font-size: 15px;
          }

          .patients-summary-item__meta {
            font-size: 13px;
          }
        }
      `}</style>
    </main>
  );
}
