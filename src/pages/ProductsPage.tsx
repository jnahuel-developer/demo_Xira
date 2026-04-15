import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  activeProductCenterName,
  productsMock,
  type ProductItem,
} from "../mocks/products.mock";

type AlertFilter = "expiring" | "low_stock";
type PhotoFilter = "with_photo" | "without_photo";
type StockFilter = "with_stock" | "without_stock";
type StockMovementType = "increment" | "decrement";

type ProductFilters = {
  alerts: AlertFilter[];
  photo: PhotoFilter[];
  stock: StockFilter[];
};

const DEFAULT_FILTERS: ProductFilters = {
  alerts: [],
  photo: ["with_photo", "without_photo"],
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

function isExpiringSoon(item: ProductItem) {
  const diffMs =
    new Date(`${item.expiresOn}T12:00:00`).getTime() - REFERENCE_DATE.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  return diffDays <= 30;
}

function isLowStock(item: ProductItem) {
  return item.stockOnHand <= item.lowStockThreshold;
}

function getAlertLabel(item: ProductItem) {
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

function filterProducts(items: ProductItem[], search: string, filters: ProductFilters) {
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

    const photoKey = item.photoUrl ? "with_photo" : "without_photo";
    if (!filters.photo.includes(photoKey)) {
      return false;
    }

    const stockKey = item.stockOnHand > 0 ? "with_stock" : "without_stock";
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
    <svg className="products-filter-button__icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7h16M7 12h10M10 17h4" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg className="products-edit-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 20h4l10.5-10.5-4-4L4 16v4Zm9.5-14.5 4 4" />
    </svg>
  );
}

export default function ProductsPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState(productsMock);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<ProductFilters>(DEFAULT_FILTERS);
  const [draftFilters, setDraftFilters] = useState<ProductFilters>(DEFAULT_FILTERS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isStockOpen, setIsStockOpen] = useState(false);
  const [movementType, setMovementType] = useState<StockMovementType>("increment");
  const [movementQuantity, setMovementQuantity] = useState("1");
  const [movementNote, setMovementNote] = useState("");

  const visibleProducts = useMemo(() => {
    return filterProducts(products, search, filters);
  }, [filters, products, search]);

  useEffect(() => {
    if (!visibleProducts.length) {
      if (selectedId !== null) {
        setSelectedId(null);
      }
      return;
    }

    if (!selectedId || !visibleProducts.some((item) => item.id === selectedId)) {
      setSelectedId(visibleProducts[0].id);
    }
  }, [selectedId, visibleProducts]);

  const selectedProduct = useMemo(() => {
    if (!visibleProducts.length) {
      return null;
    }

    return visibleProducts.find((item) => item.id === selectedId) ?? visibleProducts[0];
  }, [selectedId, visibleProducts]);

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
    setMovementType("increment");
    setMovementQuantity("1");
    setMovementNote("");
    setIsStockOpen(true);
  }

  const movementQuantityNumber = Number(movementQuantity);
  const canSubmitMovement = useMemo(() => {
    if (!selectedProduct) {
      return false;
    }

    if (!Number.isFinite(movementQuantityNumber) || movementQuantityNumber <= 0) {
      return false;
    }

    if (movementType === "decrement") {
      if (!movementNote.trim()) {
        return false;
      }

      if (movementQuantityNumber > selectedProduct.stockOnHand) {
        return false;
      }
    }

    return true;
  }, [movementNote, movementQuantityNumber, movementType, selectedProduct]);

  function applyStockMovement() {
    if (!selectedProduct || !canSubmitMovement) {
      return;
    }

    setProducts((current) =>
      current.map((item) => {
        if (item.id !== selectedProduct.id) {
          return item;
        }

        const nextStock =
          movementType === "increment"
            ? item.stockOnHand + movementQuantityNumber
            : item.stockOnHand - movementQuantityNumber;

        return {
          ...item,
          stockOnHand: Math.max(0, nextStock),
        };
      })
    );

    setIsStockOpen(false);
  }

  return (
    <main className="products-screen">
      <div className="products-safe-top" />

      <section className="products-content">
        <header className="products-topbar">
          <button
            type="button"
            className="products-icon-button"
            aria-label="Volver"
            onClick={() => navigate(-1)}
          >
            ‹
          </button>

          <button
            type="button"
            className="products-icon-button"
            aria-label="Nuevo producto"
            onClick={() => navigate("/productos/nuevo")}
          >
            +
          </button>
        </header>

        <section className="products-center-card" aria-label="Centro actual">
          <span className="products-center-card__label">Centro actual</span>
          <p className="products-center-card__value">{activeProductCenterName}</p>
        </section>

        <section className="products-filters-card">
          <div className="products-search-row">
            <div className="products-search">
              <span className="products-search__icon" aria-hidden="true">
                ⌕
              </span>
              <input
                type="search"
                className="products-search__input"
                placeholder="Buscar producto"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            <button
              type="button"
              className="products-filter-button"
              aria-label="Abrir filtros"
              onClick={openFilters}
            >
              <FilterButtonIcon />
            </button>
          </div>
        </section>

        <section className="products-list-card">
          <div className="products-list-card__head">
            <h2 className="products-section-title">Productos</h2>
            <span className="products-list-card__count">{visibleProducts.length}</span>
          </div>

          <div className="products-list-scroll">
            {visibleProducts.length ? (
              <div className="products-list">
                {visibleProducts.map((item) => {
                  const isSelected = item.id === selectedProduct?.id;
                  const expiring = isExpiringSoon(item);
                  const low = isLowStock(item);
                  const alertLabel = getAlertLabel(item);

                  return (
                    <article
                      key={item.id}
                      className={`products-row ${
                        expiring ? "products-row--expiring" : low ? "products-row--low" : ""
                      } ${
                        isSelected ? "products-row--selected" : ""
                      }`.trim()}
                    >
                      <button
                        type="button"
                        className="products-row__select"
                        aria-pressed={isSelected}
                        onClick={() => setSelectedId(item.id)}
                      >
                        <span className="products-row__thumb">
                          {item.photoUrl ? (
                            <img
                              className="products-row__thumb-image"
                              src={item.photoUrl}
                              alt=""
                              aria-hidden="true"
                            />
                          ) : (
                            <span className="products-row__thumb-placeholder">Sin foto</span>
                          )}
                        </span>

                        <span className="products-row__copy">
                          <span className="products-row__name">{item.name}</span>
                          <span className="products-row__meta">
                            Stock: {item.stockOnHand} u
                          </span>
                          <span className="products-row__meta">
                            Vence: {formatDateLabel(item.expiresOn)}
                          </span>
                          {alertLabel ? (
                            <span className="products-row__alert">{alertLabel}</span>
                          ) : null}
                        </span>
                      </button>

                      <button
                        type="button"
                        className="products-row__action"
                        aria-label={`Editar ${item.name}`}
                        onClick={() => navigate(`/productos/${item.id}/editar`)}
                      >
                        <EditIcon />
                        <span className="products-row__action-label">Editar</span>
                      </button>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="products-empty-state">
                <p className="products-empty-state__title">No se encontraron productos</p>
                <p className="products-empty-state__copy">
                  Probá con otro filtro o buscá por otro nombre.
                </p>
              </div>
            )}
          </div>
        </section>

        <article className="products-summary-card">
          <div className="products-summary-card__inner">
            <div className="products-summary-actions">
              <button
                type="button"
                className="products-btn products-btn--secondary"
                onClick={openStockModal}
                disabled={!selectedProduct}
              >
                Stock
              </button>

              <button
                type="button"
                className="products-btn products-btn--primary"
                onClick={() =>
                  selectedProduct
                    ? navigate(`/productos/${selectedProduct.id}/traslado`)
                    : null
                }
                disabled={!selectedProduct}
              >
                Trasladar
              </button>
            </div>
          </div>
        </article>
      </section>

      {isFiltersOpen ? (
        <div className="products-modal-backdrop" role="presentation">
          <div
            className="products-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="products-filters-title"
          >
            <div className="products-modal__header">
              <div>
                <h2 id="products-filters-title" className="products-modal__title">
                  Filtros
                </h2>
                <p className="products-modal__description">
                  Ajustá la lista sin cargar la pantalla principal.
                </p>
              </div>

              <button
                type="button"
                className="products-modal__close"
                aria-label="Cerrar"
                onClick={() => setIsFiltersOpen(false)}
              >
                ×
              </button>
            </div>

            <div className="products-modal__section">
              <p className="products-modal__label">Alertas</p>
              <div className="products-modal__stack">
                {[
                  { label: "Próximo vencimiento", value: "expiring" as const },
                  { label: "Bajo stock", value: "low_stock" as const },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`products-modal-option ${
                      draftFilters.alerts.includes(option.value)
                        ? "products-modal-option--active"
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

            <div className="products-modal__section">
              <p className="products-modal__label">Foto</p>
              <div className="products-modal__stack">
                {[
                  { label: "Con foto", value: "with_photo" as const },
                  { label: "Sin foto", value: "without_photo" as const },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`products-modal-option ${
                      draftFilters.photo.includes(option.value)
                        ? "products-modal-option--active"
                        : ""
                    }`.trim()}
                    onClick={() =>
                      setDraftFilters((current) => ({
                        ...current,
                        photo: toggleValueKeepOne(current.photo, option.value),
                      }))
                    }
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="products-modal__section">
              <p className="products-modal__label">Stock</p>
              <div className="products-modal__stack">
                {[
                  { label: "Con stock", value: "with_stock" as const },
                  { label: "Sin stock", value: "without_stock" as const },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`products-modal-option ${
                      draftFilters.stock.includes(option.value)
                        ? "products-modal-option--active"
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

            <div className="products-modal__actions">
              <button
                type="button"
                className="products-btn products-btn--ghost"
                onClick={clearDraftFilters}
              >
                Limpiar filtros
              </button>

              <button
                type="button"
                className="products-btn products-btn--primary"
                onClick={applyFilters}
              >
                Aplicar
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {isStockOpen && selectedProduct ? (
        <div className="products-modal-backdrop" role="presentation">
          <div
            className="products-stock-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="products-stock-title"
          >
            <div className="products-modal__header">
              <div>
                <h2 id="products-stock-title" className="products-modal__title">
                  {selectedProduct.name}
                </h2>
                <p className="products-modal__description">
                  {activeProductCenterName} · Stock actual: {selectedProduct.stockOnHand} u
                </p>
              </div>

              <button
                type="button"
                className="products-modal__close"
                aria-label="Cerrar"
                onClick={() => setIsStockOpen(false)}
              >
                ×
              </button>
            </div>

            <div className="products-stock-summary">
              <div className="products-stock-summary__card">
                <span className="products-stock-summary__label">Resumen</span>
                <p className="products-stock-summary__value">
                  Stock actual: {selectedProduct.stockOnHand} u
                </p>
                <p className="products-stock-summary__meta">
                  Vence: {formatDateLabel(selectedProduct.expiresOn)}
                </p>
              </div>
            </div>

            <section className="products-stock-section">
              <p className="products-stock-section__title">Movimiento manual</p>

              <div className="products-segmented">
                {[
                  { label: "Incrementar", value: "increment" as const },
                  { label: "Disminuir", value: "decrement" as const },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`products-segmented__button ${
                      movementType === option.value
                        ? "products-segmented__button--active"
                        : ""
                    }`.trim()}
                    onClick={() => setMovementType(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              <div className="products-stock-form">
                <label className="products-field">
                  <span className="products-field__label">Cantidad</span>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    className="products-field__input"
                    value={movementQuantity}
                    onChange={(event) => setMovementQuantity(event.target.value)}
                  />
                </label>

                <label className="products-field products-field--full">
                  <span className="products-field__label">
                    Nota {movementType === "decrement" ? "(obligatoria)" : "(opcional)"}
                  </span>
                  <textarea
                    className="products-field__textarea"
                    rows={3}
                    value={movementNote}
                    onChange={(event) => setMovementNote(event.target.value)}
                  />
                </label>
              </div>
            </section>

            <div className="products-modal__actions">
              <button
                type="button"
                className="products-btn products-btn--ghost"
                onClick={() => setIsStockOpen(false)}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="products-btn products-btn--primary"
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
        .products-screen {
          min-height: calc(100dvh - 92px - env(safe-area-inset-bottom, 0px));
          height: calc(100dvh - 92px - env(safe-area-inset-bottom, 0px));
          background:
            radial-gradient(circle at top left, rgba(84, 140, 190, 0.15), transparent 34%),
            linear-gradient(180deg, #f7fbff 0%, #eef4fb 100%);
          overflow: hidden;
        }

        .products-safe-top {
          height: env(safe-area-inset-top, 0px);
          min-height: 8px;
        }

        .products-content {
          height: calc(100% - env(safe-area-inset-top, 0px));
          padding: 12px 16px 16px;
          display: grid;
          grid-template-rows: auto auto auto minmax(0, 1fr) auto;
          gap: 12px;
          overflow: hidden;
        }

        @media (min-width: 390px) {
          .products-content {
            padding-left: 20px;
            padding-right: 20px;
          }
        }

        .products-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 2px;
        }

        .products-icon-button {
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

        .products-center-card,
        .products-filters-card,
        .products-list-card,
        .products-summary-card,
        .products-modal,
        .products-stock-modal {
          border: 1px solid #dce7f3;
          background: rgba(255, 255, 255, 0.92);
          box-shadow: 0 12px 28px rgba(48, 90, 138, 0.08);
        }

        .products-center-card {
          border-radius: 20px;
          padding: 14px 16px;
          display: grid;
          gap: 4px;
          justify-items: center;
          text-align: center;
        }

        .products-center-card__label,
        .products-modal__label,
        .products-field__label,
        .products-stock-summary__label {
          color: #53708f;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .products-center-card__value {
          margin: 0;
          color: #163252;
          font-size: 19px;
          line-height: 1.2;
          font-weight: 800;
          letter-spacing: -0.02em;
        }

        .products-filters-card {
          border-radius: 22px;
          padding: 12px;
        }

        .products-search-row {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 52px;
          gap: 10px;
        }

        .products-search {
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

        .products-search__icon {
          color: #68819d;
          font-size: 18px;
          line-height: 1;
          flex-shrink: 0;
        }

        .products-search__input {
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

        .products-search__input::placeholder {
          color: #8194aa;
          opacity: 1;
        }

        .products-filter-button {
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

        .products-filter-button__icon,
        .products-edit-icon {
          width: 22px;
          height: 22px;
          stroke: currentColor;
          stroke-width: 2;
          fill: none;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .products-list-card {
          min-height: 0;
          border-radius: 28px;
          padding: 16px;
          display: grid;
          grid-template-rows: auto minmax(0, 1fr);
          gap: 14px;
          overflow: hidden;
        }

        .products-list-card__head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .products-section-title {
          margin: 0;
          color: #163252;
          font-size: 22px;
          line-height: 1.1;
          font-weight: 800;
          letter-spacing: -0.03em;
        }

        .products-list-card__count {
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

        .products-list-scroll {
          min-height: 0;
          overflow-y: auto;
        }

        .products-list {
          display: grid;
          gap: 10px;
        }

        .products-row {
          border: 1px solid #dce7f3;
          border-radius: 20px;
          background: #f9fbfe;
          box-shadow: 0 8px 20px rgba(48, 90, 138, 0.05);
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 12px;
          align-items: center;
          padding: 12px;
        }

        .products-row--selected {
          border-color: #3c6c9e;
          box-shadow: 0 0 0 2px rgba(60, 108, 158, 0.18), 0 12px 24px rgba(45, 95, 147, 0.11);
        }

        .products-row--expiring {
          border-color: rgba(212, 124, 124, 0.4);
          background: linear-gradient(180deg, #fff5f5 0%, #fdeaea 100%);
        }

        .products-row--low {
          border-color: rgba(126, 103, 197, 0.34);
          background: linear-gradient(180deg, #f6f2ff 0%, #eee8ff 100%);
        }

        .products-row__select {
          min-width: 0;
          border: 0;
          background: transparent;
          padding: 0;
          display: grid;
          grid-template-columns: 68px minmax(0, 1fr);
          gap: 12px;
          align-items: center;
          text-align: left;
          cursor: pointer;
        }

        .products-row__thumb {
          width: 68px;
          height: 68px;
          border-radius: 18px;
          overflow: hidden;
          border: 1px solid rgba(220, 231, 243, 0.9);
          background: linear-gradient(180deg, #eff5fb 0%, #e3edf8 100%);
          display: grid;
          place-items: center;
          flex-shrink: 0;
        }

        .products-row__thumb-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .products-row__thumb-placeholder {
          color: #6a829c;
          font-size: 12px;
          line-height: 1.15;
          font-weight: 800;
          text-align: center;
          padding: 0 8px;
        }

        .products-row__copy {
          min-width: 0;
          display: grid;
          gap: 4px;
        }

        .products-row__name {
          color: #163252;
          font-size: 16px;
          line-height: 1.18;
          font-weight: 800;
          letter-spacing: -0.02em;
        }

        .products-row__meta {
          color: #5e7793;
          font-size: 13px;
          line-height: 1.24;
          font-weight: 700;
        }

        .products-row__alert {
          color: #b64d4d;
          font-size: 13px;
          line-height: 1.22;
          font-weight: 800;
        }

        .products-row--low .products-row__alert {
          color: #6950bd;
        }

        .products-row__action {
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

        .products-row__action-label {
          font-size: 12px;
          line-height: 1;
          font-weight: 800;
        }

        .products-empty-state {
          border: 1px dashed #ccdced;
          border-radius: 20px;
          background: #f7fbff;
          padding: 18px 16px;
          text-align: center;
        }

        .products-empty-state__title {
          margin: 0;
          color: #163252;
          font-size: 16px;
          line-height: 1.2;
          font-weight: 800;
        }

        .products-empty-state__copy {
          margin: 6px 0 0;
          color: #627791;
          font-size: 14px;
          line-height: 1.35;
          font-weight: 600;
        }

        .products-summary-card {
          border-radius: 28px;
          overflow: hidden;
        }

        .products-summary-card__inner {
          padding: 14px;
        }

        .products-summary-actions,
        .products-modal__actions {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        .products-btn {
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

        .products-btn--primary {
          background: linear-gradient(180deg, #1f5d95 0%, #184d7d 100%);
          color: #ffffff;
          box-shadow: 0 12px 24px rgba(24, 77, 125, 0.18);
        }

        .products-btn--secondary {
          background: rgba(31, 93, 149, 0.1);
          color: #174973;
        }

        .products-btn--ghost {
          background: transparent;
          color: #58728f;
          border: 1px solid #dbe7f2;
        }

        .products-btn:disabled {
          opacity: 0.45;
          cursor: not-allowed;
          box-shadow: none;
        }

        .products-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(17, 31, 47, 0.42);
          display: grid;
          align-items: end;
          padding: 18px 16px calc(110px + env(safe-area-inset-bottom, 0px));
          z-index: 30;
        }

        .products-modal,
        .products-stock-modal {
          width: min(100%, 460px);
          justify-self: center;
          border-radius: 28px;
          padding: 18px;
          display: grid;
          gap: 16px;
        }

        .products-stock-modal {
          max-height: min(72dvh, 640px);
          overflow-y: auto;
        }

        .products-modal__header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }

        .products-modal__title {
          margin: 0;
          color: #163252;
          font-size: 22px;
          line-height: 1.1;
          font-weight: 800;
          letter-spacing: -0.03em;
        }

        .products-modal__description {
          margin: 6px 0 0;
          color: #617893;
          font-size: 14px;
          line-height: 1.35;
          font-weight: 600;
        }

        .products-modal__close {
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

        .products-modal__section,
        .products-stock-section {
          display: grid;
          gap: 10px;
        }

        .products-modal__stack,
        .products-segmented {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        .products-modal-option,
        .products-segmented__button {
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

        .products-modal-option--active,
        .products-segmented__button--active {
          border-color: #1f5d95;
          background: rgba(31, 93, 149, 0.1);
          color: #174973;
        }

        .products-stock-summary__card {
          border: 1px solid #dce7f3;
          border-radius: 20px;
          background: #f8fbff;
          padding: 14px;
          display: grid;
          gap: 4px;
        }

        .products-stock-summary__value,
        .products-stock-section__title {
          margin: 0;
          color: #163252;
          font-size: 16px;
          line-height: 1.2;
          font-weight: 800;
        }

        .products-stock-summary__meta {
          margin: 0;
          color: #5e7793;
          font-size: 13px;
          line-height: 1.28;
          font-weight: 700;
        }

        .products-stock-form {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        .products-field {
          display: grid;
          gap: 8px;
        }

        .products-field--full {
          grid-column: 1 / -1;
        }

        .products-field__input,
        .products-field__textarea {
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

        .products-field__textarea {
          resize: vertical;
          min-height: 88px;
        }

        @media (max-height: 700px) {
          .products-content {
            padding-top: 8px;
            gap: 10px;
          }

          .products-center-card,
          .products-filters-card,
          .products-summary-card__inner,
          .products-list-card,
          .products-modal,
          .products-stock-modal {
            padding-top: 12px;
            padding-bottom: 12px;
          }

          .products-center-card__value,
          .products-modal__title {
            font-size: 18px;
          }

          .products-section-title {
            font-size: 19px;
          }

          .products-search,
          .products-filter-button,
          .products-btn,
          .products-modal-option,
          .products-segmented__button {
            min-height: 44px;
          }

          .products-row {
            padding: 10px;
          }

          .products-row__select {
            grid-template-columns: 60px minmax(0, 1fr);
            gap: 10px;
          }

          .products-row__thumb {
            width: 60px;
            height: 60px;
          }

          .products-row__name,
          .products-stock-summary__value,
          .products-stock-section__title {
            font-size: 15px;
          }

          .products-row__meta,
          .products-row__alert,
          .products-empty-state__copy,
          .products-stock-summary__meta,
          .products-modal__description {
            font-size: 13px;
          }

          .products-field__input,
          .products-field__textarea {
            padding-top: 12px;
            padding-bottom: 12px;
            font-size: 14px;
          }
        }
      `}</style>
    </main>
  );
}
