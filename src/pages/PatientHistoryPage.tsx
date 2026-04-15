import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getPatientHistoryScreenMock,
  type HistoryPeriod,
  type PatientHistoryEntry,
} from "../mocks/patientHistory.mock";

const HISTORY_REFERENCE_DATE = new Date("2026-04-14T12:00:00");

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function FilterButtonIcon() {
  return (
    <svg className="history-filter-button__icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7h16M7 12h10M10 17h4" />
    </svg>
  );
}

function daysSince(sortKey: string) {
  const entryDate = new Date(`${sortKey}T12:00:00`);
  const diffMs = HISTORY_REFERENCE_DATE.getTime() - entryDate.getTime();
  return diffMs / (1000 * 60 * 60 * 24);
}

function sortEntries(entries: PatientHistoryEntry[]) {
  return [...entries].sort((left, right) => right.sortKey.localeCompare(left.sortKey));
}

export default function PatientHistoryPage() {
  const navigate = useNavigate();
  const params = useParams();
  const patientId = params.id;
  const historyMock = useMemo(() => getPatientHistoryScreenMock(patientId), [patientId]);

  const [activeCategories, setActiveCategories] = useState<
    Array<"inyectables" | "aparatologia">
  >(["inyectables", "aparatologia"]);
  const [period, setPeriod] = useState<HistoryPeriod>("90d");
  const [treatmentSearch, setTreatmentSearch] = useState("");
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isPhotosOpen, setIsPhotosOpen] = useState(false);
  const [isPrivateNoteOpen, setIsPrivateNoteOpen] = useState(false);

  const [draftPeriod, setDraftPeriod] = useState<HistoryPeriod>("90d");
  const [draftTreatmentSearch, setDraftTreatmentSearch] = useState("");

  const visibleEntries = useMemo(() => {
    return sortEntries(historyMock.entries).filter((entry) => {
      if (!activeCategories.includes(entry.category)) {
        return false;
      }

      if (period === "30d" && daysSince(entry.sortKey) > 30) {
        return false;
      }

      if (period === "90d" && daysSince(entry.sortKey) > 90) {
        return false;
      }

      if (treatmentSearch.trim()) {
        const haystack = normalizeText(entry.treatment);
        if (!haystack.includes(normalizeText(treatmentSearch))) {
          return false;
        }
      }

      return true;
    });
  }, [
    activeCategories,
    historyMock.entries,
    period,
    treatmentSearch,
  ]);

  const selectedEntry = useMemo(() => {
    if (!visibleEntries.length) {
      return null;
    }

    return visibleEntries.find((entry) => entry.id === selectedEntryId) ?? visibleEntries[0];
  }, [selectedEntryId, visibleEntries]);

  const groupedPhotos = useMemo(() => {
    if (!selectedEntry) {
      return { before: [], after: [] } as const;
    }

    return {
      before: selectedEntry.photos.filter((photo) => photo.kind === "before"),
      after: selectedEntry.photos.filter((photo) => photo.kind === "after"),
    } as const;
  }, [selectedEntry]);

  function toggleCategory(category: "inyectables" | "aparatologia") {
    setActiveCategories((current) => {
      if (current.includes(category)) {
        if (current.length === 1) {
          return current;
        }

        return current.filter((item) => item !== category);
      }

      return [...current, category];
    });
  }

  function openFilters() {
    setDraftPeriod(period);
    setDraftTreatmentSearch(treatmentSearch);
    setIsFiltersOpen(true);
  }

  function clearFilters() {
    setActiveCategories(["inyectables", "aparatologia"]);
    setPeriod("90d");
    setTreatmentSearch("");
    setDraftPeriod("90d");
    setDraftTreatmentSearch("");
  }

  function applyDraftFilters() {
    setPeriod(draftPeriod);
    setTreatmentSearch(draftTreatmentSearch);
    setIsFiltersOpen(false);
  }

  const isOwnEntry =
    selectedEntry?.professionalId === historyMock.currentProfessionalId;

  return (
    <main className="history-screen">
      <div className="history-safe-top" />

      <section className="history-content">
        <header className="history-topbar">
          <button
            type="button"
            className="history-icon-button"
            aria-label="Volver"
            onClick={() => navigate(-1)}
          >
            ‹
          </button>
        </header>

        <section className="history-filters-card">
          <div className="history-filters-row">
            <button
              type="button"
              className={`history-chip ${
                activeCategories.includes("inyectables") ? "history-chip--active" : ""
              }`.trim()}
              onClick={() => toggleCategory("inyectables")}
            >
              Inyectables
            </button>

            <button
              type="button"
              className={`history-chip ${
                activeCategories.includes("aparatologia") ? "history-chip--active" : ""
              }`.trim()}
              onClick={() => toggleCategory("aparatologia")}
            >
              Aparatología
            </button>

            <button
              type="button"
              className="history-filter-button"
              aria-label="Filtros adicionales"
              onClick={openFilters}
            >
              <FilterButtonIcon />
            </button>
          </div>
        </section>

        <section className="history-list-card">
          <div className="history-list-card__head">
            <span className="history-list-card__spacer" aria-hidden="true" />
            <h2 className="history-section-title">{historyMock.patientName}</h2>
            <span className="history-list-card__count">{visibleEntries.length}</span>
          </div>

          <div className="history-list-scroll">
            {visibleEntries.length ? (
              <div className="history-list">
                {visibleEntries.map((entry) => {
                  const isSelected = entry.id === selectedEntry?.id;

                  return (
                    <button
                      key={entry.id}
                      type="button"
                      className={`history-row ${
                        isSelected ? "history-row--selected" : ""
                      }`.trim()}
                      aria-pressed={isSelected}
                      onClick={() => setSelectedEntryId(entry.id)}
                    >
                      <span className="history-row__date">{entry.dateLabel}</span>
                      <span className="history-row__treatment">{entry.treatment}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="history-empty-state">
                <p className="history-empty-state__title">No hay registros para este filtro</p>
                <p className="history-empty-state__copy">
                  Probá con otra categoría o ampliá la búsqueda.
                </p>
              </div>
            )}
          </div>
        </section>

        <article className="history-summary-card">
          <div className="history-summary-card__inner">
            {selectedEntry ? (
              <>
                <div className="history-summary-body">
                  <div className="history-summary-cards">
                    <div
                      className={`history-summary-info-card ${
                        isOwnEntry ? "" : "history-summary-info-card--shared"
                      }`.trim()}
                    >
                      <span className="history-summary-info-card__label">
                        Profesional
                      </span>
                      <p className="history-summary-info-card__value">
                        {selectedEntry.professionalName}
                      </p>
                    </div>

                    <div className="history-summary-info-card">
                      <span className="history-summary-info-card__label">Centro</span>
                      <p className="history-summary-info-card__value">
                        {selectedEntry.centerName}
                      </p>
                    </div>
                  </div>

                  <div className="history-note">
                    <span className="history-note__label">Nota pública</span>
                    <p className="history-note__value">
                      {selectedEntry.publicNote || "Sin nota pública"}
                    </p>
                  </div>
                </div>

                {isOwnEntry ? (
                  <div className="history-summary-actions">
                    <button
                      type="button"
                      className="history-btn history-btn--secondary"
                      onClick={() => setIsPrivateNoteOpen(true)}
                    >
                      Ver nota privada
                    </button>

                    <button
                      type="button"
                      className="history-btn history-btn--primary"
                      onClick={() => setIsPhotosOpen(true)}
                    >
                      Ver fotos
                    </button>
                  </div>
                ) : null}
              </>
            ) : (
              <div className="history-summary-empty">
                <p className="history-summary-empty__title">Sin ficha seleccionada</p>
                <p className="history-summary-empty__copy">
                  Elegí una atención del historial para ver más contexto.
                </p>
              </div>
            )}
          </div>
        </article>
      </section>

      {isFiltersOpen ? (
        <div className="history-modal-backdrop" role="presentation">
          <div
            className="history-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="history-filters-title"
          >
            <div className="history-modal__header">
              <div>
                <h2 id="history-filters-title" className="history-modal__title">
                  Filtros
                </h2>
                <p className="history-modal__description">
                  Ajustá período, tratamiento y visibilidad clínica.
                </p>
              </div>

              <button
                type="button"
                className="history-modal__close"
                aria-label="Cerrar"
                onClick={() => setIsFiltersOpen(false)}
              >
                ×
              </button>
            </div>

            <div className="history-modal__section">
              <p className="history-modal__label">Período</p>
              <div className="history-modal__stack">
                {[
                  { label: "Últimos 30 días", value: "30d" },
                  { label: "Últimos 90 días", value: "90d" },
                  { label: "Cualquier fecha", value: "any" },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`history-modal-option ${
                      draftPeriod === option.value ? "history-modal-option--active" : ""
                    }`.trim()}
                    onClick={() => setDraftPeriod(option.value as HistoryPeriod)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="history-modal__section">
              <p className="history-modal__label">Tratamiento</p>
              <input
                type="search"
                className="history-modal__input"
                placeholder="Buscar tratamiento"
                value={draftTreatmentSearch}
                onChange={(event) => setDraftTreatmentSearch(event.target.value)}
              />
            </div>

            <div className="history-modal__actions">
              <button
                type="button"
                className="history-btn history-btn--secondary"
                onClick={clearFilters}
              >
                Limpiar filtros
              </button>

              <button
                type="button"
                className="history-btn history-btn--primary"
                onClick={applyDraftFilters}
              >
                Aplicar
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {isPrivateNoteOpen && selectedEntry ? (
        <div className="history-modal-backdrop" role="presentation">
          <div
            className="history-modal history-modal--note"
            role="dialog"
            aria-modal="true"
            aria-labelledby="history-private-note-title"
          >
            <div className="history-modal__header">
              <div>
                <h2 id="history-private-note-title" className="history-modal__title">
                  Nota privada
                </h2>
                <p className="history-modal__description">{selectedEntry.treatment}</p>
              </div>

              <button
                type="button"
                className="history-modal__close"
                aria-label="Cerrar"
                onClick={() => setIsPrivateNoteOpen(false)}
              >
                ×
              </button>
            </div>

            <div className="history-note history-note--modal">
              <p className="history-note__value">
                {selectedEntry.privateNote || "Sin nota privada"}
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {isPhotosOpen && selectedEntry ? (
        <div className="history-modal-backdrop" role="presentation">
          <div
            className="history-modal history-modal--photos"
            role="dialog"
            aria-modal="true"
            aria-labelledby="history-photos-title"
          >
            <div className="history-modal__header">
              <div>
                <h2 id="history-photos-title" className="history-modal__title">
                  Fotos
                </h2>
                <p className="history-modal__description">{selectedEntry.treatment}</p>
              </div>

              <button
                type="button"
                className="history-modal__close"
                aria-label="Cerrar"
                onClick={() => setIsPhotosOpen(false)}
              >
                ×
              </button>
            </div>

            <div className="history-photos-scroll">
              {groupedPhotos.before.length ? (
                <section className="history-photos-group">
                  <h3 className="history-photos-group__title">Antes</h3>
                  <div className="history-photos-grid">
                    {groupedPhotos.before.map((photo) => (
                      <figure key={photo.id} className="history-photo-card">
                        <img className="history-photo-card__image" src={photo.url} alt="" />
                      </figure>
                    ))}
                  </div>
                </section>
              ) : null}

              {groupedPhotos.after.length ? (
                <section className="history-photos-group">
                  <h3 className="history-photos-group__title">Después</h3>
                  <div className="history-photos-grid">
                    {groupedPhotos.after.map((photo) => (
                      <figure key={photo.id} className="history-photo-card">
                        <img className="history-photo-card__image" src={photo.url} alt="" />
                      </figure>
                    ))}
                  </div>
                </section>
              ) : null}

              {!groupedPhotos.before.length && !groupedPhotos.after.length ? (
                <div className="history-empty-state history-empty-state--photos">
                  <p className="history-empty-state__title">Sin fotos asociadas</p>
                  <p className="history-empty-state__copy">
                    Esta atención no tiene evidencia cargada en el mock.
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      <style>{`
        .history-screen {
          min-height: calc(100dvh - 92px - env(safe-area-inset-bottom, 0px));
          height: calc(100dvh - 92px - env(safe-area-inset-bottom, 0px));
          background: linear-gradient(180deg, #f7fbff 0%, #eef4fb 100%);
          overflow: hidden;
        }

        .history-safe-top {
          height: env(safe-area-inset-top, 0px);
          min-height: 8px;
        }

        .history-content {
          height: calc(100% - env(safe-area-inset-top, 0px));
          padding: 12px 16px 16px;
          display: grid;
          grid-template-rows: auto auto minmax(0, 1fr) auto;
          gap: 12px;
          overflow: hidden;
        }

        @media (min-width: 390px) {
          .history-content {
            padding-left: 20px;
            padding-right: 20px;
          }
        }

        .history-topbar {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          padding-top: 2px;
        }

        .history-icon-button,
        .history-filter-button {
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

        .history-icon-button {
          font-size: 22px;
          line-height: 1;
          font-weight: 700;
        }

        .history-filters-card,
        .history-list-card,
        .history-summary-card {
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid #dce7f3;
          border-radius: 22px;
          box-shadow: 0 10px 28px rgba(48, 90, 138, 0.07);
        }

        .history-filters-card {
          padding: 12px;
        }

        .history-filters-row {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) auto;
          gap: 8px;
        }

        .history-chip {
          min-height: 36px;
          border-radius: 999px;
          border: 1px solid #d9e4ef;
          background: #f8fbff;
          color: #5d7490;
          font-size: 12px;
          font-weight: 800;
          white-space: nowrap;
          cursor: pointer;
        }

        .history-chip--active {
          background: #2d5f93;
          border-color: #2d5f93;
          color: #ffffff;
          box-shadow: 0 10px 18px rgba(45, 95, 147, 0.14);
        }

        .history-filter-button__icon {
          width: 20px;
          height: 20px;
          fill: none;
          stroke: currentColor;
          stroke-width: 1.9;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .history-list-card {
          min-height: 0;
          padding: 12px;
          display: grid;
          grid-template-rows: auto minmax(0, 1fr);
          gap: 10px;
          overflow: hidden;
        }

        .history-list-card__head {
          display: grid;
          grid-template-columns: 36px minmax(0, 1fr) auto;
          align-items: center;
          gap: 8px;
        }

        .history-list-card__spacer {
          width: 36px;
          height: 28px;
        }

        .history-section-title {
          margin: 0;
          font-size: 18px;
          line-height: 1.15;
          font-weight: 800;
          color: #163252;
          text-align: center;
          letter-spacing: -0.02em;
        }

        .history-list-card__count {
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

        .history-list-scroll {
          min-height: 0;
          overflow-y: auto;
          padding-right: 2px;
          scrollbar-width: none;
        }

        .history-list-scroll::-webkit-scrollbar {
          display: none;
        }

        .history-list {
          display: grid;
          gap: 10px;
        }

        .history-row {
          width: 100%;
          border: 1px solid #dce8f5;
          background: #fbfdff;
          border-radius: 18px;
          padding: 12px;
          display: grid;
          gap: 5px;
          text-align: left;
          cursor: pointer;
        }

        .history-row--selected {
          border-color: #6e9ccc;
          background: linear-gradient(180deg, #f4f9ff 0%, #ebf4fd 100%);
          box-shadow: 0 12px 22px rgba(45, 95, 147, 0.13);
          outline: 2px solid rgba(45, 95, 147, 0.12);
          outline-offset: 0;
        }

        .history-row__date {
          font-size: 13px;
          line-height: 1.2;
          color: #5b7697;
          font-weight: 700;
        }

        .history-row__treatment {
          font-size: 15px;
          line-height: 1.24;
          color: #163252;
          font-weight: 800;
        }

        .history-empty-state,
        .history-summary-empty {
          min-height: 100%;
          display: grid;
          place-content: center;
          gap: 6px;
          text-align: center;
          padding: 16px 10px;
        }

        .history-empty-state__title,
        .history-summary-empty__title {
          margin: 0;
          font-size: 16px;
          line-height: 1.2;
          color: #163252;
          font-weight: 800;
        }

        .history-empty-state__copy,
        .history-summary-empty__copy {
          margin: 0;
          font-size: 13px;
          line-height: 1.35;
          color: #70829d;
          font-weight: 600;
        }

        .history-summary-card {
          min-height: 0;
          max-height: min(34dvh, 280px);
          overflow: hidden;
        }

        .history-summary-card__inner {
          height: 100%;
          min-height: 0;
          padding: 14px;
          display: grid;
          grid-template-rows: minmax(0, 1fr) auto;
          gap: 12px;
        }

        .history-summary-body {
          min-height: 0;
          overflow-y: auto;
          display: grid;
          gap: 10px;
          padding-right: 2px;
          scrollbar-width: none;
        }

        .history-summary-body::-webkit-scrollbar {
          display: none;
        }

        .history-summary-cards {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .history-summary-info-card {
          min-height: 78px;
          padding: 10px 12px;
          border-radius: 16px;
          background: #fbfdff;
          border: 1px solid #dce8f5;
          display: grid;
          align-content: center;
          gap: 4px;
        }

        .history-summary-info-card--shared {
          background: linear-gradient(180deg, #fff7ef 0%, #fff1e2 100%);
          border-color: #f0d5b4;
        }

        .history-summary-info-card__label {
          font-size: 11px;
          line-height: 1.2;
          color: #7388a2;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .history-summary-info-card__value {
          margin: 0;
          font-size: 14px;
          line-height: 1.3;
          color: #163252;
          font-weight: 800;
        }

        .history-note {
          padding: 10px 12px;
          border-radius: 16px;
          background: #fbfdff;
          border: 1px solid #dce8f5;
          display: grid;
          gap: 4px;
        }

        .history-note--modal {
          margin-top: 2px;
        }

        .history-note__label {
          font-size: 11px;
          line-height: 1.2;
          color: #7388a2;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .history-note__value {
          margin: 0;
          font-size: 13px;
          line-height: 1.38;
          color: #163252;
          font-weight: 600;
        }

        .history-summary-actions,
        .history-modal__actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .history-btn {
          min-height: 46px;
          border-radius: 16px;
          border: 0;
          padding: 0 12px;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
        }

        .history-btn--primary {
          background: #2d5f93;
          color: #ffffff;
          box-shadow: 0 12px 24px rgba(45, 95, 147, 0.16);
        }

        .history-btn--secondary {
          background: #edf4fb;
          color: #163252;
          border: 1px solid #d9e6f4;
        }

        .history-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(17, 25, 40, 0.36);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          z-index: 20;
        }

        .history-modal {
          width: min(100%, 390px);
          border-radius: 24px;
          background: #ffffff;
          border: 1px solid #dce7f3;
          box-shadow: 0 20px 40px rgba(17, 25, 40, 0.18);
          padding: 16px;
          display: grid;
          gap: 14px;
        }

        .history-modal--photos {
          max-height: min(76dvh, 620px);
          grid-template-rows: auto minmax(0, 1fr);
        }

        .history-modal__header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }

        .history-modal__title {
          margin: 0;
          font-size: 20px;
          line-height: 1.1;
          font-weight: 800;
          color: #163252;
        }

        .history-modal__description {
          margin: 6px 0 0;
          font-size: 13px;
          line-height: 1.35;
          color: #6b7f99;
          font-weight: 600;
        }

        .history-modal__close {
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

        .history-modal__section {
          display: grid;
          gap: 8px;
        }

        .history-modal__label {
          margin: 0;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #7388a2;
        }

        .history-modal__stack {
          display: grid;
          gap: 8px;
        }

        .history-modal-option {
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

        .history-modal-option--active {
          background: linear-gradient(180deg, #f4f9ff 0%, #eaf3fd 100%);
          border-color: #6e9ccc;
          color: #123152;
          box-shadow: 0 12px 18px rgba(45, 95, 147, 0.12);
          outline: 2px solid rgba(45, 95, 147, 0.1);
          outline-offset: 0;
          font-weight: 800;
        }

        .history-modal__input {
          width: 100%;
          min-height: 44px;
          border-radius: 14px;
          border: 1px solid #d9e4ef;
          background: #fbfdff;
          padding: 0 12px;
          color: #163252;
          font: inherit;
          font-size: 14px;
          font-weight: 700;
        }

        .history-photos-scroll {
          min-height: 0;
          overflow-y: auto;
          scrollbar-width: none;
          padding-right: 2px;
        }

        .history-photos-scroll::-webkit-scrollbar {
          display: none;
        }

        .history-photos-group {
          display: grid;
          gap: 10px;
        }

        .history-photos-group + .history-photos-group {
          margin-top: 12px;
        }

        .history-photos-group__title {
          margin: 0;
          font-size: 15px;
          line-height: 1.2;
          font-weight: 800;
          color: #163252;
        }

        .history-photos-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        .history-photo-card {
          margin: 0;
          border-radius: 18px;
          overflow: hidden;
          border: 1px solid #dce8f5;
          background: #f8fbff;
          aspect-ratio: 0.82;
        }

        .history-photo-card__image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .history-empty-state--photos {
          min-height: 180px;
        }

        @media (max-width: 374px) {
          .history-content {
            gap: 10px;
          }

          .history-filters-row {
            gap: 6px;
          }

          .history-chip {
            font-size: 11px;
          }

          .history-summary-actions,
          .history-modal__actions,
          .history-photos-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-height: 700px) {
          .history-content {
            padding-top: 8px;
            gap: 10px;
          }

          .history-filters-card,
          .history-list-card,
          .history-summary-card__inner,
          .history-modal {
            padding: 12px;
          }

          .history-summary-card {
            max-height: min(36dvh, 250px);
          }

          .history-row {
            padding: 11px;
          }

          .history-row__date,
          .history-summary-info-card__value,
          .history-note__value,
          .history-empty-state__copy,
          .history-summary-empty__copy,
          .history-modal__description {
            font-size: 12px;
          }

          .history-btn,
          .history-icon-button,
          .history-filter-button {
            min-height: 42px;
          }

          .history-btn {
            font-size: 13px;
          }
        }
      `}</style>
    </main>
  );
}
