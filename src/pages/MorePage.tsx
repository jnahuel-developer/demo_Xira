import { useNavigate } from "react-router-dom";

const moreOptions = [
  { label: "Disponibilidad", path: "/disponibilidad" },
  { label: "Tratamientos", path: "/tratamientos" },
  { label: "Equipos", path: "/equipos" },
  { label: "Insumos", path: "/insumos" },
  { label: "Productos", path: "/productos" },
  { label: "Promociones", path: "/promociones" },
  { label: "Configuración", path: "/configuracion" },
];

export default function MorePage() {
  const navigate = useNavigate();

  return (
    <main className="more-screen">
      <div className="more-safe-top" />

      <section className="more-content">
        <header className="more-topbar">
          <button
            type="button"
            className="more-icon-button"
            aria-label="Volver"
            onClick={() => navigate(-1)}
          >
            ‹
          </button>
        </header>

        <section className="more-grid" aria-label="Opciones administrativas">
          {moreOptions.map((option) => (
            <button
              key={option.path}
              type="button"
              className="more-option"
              onClick={() => navigate(option.path)}
            >
              {option.label}
            </button>
          ))}
        </section>
      </section>

      <style>{`
        .more-screen {
          min-height: calc(100dvh - 92px - env(safe-area-inset-bottom, 0px));
          height: calc(100dvh - 92px - env(safe-area-inset-bottom, 0px));
          background: linear-gradient(180deg, #f7fbff 0%, #eef4fb 100%);
          overflow: hidden;
        }

        .more-safe-top {
          height: env(safe-area-inset-top, 0px);
          min-height: 8px;
        }

        .more-content {
          height: calc(100% - env(safe-area-inset-top, 0px));
          padding: 12px 16px 16px;
          display: grid;
          grid-template-rows: auto minmax(0, 1fr);
          gap: 12px;
          overflow: hidden;
        }

        @media (min-width: 390px) {
          .more-content {
            padding-left: 20px;
            padding-right: 20px;
          }
        }

        .more-topbar {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          padding-top: 2px;
        }

        .more-icon-button {
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
          font-size: 22px;
          line-height: 1;
          font-weight: 700;
          flex-shrink: 0;
        }

        .more-grid {
          min-height: 0;
          display: grid;
          grid-template-rows: repeat(7, minmax(0, 1fr));
          gap: 10px;
        }

        .more-option {
          width: 100%;
          min-width: 0;
          border: 1px solid #dce7f3;
          border-radius: 22px;
          background: rgba(255, 255, 255, 0.9);
          box-shadow: 0 10px 28px rgba(48, 90, 138, 0.07);
          color: #163252;
          display: grid;
          place-items: center;
          text-align: center;
          font-size: 20px;
          line-height: 1.15;
          font-weight: 800;
          letter-spacing: -0.02em;
          cursor: pointer;
          padding: 0 16px;
        }

        @media (max-height: 700px) {
          .more-content {
            padding-top: 8px;
            gap: 10px;
          }

          .more-grid {
            gap: 8px;
          }

          .more-option {
            border-radius: 18px;
            font-size: 18px;
          }
        }
      `}</style>
    </main>
  );
}
