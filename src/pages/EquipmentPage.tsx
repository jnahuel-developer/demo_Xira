import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  activeEquipmentCenterName,
  equipmentMock,
  type EquipmentItem,
  type EquipmentLocationType,
  type EquipmentSupplyRef,
} from "../mocks/equipment.mock";

type AvailabilityFilter = "available" | "unavailable";
type LocationFilter = EquipmentLocationType;
type SupplyFilter = "with_supplies" | "without_supplies";

type EquipmentFilters = {
  availability: AvailabilityFilter[];
  locations: LocationFilter[];
  supplies: SupplyFilter[];
};

const DEFAULT_FILTERS: EquipmentFilters = {
  availability: ["available", "unavailable"],
  locations: ["active_center", "other_center", "service"],
  supplies: ["with_supplies", "without_supplies"],
};

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function isAvailable(item: EquipmentItem) {
  return item.locationType === "active_center";
}

function getUnavailableReason(item: EquipmentItem) {
  if (item.locationType === "service") {
    return "En service técnico";
  }

  return "No disponible en el centro actual";
}

function filterEquipment(
  items: EquipmentItem[],
  search: string,
  filters: EquipmentFilters
) {
  const normalizedSearch = normalizeText(search.trim());

  return items.filter((item) => {
    const availabilityKey = isAvailable(item) ? "available" : "unavailable";
    if (!filters.availability.includes(availabilityKey)) {
      return false;
    }

    if (!filters.locations.includes(item.locationType)) {
      return false;
    }

    const supplyKey = item.supplies.length ? "with_supplies" : "without_supplies";
    if (!filters.supplies.includes(supplyKey)) {
      return false;
    }

    if (!normalizedSearch) {
      return true;
    }

    return normalizeText(item.name).includes(normalizedSearch);
  });
}

function toggleValueKeepOne<T extends string>(current: T[], value: T) {
  if (current.includes(value)) {
    if (current.length === 1) {
      return current;
    }

    return current.filter((item) => item !== value);
  }

  return [...current, value];
}

function DetailModal({
  equipmentName,
  items,
  onClose,
  onOpenDetail,
}: {
  equipmentName: string;
  items: EquipmentSupplyRef[];
  onClose: () => void;
  onOpenDetail: (id: string) => void;
}) {
  return (
    <div className="equipment-modal-backdrop" role="presentation">
      <div
        className="equipment-detail-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="equipment-supplies-title"
      >
        <div className="equipment-modal__header">
          <div>
            <h2 id="equipment-supplies-title" className="equipment-modal__title">
              Insumos
            </h2>
            <p className="equipment-modal__description">{equipmentName}</p>
          </div>

          <button
            type="button"
            className="equipment-modal__close"
            aria-label="Cerrar"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="equipment-detail-list">
          {items.length ? (
            items.map((item) => (
              <article key={item.id} className="equipment-detail-item">
                <p className="equipment-detail-item__title">{item.name}</p>

                <button
                  type="button"
                  className="equipment-detail-item__action"
                  onClick={() => onOpenDetail(item.id)}
                >
                  Detalle
                </button>
              </article>
            ))
          ) : (
            <div className="equipment-detail-empty">
              Este equipo no tiene insumos asociados.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterButtonIcon() {
  return (
    <svg className="equipment-filter-button__icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7h16M7 12h10M10 17h4" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg className="equipment-edit-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 20h4l10.5-10.5-4-4L4 16v4Zm9.5-14.5 4 4" />
    </svg>
  );
}

export default function EquipmentPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<EquipmentFilters>(DEFAULT_FILTERS);
  const [draftFilters, setDraftFilters] = useState<EquipmentFilters>(DEFAULT_FILTERS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isSuppliesOpen, setIsSuppliesOpen] = useState(false);

  const visibleEquipment = useMemo(() => {
    return filterEquipment(equipmentMock, search, filters);
  }, [filters, search]);

  useEffect(() => {
    if (!visibleEquipment.length) {
      if (selectedId !== null) {
        setSelectedId(null);
      }
      return;
    }

    if (!selectedId || !visibleEquipment.some((item) => item.id === selectedId)) {
      setSelectedId(visibleEquipment[0].id);
    }
  }, [selectedId, visibleEquipment]);

  const selectedEquipment = useMemo(() => {
    if (!visibleEquipment.length) {
      return null;
    }

    return visibleEquipment.find((item) => item.id === selectedId) ?? visibleEquipment[0];
  }, [selectedId, visibleEquipment]);

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

  return (
    <main className="equipment-screen">
      <div className="equipment-safe-top" />

      <section className="equipment-content">
        <header className="equipment-topbar">
          <button
            type="button"
            className="equipment-icon-button"
            aria-label="Volver"
            onClick={() => navigate(-1)}
          >
            ‹
          </button>

          <button
            type="button"
            className="equipment-icon-button"
            aria-label="Nuevo equipo"
            onClick={() => navigate("/equipos/nuevo")}
          >
            +
          </button>
        </header>

        <section className="equipment-center-card" aria-label="Centro actual">
          <span className="equipment-center-card__label">Centro actual</span>
          <p className="equipment-center-card__value">{activeEquipmentCenterName}</p>
        </section>

        <section className="equipment-filters-card">
          <div className="equipment-search-row">
            <div className="equipment-search">
              <span className="equipment-search__icon" aria-hidden="true">
                ⌕
              </span>
              <input
                type="search"
                className="equipment-search__input"
                placeholder="Buscar equipo"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            <button
              type="button"
              className="equipment-filter-button"
              aria-label="Abrir filtros"
              onClick={openFilters}
            >
              <FilterButtonIcon />
            </button>
          </div>
        </section>

        <section className="equipment-list-card">
          <div className="equipment-list-card__head">
            <h2 className="equipment-section-title">Equipos</h2>
            <span className="equipment-list-card__count">{visibleEquipment.length}</span>
          </div>

          <div className="equipment-list-scroll">
            {visibleEquipment.length ? (
              <div className="equipment-list">
                {visibleEquipment.map((item) => {
                  const unavailable = !isAvailable(item);
                  const isSelected = item.id === selectedEquipment?.id;

                  return (
                    <article
                      key={item.id}
                      className={`equipment-row ${
                        unavailable ? "equipment-row--unavailable" : ""
                      } ${
                        isSelected ? "equipment-row--selected" : ""
                      }`.trim()}
                    >
                      <button
                        type="button"
                        className="equipment-row__select"
                        aria-pressed={isSelected}
                        onClick={() => setSelectedId(item.id)}
                      >
                        <span className="equipment-row__copy">
                          <span className="equipment-row__name">{item.name}</span>
                          <span className="equipment-row__meta">{item.descriptor}</span>
                          <span className="equipment-row__meta">{item.locationLabel}</span>
                          {unavailable ? (
                            <span className="equipment-row__alert">
                              {getUnavailableReason(item)}
                            </span>
                          ) : null}
                        </span>
                      </button>

                      <button
                        type="button"
                        className="equipment-row__action"
                        aria-label={`Editar ${item.name}`}
                        onClick={() => navigate(`/equipos/${item.id}/editar`)}
                      >
                        <EditIcon />
                        <span className="equipment-row__action-label">Editar</span>
                      </button>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="equipment-empty-state">
                <p className="equipment-empty-state__title">No se encontraron equipos</p>
                <p className="equipment-empty-state__copy">
                  Probá con otro filtro o buscá por otro nombre.
                </p>
              </div>
            )}
          </div>
        </section>

        <article className="equipment-summary-card">
          <div className="equipment-summary-card__inner">
            <div className="equipment-summary-actions">
              <button
                type="button"
                className="equipment-btn equipment-btn--secondary"
                onClick={() => setIsSuppliesOpen(true)}
                disabled={!selectedEquipment}
              >
                Insumos ({selectedEquipment?.supplies.length ?? 0})
              </button>

              <button
                type="button"
                className="equipment-btn equipment-btn--primary"
                onClick={() =>
                  selectedEquipment
                    ? navigate(`/equipos/${selectedEquipment.id}/traslado`)
                    : null
                }
                disabled={!selectedEquipment}
              >
                Trasladar
              </button>
            </div>
          </div>
        </article>
      </section>

      {isFiltersOpen ? (
        <div className="equipment-modal-backdrop" role="presentation">
          <div
            className="equipment-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="equipment-filters-title"
          >
            <div className="equipment-modal__header">
              <div>
                <h2 id="equipment-filters-title" className="equipment-modal__title">
                  Filtros
                </h2>
                <p className="equipment-modal__description">
                  Ajustá la lista sin cargar la pantalla principal.
                </p>
              </div>

              <button
                type="button"
                className="equipment-modal__close"
                aria-label="Cerrar"
                onClick={() => setIsFiltersOpen(false)}
              >
                ×
              </button>
            </div>

            <div className="equipment-modal__section">
              <p className="equipment-modal__label">Estado</p>
              <div className="equipment-modal__stack">
                {[
                  { label: "Disponibles", value: "available" as const },
                  { label: "No disponibles", value: "unavailable" as const },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`equipment-modal-option ${
                      draftFilters.availability.includes(option.value)
                        ? "equipment-modal-option--active"
                        : ""
                    }`.trim()}
                    onClick={() =>
                      setDraftFilters((current) => ({
                        ...current,
                        availability: toggleValueKeepOne(
                          current.availability,
                          option.value
                        ),
                      }))
                    }
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="equipment-modal__section">
              <p className="equipment-modal__label">Ubicación</p>
              <div className="equipment-modal__stack">
                {[
                  { label: "Centro activo", value: "active_center" as const },
                  { label: "Otro centro", value: "other_center" as const },
                  { label: "Service técnico", value: "service" as const },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`equipment-modal-option ${
                      draftFilters.locations.includes(option.value)
                        ? "equipment-modal-option--active"
                        : ""
                    }`.trim()}
                    onClick={() =>
                      setDraftFilters((current) => ({
                        ...current,
                        locations: toggleValueKeepOne(current.locations, option.value),
                      }))
                    }
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="equipment-modal__section">
              <p className="equipment-modal__label">Insumos</p>
              <div className="equipment-modal__stack">
                {[
                  { label: "Con insumos", value: "with_supplies" as const },
                  { label: "Sin insumos", value: "without_supplies" as const },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`equipment-modal-option ${
                      draftFilters.supplies.includes(option.value)
                        ? "equipment-modal-option--active"
                        : ""
                    }`.trim()}
                    onClick={() =>
                      setDraftFilters((current) => ({
                        ...current,
                        supplies: toggleValueKeepOne(current.supplies, option.value),
                      }))
                    }
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="equipment-modal__actions">
              <button
                type="button"
                className="equipment-btn equipment-btn--ghost"
                onClick={clearDraftFilters}
              >
                Limpiar filtros
              </button>

              <button
                type="button"
                className="equipment-btn equipment-btn--primary"
                onClick={applyFilters}
              >
                Aplicar
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {isSuppliesOpen && selectedEquipment ? (
        <DetailModal
          equipmentName={selectedEquipment.name}
          items={selectedEquipment.supplies}
          onClose={() => setIsSuppliesOpen(false)}
          onOpenDetail={openSupplyDetail}
        />
      ) : null}

      <style>{`
        .equipment-screen {
          min-height: calc(100dvh - 92px - env(safe-area-inset-bottom, 0px));
          height: calc(100dvh - 92px - env(safe-area-inset-bottom, 0px));
          background:
            radial-gradient(circle at top left, rgba(84, 140, 190, 0.15), transparent 34%),
            linear-gradient(180deg, #f7fbff 0%, #eef4fb 100%);
          overflow: hidden;
        }

        .equipment-safe-top {
          height: env(safe-area-inset-top, 0px);
          min-height: 8px;
        }

        .equipment-content {
          height: calc(100% - env(safe-area-inset-top, 0px));
          padding: 12px 16px 16px;
          display: grid;
          grid-template-rows: auto auto auto minmax(0, 1fr) auto;
          gap: 12px;
          overflow: hidden;
        }

        @media (min-width: 390px) {
          .equipment-content {
            padding-left: 20px;
            padding-right: 20px;
          }
        }

        .equipment-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 2px;
        }

        .equipment-icon-button {
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

        .equipment-center-card,
        .equipment-filters-card,
        .equipment-list-card,
        .equipment-summary-card,
        .equipment-modal,
        .equipment-detail-modal {
          border: 1px solid #dce7f3;
          background: rgba(255, 255, 255, 0.92);
          box-shadow: 0 12px 28px rgba(48, 90, 138, 0.08);
        }

        .equipment-center-card {
          border-radius: 20px;
          padding: 14px 16px;
          display: grid;
          gap: 4px;
          justify-items: center;
          text-align: center;
        }

        .equipment-center-card__label,
        .equipment-modal__label {
          color: #53708f;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .equipment-center-card__value {
          margin: 0;
          color: #163252;
          font-size: 19px;
          line-height: 1.2;
          font-weight: 800;
          letter-spacing: -0.02em;
        }

        .equipment-filters-card {
          border-radius: 22px;
          padding: 12px;
        }

        .equipment-search-row {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 52px;
          gap: 10px;
        }

        .equipment-search {
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

        .equipment-search__icon {
          color: #68819d;
          font-size: 18px;
          line-height: 1;
          flex-shrink: 0;
        }

        .equipment-search__input {
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

        .equipment-search__input::placeholder {
          color: #8194aa;
          opacity: 1;
        }

        .equipment-filter-button {
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

        .equipment-filter-button__icon,
        .equipment-edit-icon {
          width: 22px;
          height: 22px;
          stroke: currentColor;
          stroke-width: 2;
          fill: none;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .equipment-list-card {
          min-height: 0;
          border-radius: 28px;
          padding: 16px;
          display: grid;
          grid-template-rows: auto minmax(0, 1fr);
          gap: 14px;
          overflow: hidden;
        }

        .equipment-list-card__head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .equipment-section-title {
          margin: 0;
          color: #163252;
          font-size: 22px;
          line-height: 1.1;
          font-weight: 800;
          letter-spacing: -0.03em;
        }

        .equipment-list-card__count {
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

        .equipment-list-scroll {
          min-height: 0;
          overflow-y: auto;
        }

        .equipment-list {
          display: grid;
          gap: 10px;
        }

        .equipment-row {
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

        .equipment-row--unavailable {
          border-color: rgba(212, 124, 124, 0.4);
          background: linear-gradient(180deg, #fff5f5 0%, #fdeaea 100%);
        }

        .equipment-row--selected {
          border-color: #3c6c9e;
          box-shadow: 0 0 0 2px rgba(60, 108, 158, 0.18), 0 12px 24px rgba(45, 95, 147, 0.11);
        }

        .equipment-row__select {
          min-width: 0;
          border: 0;
          background: transparent;
          padding: 0;
          text-align: left;
          cursor: pointer;
        }

        .equipment-row__copy {
          min-width: 0;
          display: grid;
          gap: 4px;
        }

        .equipment-row__name {
          color: #163252;
          font-size: 16px;
          line-height: 1.18;
          font-weight: 800;
          letter-spacing: -0.02em;
        }

        .equipment-row__meta {
          color: #5e7793;
          font-size: 13px;
          line-height: 1.24;
          font-weight: 700;
        }

        .equipment-row__alert {
          color: #b64d4d;
          font-size: 13px;
          line-height: 1.22;
          font-weight: 800;
        }

        .equipment-row__action {
          min-width: 66px;
          border: 0;
          background: transparent;
          display: grid;
          justify-items: center;
          gap: 4px;
          color: #2d5f93;
          cursor: pointer;
          padding: 0;
        }

        .equipment-row__action-label {
          font-size: 12px;
          line-height: 1;
          font-weight: 800;
        }

        .equipment-empty-state,
        .equipment-detail-empty {
          border: 1px dashed #ccdced;
          border-radius: 20px;
          background: #f7fbff;
          padding: 18px 16px;
          text-align: center;
        }

        .equipment-empty-state__title {
          margin: 0;
          color: #163252;
          font-size: 16px;
          line-height: 1.2;
          font-weight: 800;
        }

        .equipment-empty-state__copy,
        .equipment-detail-empty {
          margin: 6px 0 0;
          color: #627791;
          font-size: 14px;
          line-height: 1.35;
          font-weight: 600;
        }

        .equipment-summary-card {
          border-radius: 28px;
          overflow: hidden;
        }

        .equipment-summary-card__inner {
          padding: 14px;
        }

        .equipment-summary-actions,
        .equipment-modal__actions {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        .equipment-btn {
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

        .equipment-btn--primary {
          background: linear-gradient(180deg, #1f5d95 0%, #184d7d 100%);
          color: #ffffff;
          box-shadow: 0 12px 24px rgba(24, 77, 125, 0.18);
        }

        .equipment-btn--secondary {
          background: rgba(31, 93, 149, 0.1);
          color: #174973;
        }

        .equipment-btn--ghost {
          background: transparent;
          color: #58728f;
          border: 1px solid #dbe7f2;
        }

        .equipment-btn:disabled {
          opacity: 0.45;
          cursor: not-allowed;
          box-shadow: none;
        }

        .equipment-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(17, 31, 47, 0.42);
          display: grid;
          align-items: end;
          padding: 18px 16px calc(110px + env(safe-area-inset-bottom, 0px));
          z-index: 30;
        }

        .equipment-modal,
        .equipment-detail-modal {
          width: min(100%, 460px);
          justify-self: center;
          border-radius: 28px;
          padding: 18px;
          display: grid;
          gap: 16px;
        }

        .equipment-detail-list {
          display: grid;
          gap: 10px;
          max-height: min(42dvh, 360px);
          overflow-y: auto;
        }

        .equipment-detail-item {
          border: 1px solid #dce7f3;
          border-radius: 18px;
          background: #f8fbff;
          padding: 14px;
          display: grid;
          gap: 10px;
        }

        .equipment-detail-item__title {
          margin: 0;
          color: #163252;
          font-size: 16px;
          line-height: 1.2;
          font-weight: 800;
        }

        .equipment-detail-item__action {
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

        .equipment-modal__header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }

        .equipment-modal__title {
          margin: 0;
          color: #163252;
          font-size: 22px;
          line-height: 1.1;
          font-weight: 800;
          letter-spacing: -0.03em;
        }

        .equipment-modal__description {
          margin: 6px 0 0;
          color: #617893;
          font-size: 14px;
          line-height: 1.35;
          font-weight: 600;
        }

        .equipment-modal__close {
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

        .equipment-modal__section {
          display: grid;
          gap: 10px;
        }

        .equipment-modal__stack {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        .equipment-modal-option {
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

        .equipment-modal-option--active {
          border-color: #1f5d95;
          background: rgba(31, 93, 149, 0.1);
          color: #174973;
        }

        @media (max-height: 700px) {
          .equipment-content {
            padding-top: 8px;
            gap: 10px;
          }

          .equipment-center-card,
          .equipment-filters-card,
          .equipment-summary-card__inner,
          .equipment-list-card,
          .equipment-modal,
          .equipment-detail-modal {
            padding-top: 12px;
            padding-bottom: 12px;
          }

          .equipment-center-card__value,
          .equipment-modal__title {
            font-size: 18px;
          }

          .equipment-section-title {
            font-size: 19px;
          }

          .equipment-search,
          .equipment-filter-button,
          .equipment-btn,
          .equipment-modal-option {
            min-height: 44px;
          }

          .equipment-row {
            padding-top: 12px;
            padding-bottom: 12px;
          }

          .equipment-row__name,
          .equipment-detail-item__title {
            font-size: 15px;
          }

          .equipment-row__meta,
          .equipment-row__alert,
          .equipment-empty-state__copy,
          .equipment-detail-empty,
          .equipment-modal__description {
            font-size: 13px;
          }
        }
      `}</style>
    </main>
  );
}
