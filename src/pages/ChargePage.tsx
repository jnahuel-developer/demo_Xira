import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  chargeMockById,
  type ChargePaymentMethod,
  type ChargeProduct,
} from "../mocks/charge.mock";
import { resetTurnFlow } from "../mocks/turnFlow.mock";
import { completeTodayCharge } from "../mocks/today.mock";

const PAYMENT_METHODS: ChargePaymentMethod[] = [
  "Efectivo",
  "Transferencia",
  "Posnet",
];

const formatMoney = (value: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);

const parseDigits = (value: string) => value.replace(/[^\d]/g, "").replace(/^0+(?=\d)/, "");

const parseAmount = (value: string) => Number(parseDigits(value) || 0);

const formatMoneyInput = (value: string) => {
  const numericValue = parseAmount(value);
  return numericValue > 0 ? formatMoney(numericValue) : "";
};

type PaymentLineState = {
  id: string;
  method: ChargePaymentMethod;
  amount: string;
};

type SelectedProduct = ChargeProduct & {
  quantity: number;
};

function ProductSearchModal({
  search,
  onSearchChange,
  products,
  onAddProduct,
  onClose,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  products: ChargeProduct[];
  onAddProduct: (product: ChargeProduct) => void;
  onClose: () => void;
}) {
  return (
    <div className="charge-modal-backdrop" role="presentation">
      <div
        className="charge-product-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="charge-products-title"
      >
        <div className="charge-modal__header">
          <div>
            <h2 id="charge-products-title" className="charge-modal__title">
              Agregar producto
            </h2>
            <p className="charge-modal__description">
              Sumá productos sin salir del cierre del cobro.
            </p>
          </div>

          <button
            type="button"
            className="charge-modal__close"
            aria-label="Cerrar"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="charge-modal-search">
          <span className="charge-modal-search__icon" aria-hidden="true">
            ⌕
          </span>
          <input
            type="search"
            className="charge-modal-search__input"
            placeholder="Buscar producto"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </div>

        <div className="charge-product-catalog">
          {products.length ? (
            products.map((product) => (
              <article key={product.id} className="charge-product-catalog__item">
                <div className="charge-product-catalog__copy">
                  <p className="charge-product-catalog__name">{product.name}</p>
                  <p className="charge-product-catalog__price">
                    {formatMoney(product.price)}
                  </p>
                </div>

                <button
                  type="button"
                  className="charge-catalog-action"
                  onClick={() => onAddProduct(product)}
                >
                  Agregar
                </button>
              </article>
            ))
          ) : (
            <div className="charge-empty-state charge-empty-state--modal">
              <p className="charge-empty-state__title">No hay productos para agregar</p>
              <p className="charge-empty-state__copy">
                Probá con otra búsqueda o revisá los productos ya sumados.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ChargePage() {
  const navigate = useNavigate();
  const params = useParams();
  const turnId = params.id;
  const charge = chargeMockById(turnId);

  useEffect(() => {
    document.body.classList.add("charge-flow");

    return () => {
      document.body.classList.remove("charge-flow");
    };
  }, []);

  const [products, setProducts] = useState<SelectedProduct[]>(
    (charge.selectedProducts ?? []).map((product) => ({
      ...product,
      quantity: 1,
    }))
  );
  const [paymentLines, setPaymentLines] = useState<PaymentLineState[]>(
    charge.paymentLines.map((line) => ({
      id: line.id,
      method: line.method,
      amount: String(line.amount),
    }))
  );
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const treatmentAmount = charge.treatmentAmount;

  const availableCatalog = useMemo(() => {
    const normalizedSearch = productSearch
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

    return charge.availableProducts.filter((candidate) => {
      const notAdded = !products.some((item) => item.id === candidate.id);
      if (!notAdded) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      return candidate.name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .includes(normalizedSearch);
    });
  }, [charge.availableProducts, productSearch, products]);

  const productsTotal = useMemo(
    () => products.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [products]
  );

  const total = treatmentAmount + productsTotal;

  const paid = useMemo(
    () =>
      paymentLines.reduce((acc, line) => {
        const amount = parseAmount(line.amount);
        return acc + (Number.isNaN(amount) ? 0 : amount);
      }, 0),
    [paymentLines]
  );

  const cashPaid = useMemo(
    () =>
      paymentLines.reduce((acc, line) => {
        if (line.method !== "Efectivo") {
          return acc;
        }

        return acc + parseAmount(line.amount);
      }, 0),
    [paymentLines]
  );

  const pending = Math.max(total - paid, 0);
  const change = Math.max(paid - total, 0);
  const cashChange = cashPaid > 0 ? change : 0;
  const canConfirmCharge = paid >= total;
  const canAddPaymentLine = paymentLines.length < PAYMENT_METHODS.length;

  function addProduct(product: ChargeProduct) {
    setProducts((current) => [...current, { ...product, quantity: 1 }]);
    setProductSearch("");
    setIsProductModalOpen(false);
  }

  function removeProduct(productId: string) {
    setProducts((current) => current.filter((item) => item.id !== productId));
  }

  function updateProductQuantity(productId: string, nextQuantity: number) {
    setProducts((current) =>
      current.map((item) =>
        item.id === productId
          ? {
              ...item,
              quantity: Math.max(1, nextQuantity),
            }
          : item
      )
    );
  }

  function addPaymentLine() {
    setPaymentLines((current) => [
      ...current,
      {
        id: `line-${current.length + 1}`,
        method: PAYMENT_METHODS.find(
          (method) => !current.some((line) => line.method === method)
        ) ?? "Efectivo",
        amount: "",
      },
    ]);
  }

  function updatePaymentLine(id: string, patch: Partial<PaymentLineState>) {
    setPaymentLines((current) => {
      return current.map((line) =>
        line.id === id
          ? {
              ...line,
              amount:
                patch.amount !== undefined ? parseDigits(patch.amount) : line.amount,
              ...patch,
            }
          : line
      );
    });
  }

  function removePaymentLine(id: string) {
    if (paymentLines.length === 1) {
      return;
    }

    setPaymentLines((current) => current.filter((line) => line.id !== id));
  }

  function finalizeCharge() {
    const positiveLines = paymentLines
      .map((line) => ({
        method: line.method,
        amount: parseAmount(line.amount),
      }))
      .filter((line) => line.amount > 0);

    const paymentBreakdown = positiveLines.length
      ? positiveLines.map((line) => `${line.method} ${formatMoney(line.amount)}`).join(" · ")
      : "Sin medios cargados";

    const productsLabel = products.length
      ? products
          .map((product) =>
            product.quantity > 1 ? `${product.name} x${product.quantity}` : product.name
          )
          .join(", ")
      : undefined;

    completeTodayCharge({
      turnId,
      totalLabel: formatMoney(total),
      paymentBreakdown,
      productsLabel,
      hasTransfer: positiveLines.some((line) => line.method === "Transferencia"),
    });

    resetTurnFlow(turnId);
    navigate("/");
  }

  function handleInvoiceDecision() {
    setIsConfirmModalOpen(false);
    finalizeCharge();
  }

  return (
    <main className="charge-screen">
      <div className="charge-safe-top" />

      <section className="charge-content">
        <header className="charge-topbar">
          <button
            type="button"
            className="charge-icon-button"
            aria-label="Volver"
            onClick={() => navigate(`/turno/${turnId}`)}
          >
            ‹
          </button>
        </header>

        <article className="charge-hero-card">
          <div className="charge-hero-card__top">
            <h1 className="charge-hero-card__patient">{charge.patient}</h1>
            <div className="charge-chip">Sesión cerrada</div>
          </div>
          <p className="charge-hero-card__amount">{formatMoney(total)}</p>
        </article>

        <div className="charge-main-stack">
          <section className="charge-main-card">
            <section className="charge-section">
              <div className="charge-section__head">
                <h2 className="charge-section__title">Medios de pago</h2>
              </div>

              <div className="charge-payment-lines">
                {paymentLines.map((line) => (
                  <article key={line.id} className="charge-payment-line">
                    <div className="charge-payment-line__top">
                      <select
                        className="charge-field"
                        value={line.method}
                        onChange={(event) =>
                          updatePaymentLine(line.id, {
                            method: event.target.value as ChargePaymentMethod,
                          })
                        }
                      >
                        {PAYMENT_METHODS.filter((method) => {
                          return (
                            method === line.method ||
                            !paymentLines.some(
                              (other) => other.id !== line.id && other.method === method
                            )
                          );
                        }).map((method) => (
                          <option key={method} value={method}>
                            {method}
                          </option>
                        ))}
                      </select>

                      <input
                        className="charge-field"
                        type="text"
                        inputMode="numeric"
                        placeholder="Monto"
                        value={formatMoneyInput(line.amount)}
                        onChange={(event) =>
                          updatePaymentLine(line.id, {
                            amount: event.target.value,
                          })
                        }
                      />

                      {paymentLines.length > 1 ? (
                        <button
                          type="button"
                          className="charge-line-remove"
                          onClick={() => removePaymentLine(line.id)}
                        >
                          −
                        </button>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>

              <button
                type="button"
                className="charge-add-line"
                onClick={addPaymentLine}
                disabled={!canAddPaymentLine}
              >
                + Agregar otro medio
              </button>
            </section>
          </section>

          <section className="charge-products-card">
            <div className="charge-products-scroll">
              <section className="charge-section">
                <div className="charge-section__head">
                  <h2 className="charge-section__title">Productos</h2>

                  <button
                    type="button"
                    className="charge-inline-button"
                    onClick={() => setIsProductModalOpen(true)}
                  >
                    Agregar producto
                  </button>
                </div>

                {products.length ? (
                  <div className="charge-product-list">
                    {products.map((product) => (
                      <article key={product.id} className="charge-product-item">
                        <div className="charge-product-item__copy">
                          <p className="charge-product-item__name">{product.name}</p>
                          <p className="charge-product-item__price">
                            {formatMoney(product.price)} c/u
                          </p>
                          <p className="charge-product-item__subtotal">
                            {product.quantity} x {formatMoney(product.price)} ={" "}
                            {formatMoney(product.price * product.quantity)}
                          </p>
                        </div>

                        <div className="charge-product-item__actions">
                          <div className="charge-quantity-stepper">
                            <button
                              type="button"
                              className="charge-quantity-stepper__button"
                              onClick={() =>
                                updateProductQuantity(product.id, product.quantity - 1)
                              }
                            >
                              −
                            </button>

                            <span className="charge-quantity-stepper__value">
                              {product.quantity}
                            </span>

                            <button
                              type="button"
                              className="charge-quantity-stepper__button"
                              onClick={() =>
                                updateProductQuantity(product.id, product.quantity + 1)
                              }
                            >
                              +
                            </button>
                          </div>

                          <button
                            type="button"
                            className="charge-item-action"
                            onClick={() => removeProduct(product.id)}
                          >
                            Quitar
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="charge-empty-state">
                    <p className="charge-empty-state__title">Sin productos agregados</p>
                    <p className="charge-empty-state__copy">
                      Sumá productos solo si forman parte de esta misma orden.
                    </p>
                  </div>
                )}
              </section>
            </div>
          </section>
        </div>

        <footer className="charge-footer-card">
          <button
            type="button"
            className={`charge-btn ${
              canConfirmCharge ? "charge-btn--success" : "charge-btn--pending"
            }`.trim()}
            onClick={() => {
              if (!canConfirmCharge) {
                return;
              }

              setIsConfirmModalOpen(true);
            }}
          >
            {canConfirmCharge ? "Confirmar cobro" : `Pendiente ${formatMoney(pending)}`}
          </button>

          {cashChange > 0 && canConfirmCharge ? (
            <p className="charge-footer-note">Vuelto {formatMoney(cashChange)}</p>
          ) : null}

          <button
            type="button"
            className="charge-footer-link"
            onClick={() => navigate(`/turno/${turnId}`)}
          >
            Volver al turno
          </button>
        </footer>
      </section>

      {isProductModalOpen ? (
        <ProductSearchModal
          search={productSearch}
          onSearchChange={setProductSearch}
          products={availableCatalog}
          onAddProduct={addProduct}
          onClose={() => {
            setProductSearch("");
            setIsProductModalOpen(false);
          }}
        />
      ) : null}

      {isConfirmModalOpen ? (
        <div className="charge-modal-backdrop charge-modal-backdrop--centered" role="presentation">
          <div
            className="charge-confirm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="charge-confirm-title"
          >
            <div className="charge-modal__header">
              <div>
                <h2 id="charge-confirm-title" className="charge-modal__title">
                  ¿Quieres emitir la factura por la orden?
                </h2>
              </div>

              <button
                type="button"
                className="charge-modal__close"
                aria-label="Cerrar"
                onClick={() => setIsConfirmModalOpen(false)}
              >
                ×
              </button>
            </div>

            <div className="charge-modal__actions">
              <button
                type="button"
                className="charge-btn charge-btn--accent"
                onClick={handleInvoiceDecision}
              >
                Sí
              </button>

              <button
                type="button"
                className="charge-btn charge-btn--ghost"
                onClick={handleInvoiceDecision}
              >
                No
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <style>{`
        body.charge-flow .bottom-nav {
          display: none;
        }

        body.charge-flow .app-shell__content {
          padding-bottom: 0;
        }

        .charge-screen {
          min-height: 100dvh;
          height: 100dvh;
          background:
            radial-gradient(circle at top left, rgba(84, 140, 190, 0.15), transparent 34%),
            linear-gradient(180deg, #f7fbff 0%, #eef4fb 100%);
          overflow: hidden;
        }

        .charge-safe-top {
          height: env(safe-area-inset-top, 0px);
          min-height: 8px;
        }

        .charge-content {
          height: calc(100% - env(safe-area-inset-top, 0px));
          padding: 12px 16px 16px;
          display: grid;
          grid-template-rows: auto auto minmax(0, 1fr) auto;
          gap: 12px;
          overflow: hidden;
        }

        @media (min-width: 390px) {
          .charge-content {
            padding-left: 20px;
            padding-right: 20px;
          }
        }

        .charge-topbar {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          padding-top: 2px;
        }

        .charge-icon-button {
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

        .charge-hero-card,
        .charge-main-card,
        .charge-products-card,
        .charge-footer-card,
        .charge-product-modal,
        .charge-confirm-modal {
          border: 1px solid #dce7f3;
          background: #ffffff;
          box-shadow: 0 12px 28px rgba(48, 90, 138, 0.08);
        }

        .charge-hero-card {
          border-radius: 24px;
          padding: 16px;
          display: grid;
          gap: 10px;
        }

        .charge-chip {
          min-height: 28px;
          padding: 0 12px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          background: #e7f5eb;
          color: #1f6f47;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .charge-hero-card__top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }

        .charge-hero-card__patient {
          margin: 0;
          color: #163252;
          font-size: 24px;
          line-height: 1.05;
          font-weight: 800;
          letter-spacing: -0.03em;
          flex: 1;
        }

        .charge-hero-card__amount {
          margin: 0;
          color: #163252;
          font-size: 34px;
          line-height: 0.95;
          font-weight: 800;
          letter-spacing: -0.04em;
          text-align: center;
        }

        .charge-main-card,
        .charge-products-card {
          border-radius: 28px;
          overflow: hidden;
        }

        .charge-main-stack {
          min-height: 0;
          display: grid;
          grid-template-rows: auto minmax(0, 1fr);
          gap: 12px;
          overflow: hidden;
        }

        .charge-main-card {
          padding: 16px;
        }

        .charge-products-card {
          min-height: 0;
        }

        .charge-products-scroll {
          height: 100%;
          overflow-y: auto;
          padding: 16px;
        }

        .charge-section {
          display: grid;
          gap: 12px;
        }

        .charge-section__head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .charge-section__title {
          margin: 0;
          color: #163252;
          font-size: 18px;
          line-height: 1.15;
          font-weight: 800;
          letter-spacing: -0.02em;
        }

        .charge-inline-button,
        .charge-item-action {
          border: 0;
          border-radius: 14px;
          background: rgba(31, 93, 149, 0.1);
          color: #174973;
          font-size: 13px;
          line-height: 1.1;
          font-weight: 800;
          cursor: pointer;
          padding: 10px 14px;
        }

        .charge-inline-button--muted {
          background: rgba(31, 93, 149, 0.06);
          color: #5e7793;
        }

        .charge-product-list,
        .charge-payment-lines,
        .charge-product-catalog {
          display: grid;
          gap: 10px;
        }

        .charge-product-item,
        .charge-product-catalog__item,
        .charge-payment-line {
          border: 1px solid #dce7f3;
          border-radius: 20px;
          background: #f8fbff;
          padding: 14px;
        }

        .charge-product-item,
        .charge-product-catalog__item {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 10px;
          align-items: center;
        }

        .charge-product-item__copy,
        .charge-product-catalog__copy {
          min-width: 0;
        }

        .charge-product-item__name,
        .charge-product-catalog__name {
          margin: 0;
          color: #163252;
          font-size: 15px;
          line-height: 1.2;
          font-weight: 800;
        }

        .charge-product-item__price,
        .charge-product-catalog__price {
          margin: 4px 0 0;
          color: #5e7793;
          font-size: 13px;
          line-height: 1.2;
          font-weight: 700;
        }

        .charge-product-item__subtotal {
          margin: 4px 0 0;
          color: #174973;
          font-size: 13px;
          line-height: 1.2;
          font-weight: 800;
        }

        .charge-product-item__actions {
          display: grid;
          gap: 8px;
          justify-items: end;
        }

        .charge-quantity-stepper {
          display: inline-grid;
          grid-template-columns: 34px auto 34px;
          align-items: center;
          gap: 6px;
          padding: 4px;
          border: 1px solid #dce7f3;
          border-radius: 999px;
          background: #ffffff;
        }

        .charge-quantity-stepper__button {
          width: 34px;
          height: 34px;
          border: 0;
          border-radius: 999px;
          background: rgba(31, 93, 149, 0.1);
          color: #174973;
          font-size: 22px;
          line-height: 1;
          font-weight: 700;
          cursor: pointer;
        }

        .charge-quantity-stepper__value {
          min-width: 22px;
          text-align: center;
          color: #163252;
          font-size: 15px;
          line-height: 1;
          font-weight: 800;
        }

        .charge-empty-state {
          border: 1px dashed #ccdced;
          border-radius: 20px;
          background: #f7fbff;
          padding: 18px 16px;
          text-align: center;
        }

        .charge-empty-state--modal {
          padding-top: 24px;
          padding-bottom: 24px;
        }

        .charge-empty-state__title {
          margin: 0;
          color: #163252;
          font-size: 16px;
          line-height: 1.2;
          font-weight: 800;
        }

        .charge-empty-state__copy {
          margin: 6px 0 0;
          color: #627791;
          font-size: 14px;
          line-height: 1.35;
          font-weight: 600;
        }

        .charge-payment-line {
          display: grid;
          gap: 10px;
        }

        .charge-payment-line__top {
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr) auto;
          gap: 10px;
          align-items: start;
        }

        .charge-field {
          width: 100%;
          min-width: 0;
          min-height: 48px;
          border-radius: 16px;
          border: 1px solid #d8e4f0;
          background: #ffffff;
          color: #163252;
          padding: 0 14px;
          font-size: 15px;
          font-weight: 700;
          outline: none;
        }

        .charge-line-remove {
          width: 44px;
          height: 48px;
          border: 0;
          border-radius: 16px;
          background: rgba(217, 100, 100, 0.12);
          color: #b64d4d;
          font-size: 28px;
          line-height: 1;
          font-weight: 700;
          cursor: pointer;
        }

        .charge-add-line {
          justify-self: start;
          border: 0;
          background: transparent;
          color: #1f5d95;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          padding: 0;
        }

        .charge-add-line:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }

        .charge-footer-card {
          border-radius: 28px;
          padding: 14px;
          display: grid;
          gap: 10px;
        }

        .charge-btn {
          min-height: 50px;
          border-radius: 18px;
          border: 0;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
        }

        .charge-btn--success {
          background: linear-gradient(180deg, #2eaf68 0%, #238e53 100%);
          color: #ffffff;
          box-shadow: 0 12px 24px rgba(35, 142, 83, 0.2);
        }

        .charge-btn--accent {
          background: linear-gradient(180deg, #1f5d95 0%, #184d7d 100%);
          color: #ffffff;
          box-shadow: 0 12px 24px rgba(24, 77, 125, 0.18);
        }

        .charge-btn--pending {
          background: linear-gradient(180deg, #f0a03d 0%, #dd8122 100%);
          color: #ffffff;
          box-shadow: 0 12px 24px rgba(191, 116, 23, 0.18);
        }

        .charge-btn--ghost {
          background: transparent;
          color: #58728f;
          border: 1px solid #dbe7f2;
        }

        .charge-btn--success:disabled,
        .charge-btn--accent:disabled,
        .charge-btn--pending:disabled {
          opacity: 0.45;
          cursor: not-allowed;
          box-shadow: none;
        }

        .charge-footer-link {
          border: 0;
          background: transparent;
          color: #1f5d95;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          padding: 0;
          justify-self: center;
        }

        .charge-footer-note {
          margin: -2px 0 0;
          text-align: center;
          color: #1f6f47;
          font-size: 13px;
          line-height: 1.2;
          font-weight: 800;
        }

        .charge-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(17, 31, 47, 0.42);
          display: grid;
          align-items: end;
          padding: 18px 16px calc(24px + env(safe-area-inset-bottom, 0px));
          z-index: 30;
        }

        .charge-modal-backdrop--centered {
          align-items: center;
          padding-top: 24px;
        }

        .charge-product-modal,
        .charge-confirm-modal {
          width: min(100%, 460px);
          justify-self: center;
          border-radius: 28px;
          padding: 18px;
          display: grid;
          gap: 16px;
        }

        .charge-modal__header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }

        .charge-modal__title {
          margin: 0;
          color: #163252;
          font-size: 22px;
          line-height: 1.1;
          font-weight: 800;
          letter-spacing: -0.03em;
        }

        .charge-modal__description {
          margin: 6px 0 0;
          color: #617893;
          font-size: 14px;
          line-height: 1.35;
          font-weight: 600;
        }

        .charge-modal__close {
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

        .charge-modal__actions {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        .charge-modal__actions--stacked {
          grid-template-columns: 1fr;
        }

        .charge-modal-search {
          min-height: 48px;
          border: 1px solid #d7e3ef;
          border-radius: 18px;
          background: #f8fbff;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 14px;
        }

        .charge-modal-search__icon {
          color: #68819d;
          font-size: 18px;
          line-height: 1;
          flex-shrink: 0;
        }

        .charge-modal-search__input {
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

        .charge-catalog-action {
          min-height: 42px;
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
          .charge-content {
            padding-top: 8px;
            gap: 10px;
          }

          .charge-hero-card,
          .charge-main-card,
          .charge-products-scroll,
          .charge-footer-card,
          .charge-product-modal,
          .charge-confirm-modal {
            padding-top: 14px;
            padding-bottom: 14px;
          }

          .charge-hero-card__patient,
          .charge-modal__title {
            font-size: 20px;
          }

          .charge-hero-card__amount {
            font-size: 30px;
          }

          .charge-section__title {
            font-size: 17px;
          }

          .charge-field,
          .charge-btn,
          .charge-modal-search {
            min-height: 44px;
          }

          .charge-payment-line__top {
            grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) 40px;
            gap: 8px;
          }

          .charge-line-remove {
            width: 40px;
            height: 44px;
          }

          .charge-product-item,
          .charge-product-catalog__item,
          .charge-payment-line {
            padding: 12px;
          }

          .charge-product-item__name,
          .charge-product-catalog__name {
            font-size: 14px;
          }

          .charge-product-item__price,
          .charge-product-item__subtotal,
          .charge-product-catalog__price,
          .charge-empty-state__copy,
          .charge-modal__description {
            font-size: 13px;
          }
        }
      `}</style>
    </main>
  );
}
