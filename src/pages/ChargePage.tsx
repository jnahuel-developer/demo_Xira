import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { chargeMockById, type ChargePaymentMethod } from "../mocks/charge.mock";

const formatMoney = (value: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);

type PaymentLineState = {
  id: string;
  method: ChargePaymentMethod;
  amount: string;
};

export default function ChargePage() {
  const navigate = useNavigate();
  const params = useParams();
  const charge = chargeMockById(params.id);

  const [products, setProducts] = useState(charge.availableProducts.slice(0, 1));
  const [paymentLines, setPaymentLines] = useState<PaymentLineState[]>(
    charge.paymentLines.map((line) => ({
      id: line.id,
      method: line.method,
      amount: String(line.amount),
    }))
  );
  const [invoiceMode, setInvoiceMode] = useState<"emit" | "skip">("emit");

  const treatmentAmount = charge.treatmentAmount;

  const productsTotal = useMemo(
    () => products.reduce((acc, item) => acc + item.price, 0),
    [products]
  );

  const subtotal = treatmentAmount + productsTotal;

  const paidTotal = useMemo(
    () =>
      paymentLines.reduce((acc, line) => {
        const value = Number(line.amount || 0);
        return acc + (Number.isNaN(value) ? 0 : value);
      }, 0),
    [paymentLines]
  );

  const balance = Math.max(subtotal - paidTotal, 0);

  const addProduct = () => {
    const next = charge.availableProducts.find(
      (candidate) => !products.some((item) => item.id === candidate.id)
    );
    if (!next) return;
    setProducts((prev) => [...prev, next]);
  };

  const removeProduct = (id: string) => {
    setProducts((prev) => prev.filter((item) => item.id !== id));
  };

  const addPaymentLine = () => {
    setPaymentLines((prev) => [
      ...prev,
      {
        id: `line-${prev.length + 1}`,
        method: "Efectivo",
        amount: "",
      },
    ]);
  };

  const updatePaymentLine = (
    id: string,
    patch: Partial<PaymentLineState>
  ) => {
    setPaymentLines((prev) =>
      prev.map((line) => (line.id === id ? { ...line, ...patch } : line))
    );
  };

  const removePaymentLine = (id: string) => {
    if (paymentLines.length === 1) return;
    setPaymentLines((prev) => prev.filter((line) => line.id !== id));
  };

  return (
    <main className="charge-screen">
      <div className="charge-safe-top" />

      <section className="charge-content">
        <header className="charge-header">
          <div className="charge-header__left">
            <button
              type="button"
              className="charge-icon-button"
              aria-label="Volver"
              onClick={() => navigate(-1)}
            >
              ‹
            </button>

            <div className="charge-header__copy">
              <p className="charge-header__eyebrow">Cobro</p>
              <h1 className="charge-header__title">{charge.patient}</h1>
              <p className="charge-header__subtitle">{charge.treatment}</p>
            </div>
          </div>
        </header>

        <div className="charge-stack">
          <article className="charge-card">
            <div className="charge-card__inner">
              <p className="charge-summary__label">Resumen de la atención</p>
              <p className="charge-summary__treatment">{charge.treatment}</p>
              <p className="charge-summary__patient">Paciente: {charge.patient}</p>
              <p className="charge-summary__price">{formatMoney(treatmentAmount)}</p>
            </div>
          </article>

          <article className="charge-card">
            <div className="charge-card__inner">
              <div className="charge-row-between charge-row-between--spaced">
                <h2 className="charge-section-title">Productos</h2>

                {products.length > 0 ? (
                  <button
                    type="button"
                    className="charge-inline-link"
                    onClick={addProduct}
                  >
                    Agregar
                  </button>
                ) : null}
              </div>

              {products.length === 0 ? (
                <button
                  type="button"
                  className="charge-add-button"
                  onClick={addProduct}
                >
                  + Agregar producto
                </button>
              ) : (
                <div className="charge-product-list">
                  {products.map((product) => (
                    <div key={product.id} className="charge-product-item">
                      <div className="charge-product-item__copy">
                        <p className="charge-product-item__name">{product.name}</p>
                      </div>

                      <p className="charge-product-item__price">
                        {formatMoney(product.price)}
                      </p>

                      <button
                        type="button"
                        className="charge-inline-link"
                        onClick={() => removeProduct(product.id)}
                      >
                        Quitar
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </article>

          <article className="charge-card">
            <div className="charge-card__inner">
              <h2 className="charge-section-title">Pagos</h2>

              <div className="charge-payment-lines">
                {paymentLines.map((line, index) => (
                  <div key={line.id} className="charge-payment-line">
                    <div className="charge-row-between">
                      <p className="charge-payment-line__title">Pago {index + 1}</p>

                      {paymentLines.length > 1 ? (
                        <button
                          type="button"
                          className="charge-inline-link"
                          onClick={() => removePaymentLine(line.id)}
                        >
                          Quitar
                        </button>
                      ) : null}
                    </div>

                    <select
                      className="charge-field"
                      value={line.method}
                      onChange={(e) =>
                        updatePaymentLine(line.id, {
                          method: e.target.value as ChargePaymentMethod,
                        })
                      }
                    >
                      <option value="Efectivo">Efectivo</option>
                      <option value="Transferencia">Transferencia</option>
                      <option value="Posnet">Posnet</option>
                    </select>

                    <input
                      className="charge-field"
                      inputMode="numeric"
                      placeholder="Monto"
                      value={line.amount}
                      onChange={(e) =>
                        updatePaymentLine(line.id, {
                          amount: e.target.value.replace(/[^\d]/g, ""),
                        })
                      }
                    />
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="charge-inline-link charge-inline-link--spaced"
                onClick={addPaymentLine}
              >
                + Agregar otro medio de pago
              </button>
            </div>
          </article>

          <article className="charge-card">
            <div className="charge-card__inner">
              <h2 className="charge-section-title">Resumen financiero</h2>

              <div className="charge-money-list">
                <div className="charge-money-row">
                  <p className="charge-money-row__label">Tratamiento</p>
                  <p className="charge-money-row__value">
                    {formatMoney(treatmentAmount)}
                  </p>
                </div>

                <div className="charge-money-row">
                  <p className="charge-money-row__label">Productos</p>
                  <p className="charge-money-row__value">
                    {formatMoney(productsTotal)}
                  </p>
                </div>

                <div className="charge-money-row">
                  <p className="charge-money-row__label">Pagado</p>
                  <p className="charge-money-row__value">
                    {formatMoney(paidTotal)}
                  </p>
                </div>

                <div className="charge-money-row charge-money-row--total">
                  <p className="charge-money-row__label">Total</p>
                  <p className="charge-money-row__value">
                    {formatMoney(subtotal)}
                  </p>
                </div>
              </div>

              {balance > 0 ? (
                <div className="charge-balance-box">
                  Saldo pendiente: {formatMoney(balance)}
                </div>
              ) : null}
            </div>
          </article>

          <article className="charge-card">
            <div className="charge-card__inner">
              <h2 className="charge-section-title">Factura</h2>

              <div className="charge-segmented">
                <button
                  type="button"
                  className={`charge-segmented__button ${
                    invoiceMode === "emit" ? "charge-segmented__button--active" : ""
                  }`}
                  onClick={() => setInvoiceMode("emit")}
                >
                  Emitir ahora
                </button>

                <button
                  type="button"
                  className={`charge-segmented__button ${
                    invoiceMode === "skip" ? "charge-segmented__button--active" : ""
                  }`}
                  onClick={() => setInvoiceMode("skip")}
                >
                  No emitir ahora
                </button>
              </div>
            </div>
          </article>
        </div>
      </section>

      <footer className="charge-footer">
        <p className="charge-footer__meta">
          Confirmá el cobro para cerrar esta atención.
        </p>

        <button type="button" className="charge-btn charge-btn--primary">
          Confirmar cobro
        </button>

        <button
          type="button"
          className="charge-footer__link"
          onClick={() => navigate(-1)}
        >
          Volver al turno
        </button>
      </footer>

      <style>{`
        .charge-screen {
          min-height: 100vh;
          background: var(--app-bg);
        }

        .charge-safe-top {
          height: env(safe-area-inset-top, 0px);
          min-height: 8px;
        }

        .charge-content {
          padding: 12px 16px 24px;
        }

        @media (min-width: 390px) {
          .charge-content {
            padding-left: 20px;
            padding-right: 20px;
          }
        }

        .charge-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          padding: 8px 0 16px;
        }

        .charge-header__left {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          min-width: 0;
        }

        .charge-icon-button {
          width: 44px;
          height: 44px;
          border: 0;
          border-radius: 999px;
          background: var(--app-surface);
          box-shadow: var(--app-shadow);
          display: grid;
          place-items: center;
          color: var(--app-text);
          cursor: pointer;
          flex-shrink: 0;
          font-size: 22px;
          line-height: 1;
        }

        .charge-header__copy {
          min-width: 0;
        }

        .charge-header__eyebrow {
          margin: 0 0 4px;
          font-size: 12px;
          line-height: 1.2;
          color: var(--app-muted);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .charge-header__title {
          margin: 0;
          font-size: 24px;
          line-height: 1.05;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: var(--app-text);
        }

        .charge-header__subtitle {
          margin: 6px 0 0;
          font-size: 14px;
          line-height: 1.3;
          color: var(--app-muted);
          font-weight: 500;
        }

        .charge-stack {
          display: grid;
          gap: 16px;
        }

        .charge-card {
          background: var(--app-surface);
          border: 1px solid var(--app-line);
          border-radius: 24px;
          box-shadow: var(--app-shadow);
        }

        .charge-card__inner {
          padding: 16px;
        }

        .charge-section-title {
          margin: 0;
          font-size: 16px;
          line-height: 1.25;
          font-weight: 750;
          letter-spacing: -0.02em;
        }

        .charge-summary__label {
          margin: 0 0 8px;
          font-size: 13px;
          line-height: 1.3;
          color: var(--app-muted);
          font-weight: 700;
        }

        .charge-summary__treatment {
          margin: 0 0 6px;
          font-size: 22px;
          line-height: 1.05;
          font-weight: 800;
          letter-spacing: -0.03em;
        }

        .charge-summary__patient {
          margin: 0 0 10px;
          font-size: 15px;
          line-height: 1.3;
          font-weight: 600;
        }

        .charge-summary__price {
          margin: 0;
          font-size: 30px;
          line-height: 0.95;
          font-weight: 800;
          letter-spacing: -0.04em;
        }

        .charge-row-between {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .charge-row-between--spaced {
          margin-bottom: 14px;
        }

        .charge-inline-link {
          border: 0;
          background: transparent;
          color: var(--app-primary);
          font-size: 13px;
          font-weight: 700;
          padding: 0;
          cursor: pointer;
          white-space: nowrap;
        }

        .charge-inline-link--spaced {
          margin-top: 12px;
        }

        .charge-add-button {
          width: 100%;
          min-height: 48px;
          border-radius: 16px;
          border: 1px dashed rgba(35, 74, 138, 0.28);
          background: var(--app-primary-soft);
          color: var(--app-primary);
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
        }

        .charge-product-list {
          display: grid;
          gap: 12px;
        }

        .charge-product-item {
          display: grid;
          grid-template-columns: 1fr auto auto;
          align-items: center;
          gap: 10px;
          min-height: 54px;
          padding: 12px 14px;
          border: 1px solid var(--app-line);
          border-radius: 18px;
          background: #f8fafe;
        }

        .charge-product-item__copy {
          min-width: 0;
        }

        .charge-product-item__name {
          margin: 0;
          font-size: 14px;
          line-height: 1.25;
          font-weight: 700;
        }

        .charge-product-item__price {
          margin: 0;
          font-size: 14px;
          line-height: 1.25;
          color: var(--app-muted);
          font-weight: 700;
          white-space: nowrap;
        }

        .charge-payment-lines {
          display: grid;
          gap: 12px;
        }

        .charge-payment-line {
          display: grid;
          gap: 10px;
          padding: 14px;
          border: 1px solid var(--app-line);
          border-radius: 18px;
          background: #f8fafe;
        }

        .charge-payment-line__title {
          margin: 0;
          font-size: 14px;
          line-height: 1.25;
          font-weight: 700;
        }

        .charge-field {
          width: 100%;
          min-height: 48px;
          border-radius: 16px;
          border: 1px solid var(--app-line);
          background: var(--app-surface);
          color: var(--app-text);
          padding: 0 14px;
          font-size: 15px;
          font-weight: 600;
          outline: none;
        }

        .charge-money-list {
          display: grid;
          gap: 12px;
        }

        .charge-money-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .charge-money-row__label {
          margin: 0;
          font-size: 14px;
          line-height: 1.3;
          color: var(--app-muted);
          font-weight: 600;
        }

        .charge-money-row__value {
          margin: 0;
          font-size: 15px;
          line-height: 1.3;
          font-weight: 700;
        }

        .charge-money-row--total {
          padding-top: 12px;
          border-top: 1px solid var(--app-line);
        }

        .charge-money-row--total .charge-money-row__label,
        .charge-money-row--total .charge-money-row__value {
          color: var(--app-text);
          font-size: 16px;
          font-weight: 800;
        }

        .charge-balance-box {
          margin-top: 8px;
          padding: 12px 14px;
          border-radius: 16px;
          background: #fff6e9;
          color: #9a6400;
          font-size: 14px;
          font-weight: 700;
        }

        .charge-segmented {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .charge-segmented__button {
          min-height: 48px;
          border-radius: 16px;
          border: 1px solid var(--app-line);
          background: var(--app-surface);
          color: var(--app-text);
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
        }

        .charge-segmented__button--active {
          border-color: rgba(35, 74, 138, 0.3);
          background: var(--app-primary-soft);
          color: var(--app-primary);
        }

        .charge-footer {
          position: fixed;
          left: 50%;
          transform: translateX(-50%);
          bottom: 0;
          width: 100%;
          max-width: 430px;
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(16px);
          border-top: 1px solid var(--app-line);
          padding: 12px 16px calc(12px + env(safe-area-inset-bottom, 0px));
        }

        @media (min-width: 390px) {
          .charge-footer {
            padding-left: 20px;
            padding-right: 20px;
          }
        }

        .charge-footer__meta {
          margin: 0 0 10px;
          font-size: 12px;
          line-height: 1.3;
          color: var(--app-muted);
          font-weight: 600;
        }

        .charge-btn {
          min-height: 48px;
          border-radius: 16px;
          border: 0;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
        }

        .charge-btn--primary {
          width: 100%;
          background: var(--app-primary);
          color: #fff;
        }

        .charge-footer__link {
          margin-top: 10px;
          border: 0;
          background: transparent;
          color: var(--app-primary);
          padding: 0;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
        }
      `}</style>
    </main>
  );
}
