import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  activeSupplyCenterName,
  suppliesMock,
  type SupplyItem,
  type SupplyLot,
} from "../mocks/supplies.mock";

type AlertFilter = "expiring" | "low_stock";
type LotFilter = "requires_lot" | "no_lot";
type StockFilter = "with_stock" | "without_stock";
type StockMovementType = "increment" | "decrement";

type SupplyFilters = {
  alerts: AlertFilter[];
  lot: LotFilter[];
  stock: StockFilter[];
};

const DEFAULT_FILTERS: SupplyFilters = {
  alerts: [],
  lot: ["requires_lot", "no_lot"],
  stock: ["with_stock", "without_stock"],
};

const REFERENCE_DATE = new Date("2026-04-15T12:00:00");

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function formatDateLabel(date: string) {
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}

function sortLots(lots: SupplyLot[]) {
  return [...lots].sort((left, right) => left.expiresOn.localeCompare(right.expiresOn));
}

function getActiveLots(item: SupplyItem) {
  return sortLots(item.lots.filter((lot) => lot.stock > 0));
}

function getTotalStock(item: SupplyItem) {
  if (!item.requiresLot) {
    return item.stockOnHand;
  }

  return getActiveLots(item).reduce((total, lot) => total + lot.stock, 0);
}

function getNearestExpiration(item: SupplyItem) {
  if (!item.requiresLot) {
    return item.expiresOn;
  }

  return getActiveLots(item)[0]?.expiresOn ?? null;
}

function isExpiringSoon(item: SupplyItem) {
  const expiration = getNearestExpiration(item);

  if (!expiration) {
    return false;
  }

  const diffMs =
    new Date(`${expiration}T12:00:00`).getTime() - REFERENCE_DATE.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  return diffDays <= 30;
}

function isLowStock(item: SupplyItem) {
  return getTotalStock(item) <= item.lowStockThreshold;
}

function getAlertLabel(item: SupplyItem) {
  const expiring = isExpiringSoon(item);
  const low = isLowStock(item);

  if (expiring && low) {
    return "Vence en menos de 30 días · Bajo stock";
  }

  if (expiring) {
    return "Vence en menos de 30 días";
  }

  if (low) {
    return "Bajo stock";
  }

  return null;
}

function getExpirationLine(item: SupplyItem) {
  const expiration = getNearestExpiration(item);

  if (!expiration) {
    return "Sin vencimiento cargado";
  }

  return item.requiresLot
    ? `Próximo venc.: ${formatDateLabel(expiration)}`
    : `Vence: ${formatDateLabel(expiration)}`;
}

function getStockLine(item: SupplyItem) {
  const totalStock = getTotalStock(item);

  if (!item.requiresLot) {
    return `Stock: ${totalStock} u · No requiere lote`;
  }

  const lotCount = getActiveLots(item).length;
  const lotLabel = lotCount === 1 ? "1 lote activo" : `${lotCount} lotes activos`;

  return `Stock: ${totalStock} u · ${lotLabel}`;
}

function toggleValueAllowEmpty<T extends string>(current: T[], value: T) {
  if (current.includes(value)) {
    return current.filter((item) => item !== value);
  }

  return [...current, value];
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

function filterSupplies(items: SupplyItem[], search: string, filters: SupplyFilters) {
  const normalizedSearch = normalizeText(search.trim());

  return items.filter((item) => {
    if (filters.alerts.length) {
      const matchesAlert =
        (filters.alerts.includes("expiring") && isExpiringSoon(item)) ||
        (filters.alerts.includes("low_stock") && isLowStock(item));

      if (!matchesAlert) {
        return false;
      }
    }

    const lotKey = item.requiresLot ? "requires_lot" : "no_lot";
    if (!filters.lot.includes(lotKey)) {
      return false;
    }

    const stockKey = getTotalStock(item) > 0 ? "with_stock" : "without_stock";
    if (!filters.stock.includes(stockKey)) {
      return false;
    }

    if (!normalizedSearch) {
      return true;
    }

    return normalizeText(item.name).includes(normalizedSearch);
  });
}

function FilterButtonIcon() {
  return (
    <svg className="supplies-filter-button__icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7h16M7 12h10M10 17h4" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg className="supplies-edit-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 20h4l10.5-10.5-4-4L4 16v4Zm9.5-14.5 4 4" />
    </svg>
  );
}

export default function SuppliesPage() {
  const navigate = useNavigate();
  const [supplies, setSupplies] = useState(suppliesMock);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<SupplyFilters>(DEFAULT_FILTERS);
  const [draftFilters, setDraftFilters] = useState<SupplyFilters>(DEFAULT_FILTERS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isStockOpen, setIsStockOpen] = useState(false);
  const [movementType, setMovementType] = useState<StockMovementType>("increment");
  const [movementQuantity, setMovementQuantity] = useState("1");
  const [movementLotId, setMovementLotId] = useState("");
  const [newLotLabel, setNewLotLabel] = useState("");
  const [newLotExpiry, setNewLotExpiry] = useState("");
  const [movementNote, setMovementNote] = useState("");

  const visibleSupplies = useMemo(() => {
    return filterSupplies(supplies, search, filters);
  }, [filters, search, supplies]);

  useEffect(() => {
    if (!visibleSupplies.length) {
      if (selectedId !== null) {
        setSelectedId(null);
      }
      return;
    }

    if (!selectedId || !visibleSupplies.some((item) => item.id === selectedId)) {
      setSelectedId(visibleSupplies[0].id);
    }
  }, [selectedId, visibleSupplies]);

  const selectedSupply = useMemo(() => {
    if (!visibleSupplies.length) {
      return null;
    }

    return visibleSupplies.find((item) => item.id === selectedId) ?? visibleSupplies[0];
  }, [selectedId, visibleSupplies]);

  const activeLots = useMemo(() => {
    return selectedSupply ? getActiveLots(selectedSupply) : [];
  }, [selectedSupply]);

  function resetMovementForm(item: SupplyItem | null) {
    setMovementType("increment");
    setMovementQuantity("1");
    setMovementNote("");
    setNewLotLabel("");
    setNewLotExpiry("");
    setMovementLotId(item?.requiresLot ? getActiveLots(item)[0]?.id ?? "new" : "");
  }

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

  function openStockModal() {
    resetMovementForm(selectedSupply);
    setIsStockOpen(true);
  }

  const movementQuantityNumber = Number(movementQuantity);
  const selectedLot =
    selectedSupply?.requiresLot && movementLotId !== "new"
      ? activeLots.find((lot) => lot.id === movementLotId) ?? null
      : null;

  const canSubmitMovement = useMemo(() => {
    if (!selectedSupply) {
      return false;
    }

    if (!Number.isFinite(movementQuantityNumber) || movementQuantityNumber <= 0) {
      return false;
    }

    if (movementType === "decrement" && !movementNote.trim()) {
      return false;
    }

    if (!selectedSupply.requiresLot) {
      if (
        movementType === "decrement" &&
        movementQuantityNumber > getTotalStock(selectedSupply)
      ) {
        return false;
      }

      return true;
    }

    if (movementType === "increment") {
      if (movementLotId === "new") {
        return Boolean(newLotLabel.trim() && newLotExpiry);
      }

      return Boolean(selectedLot);
    }

    if (!selectedLot) {
      return false;
    }

    return movementQuantityNumber <= selectedLot.stock;
  }, [
    movementLotId,
    movementNote,
    movementQuantityNumber,
    movementType,
    newLotExpiry,
    newLotLabel,
    selectedLot,
    selectedSupply,
  ]);

  function applyStockMovement() {
    if (!selectedSupply || !canSubmitMovement) {
      return;
    }

    setSupplies((current) =>
      current.map((item) => {
        if (item.id !== selectedSupply.id) {
          return item;
        }

        if (!item.requiresLot) {
          const nextStock =
            movementType === "increment"
              ? item.stockOnHand + movementQuantityNumber
              : item.stockOnHand - movementQuantityNumber;

          return {
            ...item,
            stockOnHand: Math.max(0, nextStock),
          };
        }

        if (movementType === "increment" && movementLotId === "new") {
          return {
            ...item,
            lots: sortLots([
              ...item.lots,
              {
                id: `lot-${Math.random().toString(36).slice(2, 9)}`,
                label: newLotLabel.trim(),
                expiresOn: newLotExpiry,
                stock: movementQuantityNumber,
              },
            ]),
          };
        }

        return {
          ...item,
          lots: sortLots(
            item.lots
              .map((lot) => {
                if (lot.id !== movementLotId) {
                  return lot;
                }

                const nextStock =
                  movementType === "increment"
                    ? lot.stock + movementQuantityNumber
                    : lot.stock - movementQuantityNumber;

                return {
                  ...lot,
                  stock: Math.max(0, nextStock),
                };
              })
              .filter((lot) => lot.stock > 0)
          ),
        };
      })
    );

    setIsStockOpen(false);
  }

  return (
    <main className="supplies-screen">
      <div className="supplies-safe-top" />

      <section className="supplies-content">
        <header className="supplies-topbar">
          <button
            type="button"
            className="supplies-icon-button"
            aria-label="Volver"
            onClick={() => navigate("/mas")}
          >
            ‹
          </button>

          <button
            type="button"
            className="supplies-icon-button"
            aria-label="Nuevo insumo"
            onClick={() => navigate("/insumos/nuevo")}
          >
            +
          </button>
        </header>

        <section className="supplies-center-card" aria-label="Centro actual">
          <span className="supplies-center-card__label">Centro actual</span>
          <p className="supplies-center-card__value">{activeSupplyCenterName}</p>
        </section>

        <section className="supplies-filters-card">
          <div className="supplies-search-row">
            <div className="supplies-search">
              <span className="supplies-search__icon" aria-hidden="true">
                ⌕
              </span>
              <input
                type="search"
                className="supplies-search__input"
                placeholder="Buscar insumo"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            <button
              type="button"
              className="supplies-filter-button"
              aria-label="Abrir filtros"
              onClick={openFilters}
            >
              <FilterButtonIcon />
            </button>
          </div>
        </section>

        <section className="supplies-list-card">
          <div className="supplies-list-card__head">
            <h2 className="supplies-section-title">Insumos</h2>
            <span className="supplies-list-card__count">{visibleSupplies.length}</span>
          </div>

          <div className="supplies-list-scroll">
            {visibleSupplies.length ? (
              <div className="supplies-list">
                {visibleSupplies.map((item) => {
                  const isSelected = item.id === selectedSupply?.id;
                  const expiring = isExpiringSoon(item);
                  const low = isLowStock(item);
                  const alertLabel = getAlertLabel(item);

                  return (
                    <article
                      key={item.id}
                      className={`supplies-row ${
                        expiring ? "supplies-row--expiring" : low ? "supplies-row--low" : ""
                      } ${
                        isSelected ? "supplies-row--selected" : ""
                      }`.trim()}
                    >
                      <button
                        type="button"
                        className="supplies-row__select"
                        aria-pressed={isSelected}
                        onClick={() => setSelectedId(item.id)}
                      >
                        <span className="supplies-row__copy">
                          <span className="supplies-row__name">{item.name}</span>
                          <span className="supplies-row__meta">
                            {getExpirationLine(item)}
                          </span>
                          <span className="supplies-row__meta">
                            {getStockLine(item)}
                          </span>
                          {alertLabel ? (
                            <span className="supplies-row__alert">{alertLabel}</span>
                          ) : null}
                        </span>
                      </button>

                      <button
                        type="button"
                        className="supplies-row__action"
                        aria-label={`Editar ${item.name}`}
                        onClick={() => navigate(`/insumos/${item.id}/editar`)}
                      >
                        <EditIcon />
                        <span className="supplies-row__action-label">Editar</span>
                      </button>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="supplies-empty-state">
                <p className="supplies-empty-state__title">No se encontraron insumos</p>
                <p className="supplies-empty-state__copy">
                  Probá con otro filtro o buscá por otro nombre.
                </p>
              </div>
            )}
          </div>
        </section>

        <article className="supplies-summary-card">
          <div className="supplies-summary-card__inner">
            <div className="supplies-summary-actions">
              <button
                type="button"
                className="supplies-btn supplies-btn--secondary"
                onClick={openStockModal}
                disabled={!selectedSupply}
              >
                Stock
              </button>

              <button
                type="button"
                className="supplies-btn supplies-btn--primary"
                onClick={() =>
                  selectedSupply
                    ? navigate(`/insumos/${selectedSupply.id}/traslado`)
                    : null
                }
                disabled={!selectedSupply}
              >
                Trasladar
              </button>
            </div>
          </div>
        </article>
      </section>

      {isFiltersOpen ? (
        <div className="supplies-modal-backdrop" role="presentation">
          <div
            className="supplies-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="supplies-filters-title"
          >
            <div className="supplies-modal__header">
              <div>
                <h2 id="supplies-filters-title" className="supplies-modal__title">
                  Filtros
                </h2>
                <p className="supplies-modal__description">
                  Ajustá la lista sin cargar la pantalla principal.
                </p>
              </div>

              <button
                type="button"
                className="supplies-modal__close"
                aria-label="Cerrar"
                onClick={() => setIsFiltersOpen(false)}
              >
                ×
              </button>
            </div>

            <div className="supplies-modal__section">
              <p className="supplies-modal__label">Alertas</p>
              <div className="supplies-modal__stack">
                {[
                  { label: "Próximo vencimiento", value: "expiring" as const },
                  { label: "Bajo stock", value: "low_stock" as const },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`supplies-modal-option ${
                      draftFilters.alerts.includes(option.value)
                        ? "supplies-modal-option--active"
                        : ""
                    }`.trim()}
                    onClick={() =>
                      setDraftFilters((current) => ({
                        ...current,
                        alerts: toggleValueAllowEmpty(current.alerts, option.value),
                      }))
                    }
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="supplies-modal__section">
              <p className="supplies-modal__label">Lote</p>
              <div className="supplies-modal__stack">
                {[
                  { label: "Requiere lote", value: "requires_lot" as const },
                  { label: "No requiere lote", value: "no_lot" as const },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`supplies-modal-option ${
                      draftFilters.lot.includes(option.value)
                        ? "supplies-modal-option--active"
                        : ""
                    }`.trim()}
                    onClick={() =>
                      setDraftFilters((current) => ({
                        ...current,
                        lot: toggleValueKeepOne(current.lot, option.value),
                      }))
                    }
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="supplies-modal__section">
              <p className="supplies-modal__label">Stock</p>
              <div className="supplies-modal__stack">
                {[
                  { label: "Con stock", value: "with_stock" as const },
                  { label: "Sin stock", value: "without_stock" as const },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`supplies-modal-option ${
                      draftFilters.stock.includes(option.value)
                        ? "supplies-modal-option--active"
                        : ""
                    }`.trim()}
                    onClick={() =>
                      setDraftFilters((current) => ({
                        ...current,
                        stock: toggleValueKeepOne(current.stock, option.value),
                      }))
                    }
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="supplies-modal__actions">
              <button
                type="button"
                className="supplies-btn supplies-btn--ghost"
                onClick={clearDraftFilters}
              >
                Limpiar filtros
              </button>

              <button
                type="button"
                className="supplies-btn supplies-btn--primary"
                onClick={applyFilters}
              >
                Aplicar
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {isStockOpen && selectedSupply ? (
        <div className="supplies-modal-backdrop" role="presentation">
          <div
            className="supplies-stock-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="supplies-stock-title"
          >
            <div className="supplies-modal__header">
              <div>
                <h2 id="supplies-stock-title" className="supplies-modal__title">
                  {selectedSupply.name}
                </h2>
                <p className="supplies-modal__description">
                  {activeSupplyCenterName} · Stock actual: {getTotalStock(selectedSupply)} u
                </p>
              </div>

              <button
                type="button"
                className="supplies-modal__close"
                aria-label="Cerrar"
                onClick={() => setIsStockOpen(false)}
              >
                ×
              </button>
            </div>

            <section className="supplies-stock-summary">
              <div className="supplies-stock-summary__card">
                <span className="supplies-stock-summary__label">Resumen</span>
                <p className="supplies-stock-summary__value">
                  {getStockLine(selectedSupply)}
                </p>
                <p className="supplies-stock-summary__meta">
                  {getExpirationLine(selectedSupply)}
                </p>
              </div>
            </section>

            {selectedSupply.requiresLot ? (
              <section className="supplies-stock-section">
                <p className="supplies-stock-section__title">Lotes activos</p>
                <div className="supplies-lot-list">
                  {activeLots.map((lot) => (
                    <article key={lot.id} className="supplies-lot-row">
                      <p className="supplies-lot-row__title">{lot.label}</p>
                      <p className="supplies-lot-row__meta">
                        Vence: {formatDateLabel(lot.expiresOn)}
                      </p>
                      <p className="supplies-lot-row__meta">Stock: {lot.stock} u</p>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}

            <section className="supplies-stock-section">
              <p className="supplies-stock-section__title">Movimiento manual</p>

              <div className="supplies-segmented">
                {[
                  { label: "Incrementar", value: "increment" as const },
                  { label: "Disminuir", value: "decrement" as const },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`supplies-segmented__button ${
                      movementType === option.value
                        ? "supplies-segmented__button--active"
                        : ""
                    }`.trim()}
                    onClick={() => {
                      setMovementType(option.value);
                      if (
                        option.value === "decrement" &&
                        selectedSupply.requiresLot &&
                        movementLotId === "new"
                      ) {
                        setMovementLotId(activeLots[0]?.id ?? "");
                      }
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              <div className="supplies-stock-form">
                <label className="supplies-field">
                  <span className="supplies-field__label">Cantidad</span>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    className="supplies-field__input"
                    value={movementQuantity}
                    onChange={(event) => setMovementQuantity(event.target.value)}
                  />
                </label>

                {selectedSupply.requiresLot ? (
                  <label className="supplies-field">
                    <span className="supplies-field__label">Lote</span>
                    <select
                      className="supplies-field__input"
                      value={movementLotId}
                      onChange={(event) => setMovementLotId(event.target.value)}
                    >
                      {movementType === "increment" ? (
                        <option value="new">Nuevo lote</option>
                      ) : null}
                      {activeLots.map((lot) => (
                        <option key={lot.id} value={lot.id}>
                          {lot.label}
                        </option>
                      ))}
                    </select>
                  </label>
                ) : null}

                {selectedSupply.requiresLot &&
                movementType === "increment" &&
                movementLotId === "new" ? (
                  <>
                    <label className="supplies-field">
                      <span className="supplies-field__label">Nombre de lote</span>
                      <input
                        type="text"
                        className="supplies-field__input"
                        value={newLotLabel}
                        onChange={(event) => setNewLotLabel(event.target.value)}
                      />
                    </label>

                    <label className="supplies-field">
                      <span className="supplies-field__label">Vencimiento</span>
                      <input
                        type="date"
                        className="supplies-field__input"
                        value={newLotExpiry}
                        onChange={(event) => setNewLotExpiry(event.target.value)}
                      />
                    </label>
                  </>
                ) : null}

                <label className="supplies-field supplies-field--full">
                  <span className="supplies-field__label">
                    Nota {movementType === "decrement" ? "(obligatoria)" : "(opcional)"}
                  </span>
                  <textarea
                    className="supplies-field__textarea"
                    rows={3}
                    value={movementNote}
                    onChange={(event) => setMovementNote(event.target.value)}
                  />
                </label>
              </div>
            </section>

            <div className="supplies-modal__actions">
              <button
                type="button"
                className="supplies-btn supplies-btn--ghost"
                onClick={() => setIsStockOpen(false)}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="supplies-btn supplies-btn--primary"
                disabled={!canSubmitMovement}
                onClick={applyStockMovement}
              >
                Guardar movimiento
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <style>{`
        .supplies-screen {
          min-height: calc(100dvh - 92px - env(safe-area-inset-bottom, 0px));
          height: calc(100dvh - 92px - env(safe-area-inset-bottom, 0px));
          background:
            radial-gradient(circle at top left, rgba(84, 140, 190, 0.15), transparent 34%),
            linear-gradient(180deg, #f7fbff 0%, #eef4fb 100%);
          overflow: hidden;
        }

        .supplies-safe-top {
          height: env(safe-area-inset-top, 0px);
          min-height: 8px;
        }

        .supplies-content {
          height: calc(100% - env(safe-area-inset-top, 0px));
          padding: 12px 16px 16px;
          display: grid;
          grid-template-rows: auto auto auto minmax(0, 1fr) auto;
          gap: 12px;
          overflow: hidden;
        }

        @media (min-width: 390px) {
          .supplies-content {
            padding-left: 20px;
            padding-right: 20px;
          }
        }

        .supplies-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 2px;
        }

        .supplies-icon-button {
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

        .supplies-center-card,
        .supplies-filters-card,
        .supplies-list-card,
        .supplies-summary-card,
        .supplies-modal,
        .supplies-stock-modal {
          border: 1px solid #dce7f3;
          background: rgba(255, 255, 255, 0.92);
          box-shadow: 0 12px 28px rgba(48, 90, 138, 0.08);
        }

        .supplies-center-card {
          border-radius: 20px;
          padding: 14px 16px;
          display: grid;
          gap: 4px;
          justify-items: center;
          text-align: center;
        }

        .supplies-center-card__label,
        .supplies-modal__label,
        .supplies-field__label,
        .supplies-stock-summary__label {
          color: #53708f;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .supplies-center-card__value {
          margin: 0;
          color: #163252;
          font-size: 19px;
          line-height: 1.2;
          font-weight: 800;
          letter-spacing: -0.02em;
        }

        .supplies-filters-card {
          border-radius: 22px;
          padding: 12px;
        }

        .supplies-search-row {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 52px;
          gap: 10px;
        }

        .supplies-search {
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

        .supplies-search__icon {
          color: #68819d;
          font-size: 18px;
          line-height: 1;
          flex-shrink: 0;
        }

        .supplies-search__input {
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

        .supplies-search__input::placeholder {
          color: #8194aa;
          opacity: 1;
        }

        .supplies-filter-button {
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

        .supplies-filter-button__icon,
        .supplies-edit-icon {
          width: 22px;
          height: 22px;
          stroke: currentColor;
          stroke-width: 2;
          fill: none;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .supplies-list-card {
          min-height: 0;
          border-radius: 28px;
          padding: 16px;
          display: grid;
          grid-template-rows: auto minmax(0, 1fr);
          gap: 14px;
          overflow: hidden;
        }

        .supplies-list-card__head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .supplies-section-title {
          margin: 0;
          color: #163252;
          font-size: 22px;
          line-height: 1.1;
          font-weight: 800;
          letter-spacing: -0.03em;
        }

        .supplies-list-card__count {
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

        .supplies-list-scroll {
          min-height: 0;
          overflow-y: auto;
        }

        .supplies-list {
          display: grid;
          gap: 10px;
        }

        .supplies-row {
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

        .supplies-row--selected {
          border-color: #8cb3d9;
          box-shadow: 0 12px 24px rgba(45, 95, 147, 0.11);
        }

        .supplies-row--expiring {
          border-color: rgba(212, 124, 124, 0.4);
          background: linear-gradient(180deg, #fff5f5 0%, #fdeaea 100%);
        }

        .supplies-row--low {
          border-color: rgba(126, 103, 197, 0.34);
          background: linear-gradient(180deg, #f6f2ff 0%, #eee8ff 100%);
        }

        .supplies-row__select {
          min-width: 0;
          border: 0;
          background: transparent;
          padding: 0;
          text-align: left;
          cursor: pointer;
        }

        .supplies-row__copy {
          min-width: 0;
          display: grid;
          gap: 4px;
        }

        .supplies-row__name {
          color: #163252;
          font-size: 16px;
          line-height: 1.18;
          font-weight: 800;
          letter-spacing: -0.02em;
        }

        .supplies-row__meta {
          color: #5e7793;
          font-size: 13px;
          line-height: 1.24;
          font-weight: 700;
        }

        .supplies-row__alert {
          color: #b64d4d;
          font-size: 13px;
          line-height: 1.22;
          font-weight: 800;
        }

        .supplies-row--low .supplies-row__alert {
          color: #6950bd;
        }

        .supplies-row__action {
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

        .supplies-row__action-label {
          font-size: 12px;
          line-height: 1;
          font-weight: 800;
        }

        .supplies-empty-state {
          border: 1px dashed #ccdced;
          border-radius: 20px;
          background: #f7fbff;
          padding: 18px 16px;
          text-align: center;
        }

        .supplies-empty-state__title {
          margin: 0;
          color: #163252;
          font-size: 16px;
          line-height: 1.2;
          font-weight: 800;
        }

        .supplies-empty-state__copy {
          margin: 6px 0 0;
          color: #627791;
          font-size: 14px;
          line-height: 1.35;
          font-weight: 600;
        }

        .supplies-summary-card {
          border-radius: 28px;
          overflow: hidden;
        }

        .supplies-summary-card__inner {
          padding: 14px;
        }

        .supplies-summary-actions,
        .supplies-modal__actions {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        .supplies-btn {
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

        .supplies-btn--primary {
          background: linear-gradient(180deg, #1f5d95 0%, #184d7d 100%);
          color: #ffffff;
          box-shadow: 0 12px 24px rgba(24, 77, 125, 0.18);
        }

        .supplies-btn--secondary {
          background: rgba(31, 93, 149, 0.1);
          color: #174973;
        }

        .supplies-btn--ghost {
          background: transparent;
          color: #58728f;
          border: 1px solid #dbe7f2;
        }

        .supplies-btn:disabled {
          opacity: 0.45;
          cursor: not-allowed;
          box-shadow: none;
        }

        .supplies-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(17, 31, 47, 0.42);
          display: grid;
          align-items: end;
          padding: 18px 16px calc(110px + env(safe-area-inset-bottom, 0px));
          z-index: 30;
        }

        .supplies-modal,
        .supplies-stock-modal {
          width: min(100%, 460px);
          justify-self: center;
          border-radius: 28px;
          padding: 18px;
          display: grid;
          gap: 16px;
        }

        .supplies-stock-modal {
          max-height: min(78dvh, 760px);
          overflow-y: auto;
        }

        .supplies-modal__header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }

        .supplies-modal__title {
          margin: 0;
          color: #163252;
          font-size: 22px;
          line-height: 1.1;
          font-weight: 800;
          letter-spacing: -0.03em;
        }

        .supplies-modal__description {
          margin: 6px 0 0;
          color: #617893;
          font-size: 14px;
          line-height: 1.35;
          font-weight: 600;
        }

        .supplies-modal__close {
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

        .supplies-modal__section,
        .supplies-stock-section {
          display: grid;
          gap: 10px;
        }

        .supplies-modal__stack {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        .supplies-modal-option,
        .supplies-segmented__button {
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

        .supplies-modal-option--active,
        .supplies-segmented__button--active {
          border-color: #1f5d95;
          background: rgba(31, 93, 149, 0.1);
          color: #174973;
        }

        .supplies-stock-summary__card {
          border: 1px solid #dce7f3;
          border-radius: 20px;
          background: #f8fbff;
          padding: 14px;
          display: grid;
          gap: 4px;
        }

        .supplies-stock-summary__value,
        .supplies-lot-row__title {
          margin: 0;
          color: #163252;
          font-size: 16px;
          line-height: 1.2;
          font-weight: 800;
        }

        .supplies-stock-summary__meta,
        .supplies-lot-row__meta,
        .supplies-stock-section__title {
          margin: 0;
          color: #5e7793;
          font-size: 13px;
          line-height: 1.28;
          font-weight: 700;
        }

        .supplies-lot-list {
          display: grid;
          gap: 10px;
        }

        .supplies-lot-row {
          border: 1px solid #dce7f3;
          border-radius: 18px;
          background: #f8fbff;
          padding: 14px;
          display: grid;
          gap: 4px;
        }

        .supplies-segmented {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        .supplies-stock-form {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        .supplies-field {
          display: grid;
          gap: 8px;
        }

        .supplies-field--full {
          grid-column: 1 / -1;
        }

        .supplies-field__input,
        .supplies-field__textarea {
          width: 100%;
          min-width: 0;
          border: 1px solid #d8e4f0;
          border-radius: 16px;
          background: #f7fbff;
          color: #163252;
          padding: 13px 14px;
          font-size: 15px;
          font-weight: 700;
          font-family: inherit;
        }

        .supplies-field__textarea {
          resize: vertical;
          min-height: 88px;
        }

        @media (max-height: 700px) {
          .supplies-content {
            padding-top: 8px;
            gap: 10px;
          }

          .supplies-center-card,
          .supplies-filters-card,
          .supplies-summary-card__inner,
          .supplies-list-card,
          .supplies-modal,
          .supplies-stock-modal {
            padding-top: 12px;
            padding-bottom: 12px;
          }

          .supplies-center-card__value,
          .supplies-modal__title {
            font-size: 18px;
          }

          .supplies-section-title {
            font-size: 19px;
          }

          .supplies-search,
          .supplies-filter-button,
          .supplies-btn,
          .supplies-modal-option,
          .supplies-segmented__button {
            min-height: 44px;
          }

          .supplies-row {
            padding-top: 12px;
            padding-bottom: 12px;
          }

          .supplies-row__name,
          .supplies-stock-summary__value,
          .supplies-lot-row__title {
            font-size: 15px;
          }

          .supplies-row__meta,
          .supplies-row__alert,
          .supplies-empty-state__copy,
          .supplies-stock-summary__meta,
          .supplies-lot-row__meta,
          .supplies-stock-section__title,
          .supplies-modal__description {
            font-size: 13px;
          }

          .supplies-field__input,
          .supplies-field__textarea {
            padding-top: 12px;
            padding-bottom: 12px;
            font-size: 14px;
          }
        }
      `}</style>
    </main>
  );
}
