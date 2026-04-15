import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  activeCenterName,
  treatmentsMock,
  type TreatmentCategory,
  type TreatmentCertification,
  type TreatmentListItem,
  type TreatmentStatus,
  type TreatmentSupply,
} from "../mocks/treatments.mock";

type CriticalityFilter = "critical" | "not_critical";
type EquipmentFilter = "yes" | "no";

type TreatmentFilters = {
  statuses: TreatmentStatus[];
  categories: TreatmentCategory[];
  criticality: CriticalityFilter[];
  equipment: EquipmentFilter[];
};

const DEFAULT_FILTERS: TreatmentFilters = {
  statuses: ["enabled"],
  categories: ["Inyectables", "Aparatología"],
  criticality: ["critical", "not_critical"],
  equipment: ["yes", "no"],
};

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function toggleFilterValue<T extends string>(current: T[], value: T) {
  if (current.includes(value)) {
    if (current.length === 1) {
      return current;
    }

    return current.filter((item) => item !== value);
  }

  return [...current, value];
}

function getPrimaryStatusReason(treatment: TreatmentListItem) {
  if (!treatment.enabledInCurrentCenter) {
    return "No habilitado en este centro";
  }

  if (treatment.requiresEquipment && !treatment.equipmentAvailable) {
    return "Equipo no disponible";
  }

  if (!treatment.suppliesAvailable) {
    return "Faltan insumos";
  }

  return "Bloqueado en el centro actual";
}

function filterTreatments(
  treatments: TreatmentListItem[],
  search: string,
  filters: TreatmentFilters
) {
  const normalizedSearch = normalizeText(search.trim());

  return treatments.filter((treatment) => {
    if (!filters.statuses.includes(treatment.status)) {
      return false;
    }

    if (!filters.categories.includes(treatment.category)) {
      return false;
    }

    const criticalityKey = treatment.critical ? "critical" : "not_critical";
    if (!filters.criticality.includes(criticalityKey)) {
      return false;
    }

    const equipmentKey = treatment.requiresEquipment ? "yes" : "no";
    if (!filters.equipment.includes(equipmentKey)) {
      return false;
    }

    if (!normalizedSearch) {
      return true;
    }

    return normalizeText(treatment.name).includes(normalizedSearch);
  });
}

function FilterButtonIcon() {
  return (
    <svg className="treatments-filter-button__icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7h16M7 12h10M10 17h4" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg className="treatments-edit-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 20h4l10.5-10.5-4-4L4 16v4Zm9.5-14.5 4 4" />
    </svg>
  );
}

type DetailModalProps = {
  title: string;
  items: TreatmentSupply[] | TreatmentCertification[];
  emptyText: string;
  kind: "supplies" | "certifications";
  onClose: () => void;
  onOpenDetail: (id: string) => void;
};

function DetailModal({
  title,
  items,
  emptyText,
  kind,
  onClose,
  onOpenDetail,
}: DetailModalProps) {
  return (
    <div className="treatments-modal-backdrop" role="presentation">
      <div
        className="treatments-detail-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`treatments-detail-title-${kind}`}
      >
        <div className="treatments-modal__header">
          <h2
            id={`treatments-detail-title-${kind}`}
            className="treatments-modal__title"
          >
            {title}
          </h2>

          <button
            type="button"
            className="treatments-modal__close"
            aria-label="Cerrar"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="treatments-detail-list">
          {items.length ? (
            items.map((item) => (
              <article key={item.id} className="treatments-detail-item">
                <div className="treatments-detail-item__copy">
                  <p className="treatments-detail-item__title">{item.name}</p>
                  <p className="treatments-detail-item__meta">
                    {"quantityLabel" in item ? item.quantityLabel : item.expiresLabel}
                  </p>
                </div>

                <button
                  type="button"
                  className="treatments-detail-item__action"
                  onClick={() => onOpenDetail(item.id)}
                >
                  Detalle
                </button>
              </article>
            ))
          ) : (
            <div className="treatments-detail-empty">{emptyText}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TreatmentsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<TreatmentFilters>(DEFAULT_FILTERS);
  const [draftFilters, setDraftFilters] = useState<TreatmentFilters>(DEFAULT_FILTERS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isSuppliesOpen, setIsSuppliesOpen] = useState(false);
  const [isCertificationsOpen, setIsCertificationsOpen] = useState(false);

  const visibleTreatments = useMemo(() => {
    return filterTreatments(treatmentsMock, search, filters);
  }, [filters, search]);

  useEffect(() => {
    if (!visibleTreatments.length) {
      if (selectedId !== null) {
        setSelectedId(null);
      }
      return;
    }

    if (!selectedId || !visibleTreatments.some((item) => item.id === selectedId)) {
      setSelectedId(visibleTreatments[0].id);
    }
  }, [selectedId, visibleTreatments]);

  const selectedTreatment = useMemo(() => {
    if (!visibleTreatments.length) {
      return null;
    }

    return visibleTreatments.find((item) => item.id === selectedId) ?? visibleTreatments[0];
  }, [selectedId, visibleTreatments]);

  function openFilters() {
    setDraftFilters(filters);
    setIsFiltersOpen(true);
  }

  function clearDraftFilters() {
    setDraftFilters(DEFAULT_FILTERS);
  }

  function applyFilters() {
    setFilters(draftFilters);
    setIsFiltersOpen(false);
  }

  function openSupplyDetail(supplyId: string) {
    setIsSuppliesOpen(false);
    navigate(`/insumo/${supplyId}`);
  }

  function openCertificationDetail(certificationId: string) {
    setIsCertificationsOpen(false);
    navigate(`/certificacion/${certificationId}`);
  }

  return (
    <main className="treatments-screen">
      <div className="treatments-safe-top" />

      <section className="treatments-content">
        <header className="treatments-topbar">
          <button
            type="button"
            className="treatments-icon-button"
            aria-label="Volver"
            onClick={() => navigate(-1)}
          >
            ‹
          </button>

          <button
            type="button"
            className="treatments-icon-button"
            aria-label="Nuevo tratamiento"
            onClick={() => navigate("/tratamientos/nuevo")}
          >
            +
          </button>
        </header>

        <section className="treatments-center-card" aria-label="Centro actual">
          <span className="treatments-center-card__label">Centro actual</span>
          <p className="treatments-center-card__value">{activeCenterName}</p>
        </section>

        <section className="treatments-filters-card">
          <div className="treatments-search-row">
            <div className="treatments-search">
              <span className="treatments-search__icon" aria-hidden="true">
                ⌕
              </span>
              <input
                type="search"
                className="treatments-search__input"
                placeholder="Buscar tratamiento"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            <button
              type="button"
              className="treatments-filter-button"
              aria-label="Abrir filtros"
              onClick={openFilters}
            >
              <FilterButtonIcon />
            </button>
          </div>
        </section>

        <section className="treatments-list-card">
          <div className="treatments-list-card__head">
            <h2 className="treatments-section-title">Tratamientos</h2>
            <span className="treatments-list-card__count">{visibleTreatments.length}</span>
          </div>

          <div className="treatments-list-scroll">
            {visibleTreatments.length ? (
              <div className="treatments-list">
                {visibleTreatments.map((treatment) => {
                  const isSelected = treatment.id === selectedTreatment?.id;

                  return (
                    <article
                      key={treatment.id}
                      className={`treatments-row ${
                        treatment.status === "blocked" ? "treatments-row--blocked" : ""
                      } ${
                        isSelected ? "treatments-row--selected" : ""
                      }`.trim()}
                    >
                      <button
                        type="button"
                        className="treatments-row__select"
                        aria-pressed={isSelected}
                        onClick={() => setSelectedId(treatment.id)}
                      >
                        <span className="treatments-row__copy">
                          <span className="treatments-row__name">{treatment.name}</span>
                          <span className="treatments-row__meta">
                            {treatment.category} · {treatment.durationLabel}
                          </span>
                          <span className="treatments-row__equipment">
                            {treatment.requiresEquipment
                              ? treatment.equipmentName
                              : "No requiere equipo"}
                          </span>
                          {treatment.status === "blocked" ? (
                            <span className="treatments-row__blocked-reason">
                              {getPrimaryStatusReason(treatment)}
                            </span>
                          ) : null}
                        </span>
                      </button>

                      <button
                        type="button"
                        className="treatments-row__action"
                        aria-label={`Editar ${treatment.name}`}
                        onClick={() => navigate(`/tratamientos/${treatment.id}/editar`)}
                      >
                        <EditIcon />
                        <span className="treatments-row__action-label">Editar</span>
                      </button>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="treatments-empty-state">
                <p className="treatments-empty-state__title">
                  No se encontraron tratamientos
                </p>
                <p className="treatments-empty-state__copy">
                  Probá con otro filtro o buscá por otro nombre.
                </p>
              </div>
            )}
          </div>
        </section>

        <article className="treatments-summary-card">
          <div className="treatments-summary-card__inner">
            <div className="treatments-summary-actions treatments-summary-actions--only">
              <button
                type="button"
                className="treatments-btn treatments-btn--secondary"
                onClick={() => setIsSuppliesOpen(true)}
                disabled={!selectedTreatment}
              >
                Insumos ({selectedTreatment?.supplies.length ?? 0})
              </button>

              <button
                type="button"
                className="treatments-btn treatments-btn--primary"
                onClick={() => setIsCertificationsOpen(true)}
                disabled={!selectedTreatment}
              >
                Certificaciones ({selectedTreatment?.certifications.length ?? 0})
              </button>
            </div>
          </div>
        </article>
      </section>

      {isFiltersOpen ? (
        <div className="treatments-modal-backdrop" role="presentation">
          <div
            className="treatments-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="treatments-filters-title"
          >
            <div className="treatments-modal__header">
              <div>
                <h2 id="treatments-filters-title" className="treatments-modal__title">
                  Filtros
                </h2>
                <p className="treatments-modal__description">
                  Ajustá la lista sin ocupar espacio en la pantalla principal.
                </p>
              </div>

              <button
                type="button"
                className="treatments-modal__close"
                aria-label="Cerrar"
                onClick={() => setIsFiltersOpen(false)}
              >
                ×
              </button>
            </div>

            <div className="treatments-modal__section">
              <p className="treatments-modal__label">Estado</p>
              <div className="treatments-modal__stack">
                {[
                  { label: "Habilitados", value: "enabled" as const },
                  { label: "Bloqueados", value: "blocked" as const },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`treatments-modal-option ${
                      draftFilters.statuses.includes(option.value)
                        ? "treatments-modal-option--active"
                        : ""
                    }`.trim()}
                    onClick={() =>
                      setDraftFilters((current) => ({
                        ...current,
                        statuses: toggleFilterValue(current.statuses, option.value),
                      }))
                    }
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="treatments-modal__section">
              <p className="treatments-modal__label">Categoría</p>
              <div className="treatments-modal__stack">
                {(["Inyectables", "Aparatología"] as TreatmentCategory[]).map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={`treatments-modal-option ${
                      draftFilters.categories.includes(option)
                        ? "treatments-modal-option--active"
                        : ""
                    }`.trim()}
                    onClick={() =>
                      setDraftFilters((current) => ({
                        ...current,
                        categories: toggleFilterValue(current.categories, option),
                      }))
                    }
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="treatments-modal__section">
              <p className="treatments-modal__label">Criticidad</p>
              <div className="treatments-modal__stack">
                {[
                  { label: "Crítico", value: "critical" as const },
                  { label: "No crítico", value: "not_critical" as const },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`treatments-modal-option ${
                      draftFilters.criticality.includes(option.value)
                        ? "treatments-modal-option--active"
                        : ""
                    }`.trim()}
                    onClick={() =>
                      setDraftFilters((current) => ({
                        ...current,
                        criticality: toggleFilterValue(current.criticality, option.value),
                      }))
                    }
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="treatments-modal__section">
              <p className="treatments-modal__label">Requiere equipo</p>
              <div className="treatments-modal__stack">
                {[
                  { label: "Sí", value: "yes" as const },
                  { label: "No", value: "no" as const },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`treatments-modal-option ${
                      draftFilters.equipment.includes(option.value)
                        ? "treatments-modal-option--active"
                        : ""
                    }`.trim()}
                    onClick={() =>
                      setDraftFilters((current) => ({
                        ...current,
                        equipment: toggleFilterValue(current.equipment, option.value),
                      }))
                    }
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="treatments-modal__actions">
              <button
                type="button"
                className="treatments-btn treatments-btn--ghost"
                onClick={clearDraftFilters}
              >
                Limpiar filtros
              </button>

              <button
                type="button"
                className="treatments-btn treatments-btn--primary"
                onClick={applyFilters}
              >
                Aplicar
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {isSuppliesOpen && selectedTreatment ? (
        <DetailModal
          title="Insumos"
          items={selectedTreatment.supplies}
          emptyText="Este tratamiento no tiene insumos asociados."
          kind="supplies"
          onClose={() => setIsSuppliesOpen(false)}
          onOpenDetail={openSupplyDetail}
        />
      ) : null}

      {isCertificationsOpen && selectedTreatment ? (
        <DetailModal
          title="Certificaciones"
          items={selectedTreatment.certifications}
          emptyText="Este tratamiento no requiere certificaciones."
          kind="certifications"
          onClose={() => setIsCertificationsOpen(false)}
          onOpenDetail={openCertificationDetail}
        />
      ) : null}

      <style>{`
        .treatments-screen {
          min-height: calc(100dvh - 92px - env(safe-area-inset-bottom, 0px));
          height: calc(100dvh - 92px - env(safe-area-inset-bottom, 0px));
          background:
            radial-gradient(circle at top left, rgba(84, 140, 190, 0.15), transparent 34%),
            linear-gradient(180deg, #f7fbff 0%, #eef4fb 100%);
          overflow: hidden;
        }

        .treatments-safe-top {
          height: env(safe-area-inset-top, 0px);
          min-height: 8px;
        }

        .treatments-content {
          height: calc(100% - env(safe-area-inset-top, 0px));
          padding: 12px 16px 16px;
          display: grid;
          grid-template-rows: auto auto auto minmax(0, 1fr) auto;
          gap: 12px;
          overflow: hidden;
        }

        @media (min-width: 390px) {
          .treatments-content {
            padding-left: 20px;
            padding-right: 20px;
          }
        }

        .treatments-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 2px;
        }

        .treatments-icon-button {
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

        .treatments-center-card,
        .treatments-filters-card,
        .treatments-list-card,
        .treatments-summary-card,
        .treatments-modal,
        .treatments-detail-modal {
          border: 1px solid #dce7f3;
          background: rgba(255, 255, 255, 0.92);
          box-shadow: 0 12px 28px rgba(48, 90, 138, 0.08);
        }

        .treatments-center-card {
          border-radius: 20px;
          padding: 14px 16px;
          display: grid;
          gap: 4px;
          justify-items: center;
          text-align: center;
        }

        .treatments-center-card__label,
        .treatments-modal__label {
          color: #53708f;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .treatments-center-card__value {
          margin: 0;
          color: #163252;
          font-size: 19px;
          line-height: 1.2;
          font-weight: 800;
          letter-spacing: -0.02em;
        }

        .treatments-filters-card {
          border-radius: 22px;
          padding: 12px;
        }

        .treatments-search-row {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 52px;
          gap: 10px;
        }

        .treatments-search {
          min-width: 0;
          min-height: 48px;
          border: 1px solid #d7e3ef;
          border-radius: 18px;
          background: #f8fbff;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 14px;
        }

        .treatments-search__icon {
          color: #68819d;
          font-size: 18px;
          line-height: 1;
          flex-shrink: 0;
        }

        .treatments-search__input {
          width: 100%;
          min-width: 0;
          border: 0;
          outline: none;
          background: transparent;
          color: #163252;
          font-size: 15px;
          line-height: 1.2;
          font-weight: 700;
          font-family: inherit;
        }

        .treatments-search__input::placeholder {
          color: #8194aa;
          opacity: 1;
        }

        .treatments-filter-button {
          width: 52px;
          min-width: 52px;
          min-height: 48px;
          border: 1px solid #d7e3ef;
          border-radius: 18px;
          background: #f8fbff;
          display: grid;
          place-items: center;
          cursor: pointer;
          color: #35597d;
        }

        .treatments-filter-button__icon,
        .treatments-edit-icon {
          width: 22px;
          height: 22px;
          stroke: currentColor;
          stroke-width: 2;
          fill: none;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .treatments-list-card {
          min-height: 0;
          border-radius: 28px;
          padding: 16px;
          display: grid;
          grid-template-rows: auto minmax(0, 1fr);
          gap: 14px;
          overflow: hidden;
        }

        .treatments-list-card__head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .treatments-section-title {
          margin: 0;
          color: #163252;
          font-size: 22px;
          line-height: 1.1;
          font-weight: 800;
          letter-spacing: -0.03em;
        }

        .treatments-list-card__count {
          min-width: 32px;
          height: 32px;
          padding: 0 10px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #ebf3fb;
          color: #2d5f93;
          font-size: 13px;
          font-weight: 800;
          flex-shrink: 0;
        }

        .treatments-list-scroll {
          min-height: 0;
          overflow-y: auto;
        }

        .treatments-list {
          display: grid;
          gap: 10px;
        }

        .treatments-row {
          border: 1px solid #dce7f3;
          border-radius: 20px;
          background: #f9fbfe;
          box-shadow: 0 8px 20px rgba(48, 90, 138, 0.05);
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 12px;
          align-items: center;
          padding: 14px;
        }

        .treatments-row--selected {
          border-color: #8cb3d9;
          background: linear-gradient(180deg, #f7fbff 0%, #eef5fd 100%);
          box-shadow: 0 12px 24px rgba(45, 95, 147, 0.11);
        }

        .treatments-row--blocked {
          border-color: rgba(212, 124, 124, 0.4);
          background: linear-gradient(180deg, #fff5f5 0%, #fdeaea 100%);
        }

        .treatments-row--blocked.treatments-row--selected {
          border-color: #d97474;
          box-shadow: 0 12px 24px rgba(185, 89, 89, 0.15);
        }

        .treatments-row__select {
          min-width: 0;
          border: 0;
          background: transparent;
          padding: 0;
          text-align: left;
          cursor: pointer;
        }

        .treatments-row__copy {
          min-width: 0;
          display: grid;
          gap: 4px;
        }

        .treatments-row__name {
          color: #163252;
          font-size: 16px;
          line-height: 1.18;
          font-weight: 800;
          letter-spacing: -0.02em;
        }

        .treatments-row__meta {
          color: #5e7793;
          font-size: 13px;
          line-height: 1.25;
          font-weight: 700;
        }

        .treatments-row__equipment {
          color: #5b7390;
          font-size: 13px;
          line-height: 1.22;
          font-weight: 700;
        }

        .treatments-row__blocked-reason {
          color: #b64d4d;
          font-size: 13px;
          line-height: 1.22;
          font-weight: 800;
        }

        .treatments-row__action {
          min-width: 66px;
          border: 0;
          background: transparent;
          display: grid;
          justify-items: center;
          gap: 4px;
          color: #2d5f93;
          cursor: pointer;
          user-select: none;
          padding: 0;
        }

        .treatments-row__action-label {
          font-size: 12px;
          line-height: 1;
          font-weight: 800;
        }

        .treatments-empty-state,
        .treatments-detail-empty {
          border: 1px dashed #ccdced;
          border-radius: 20px;
          background: #f7fbff;
          padding: 18px 16px;
          text-align: center;
        }

        .treatments-empty-state__title {
          margin: 0;
          color: #163252;
          font-size: 16px;
          line-height: 1.2;
          font-weight: 800;
        }

        .treatments-empty-state__copy,
        .treatments-detail-empty {
          margin: 6px 0 0;
          color: #627791;
          font-size: 14px;
          line-height: 1.35;
          font-weight: 600;
        }

        .treatments-summary-card {
          border-radius: 28px;
          overflow: hidden;
        }

        .treatments-summary-card__inner {
          padding: 14px;
        }

        .treatments-summary-actions,
        .treatments-modal__actions {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        .treatments-btn {
          width: 100%;
          min-width: 0;
          min-height: 48px;
          border-radius: 18px;
          border: 0;
          font-size: 14px;
          line-height: 1.15;
          font-weight: 800;
          cursor: pointer;
          font-family: inherit;
          padding: 0 14px;
        }

        .treatments-btn:disabled {
          opacity: 0.45;
          cursor: not-allowed;
          box-shadow: none;
        }

        .treatments-btn--primary {
          background: linear-gradient(180deg, #1f5d95 0%, #184d7d 100%);
          color: #ffffff;
          box-shadow: 0 12px 24px rgba(24, 77, 125, 0.18);
        }

        .treatments-btn--secondary {
          background: rgba(31, 93, 149, 0.1);
          color: #174973;
        }

        .treatments-btn--ghost {
          background: transparent;
          color: #58728f;
          border: 1px solid #dbe7f2;
        }

        .treatments-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(17, 31, 47, 0.42);
          display: grid;
          align-items: end;
          padding: 18px 16px calc(110px + env(safe-area-inset-bottom, 0px));
          z-index: 30;
        }

        .treatments-modal,
        .treatments-detail-modal {
          width: min(100%, 460px);
          justify-self: center;
          border-radius: 28px;
          padding: 18px;
          display: grid;
          gap: 16px;
        }

        .treatments-modal__header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }

        .treatments-modal__title {
          margin: 0;
          color: #163252;
          font-size: 22px;
          line-height: 1.1;
          font-weight: 800;
          letter-spacing: -0.03em;
        }

        .treatments-modal__description {
          margin: 6px 0 0;
          color: #617893;
          font-size: 14px;
          line-height: 1.35;
          font-weight: 600;
        }

        .treatments-modal__close {
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

        .treatments-modal__section {
          display: grid;
          gap: 10px;
        }

        .treatments-modal__stack {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        .treatments-modal-option {
          width: 100%;
          min-width: 0;
          min-height: 46px;
          border-radius: 16px;
          border: 1px solid #dbe7f3;
          background: #f8fbff;
          color: #5b7391;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          padding: 0 12px;
        }

        .treatments-modal-option--active {
          border-color: #1f5d95;
          background: rgba(31, 93, 149, 0.1);
          color: #174973;
        }

        .treatments-detail-list {
          display: grid;
          gap: 10px;
          max-height: min(42dvh, 360px);
          overflow-y: auto;
        }

        .treatments-detail-item {
          border: 1px solid #dce7f3;
          border-radius: 18px;
          background: #f8fbff;
          padding: 14px;
          display: grid;
          gap: 10px;
        }

        .treatments-detail-item__copy {
          display: grid;
          gap: 4px;
        }

        .treatments-detail-item__title {
          margin: 0;
          color: #163252;
          font-size: 16px;
          line-height: 1.2;
          font-weight: 800;
        }

        .treatments-detail-item__meta {
          margin: 0;
          color: #617893;
          font-size: 13px;
          line-height: 1.25;
          font-weight: 700;
        }

        .treatments-detail-item__action {
          justify-self: start;
          min-height: 40px;
          border-radius: 14px;
          border: 0;
          background: rgba(31, 93, 149, 0.1);
          color: #174973;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          padding: 0 14px;
        }

        @media (max-height: 700px) {
          .treatments-content {
            padding-top: 8px;
            gap: 10px;
          }

          .treatments-center-card,
          .treatments-filters-card,
          .treatments-summary-card__inner,
          .treatments-list-card,
          .treatments-modal,
          .treatments-detail-modal {
            padding-top: 12px;
            padding-bottom: 12px;
          }

          .treatments-center-card__value,
          .treatments-modal__title {
            font-size: 18px;
          }

          .treatments-section-title {
            font-size: 19px;
          }

          .treatments-search,
          .treatments-filter-button,
          .treatments-btn,
          .treatments-modal-option {
            min-height: 44px;
          }

          .treatments-row {
            padding-top: 12px;
            padding-bottom: 12px;
          }

          .treatments-row__name {
            font-size: 15px;
          }

          .treatments-row__meta,
          .treatments-row__equipment,
          .treatments-row__blocked-reason,
          .treatments-empty-state__copy,
          .treatments-detail-empty {
            font-size: 13px;
          }

          .treatments-modal__description,
          .treatments-detail-item__meta {
            font-size: 13px;
          }
        }
      `}</style>
    </main>
  );
}
