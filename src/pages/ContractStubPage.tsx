import { useNavigate } from "react-router-dom";

type ContractStubPageProps = {
  title: string;
  targetPath: string;
};

export default function ContractStubPage({
  title,
  targetPath,
}: ContractStubPageProps) {
  const navigate = useNavigate();

  return (
    <main className="contract-screen">
      <div className="contract-safe-top" />

      <section className="contract-content">
        <article className="contract-card">
          <div className="contract-card__inner">
            <span className="contract-chip">Ruta preparada</span>
            <h1 className="contract-title">{title}</h1>
            <p className="contract-copy">
              Esta pantalla todavía no forma parte del mock, pero la ruta ya quedó
              reservada para seguir el flujo sin rehacer la navegación.
            </p>
            <p className="contract-path">{targetPath}</p>

            <button
              type="button"
              className="contract-btn"
              onClick={() => navigate(-1)}
            >
              Volver
            </button>
          </div>
        </article>
      </section>

      <style>{`
        .contract-screen {
          min-height: calc(100dvh - 92px - env(safe-area-inset-bottom, 0px));
          height: calc(100dvh - 92px - env(safe-area-inset-bottom, 0px));
          background: linear-gradient(180deg, #f7fbff 0%, #eef4fb 100%);
          overflow: hidden;
        }

        .contract-safe-top {
          height: env(safe-area-inset-top, 0px);
          min-height: 8px;
        }

        .contract-content {
          height: calc(100% - env(safe-area-inset-top, 0px));
          padding: 20px 16px 16px;
          display: grid;
          place-items: center;
        }

        .contract-card {
          width: 100%;
          max-width: 420px;
          background: rgba(255, 255, 255, 0.92);
          border: 1px solid #dce7f3;
          border-radius: 24px;
          box-shadow: 0 10px 28px rgba(48, 90, 138, 0.07);
        }

        .contract-card__inner {
          padding: 20px;
          display: grid;
          gap: 14px;
          text-align: center;
        }

        .contract-chip {
          justify-self: center;
          min-height: 28px;
          padding: 0 10px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          background: #e8f1fb;
          color: #2d5f93;
          font-size: 11px;
          font-weight: 800;
        }

        .contract-title {
          margin: 0;
          font-size: 26px;
          line-height: 1.08;
          font-weight: 800;
          color: #163252;
          letter-spacing: -0.03em;
        }

        .contract-copy {
          margin: 0;
          font-size: 14px;
          line-height: 1.45;
          color: #627791;
          font-weight: 600;
        }

        .contract-path {
          margin: 0;
          font-size: 13px;
          line-height: 1.35;
          color: #2d5f93;
          font-weight: 800;
        }

        .contract-btn {
          min-height: 48px;
          border-radius: 16px;
          border: 0;
          background: #2d5f93;
          color: #ffffff;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 12px 24px rgba(45, 95, 147, 0.16);
        }
      `}</style>
    </main>
  );
}
