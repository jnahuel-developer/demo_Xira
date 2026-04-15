import { useLocation, useNavigate } from "react-router-dom";

type NavItem = {
  key: string;
  label: string;
  icon: string;
  path: string;
  isActive: (pathname: string) => boolean;
};

const items: NavItem[] = [
  {
    key: "today",
    label: "Hoy",
    icon: "◉",
    path: "/",
    isActive: (pathname) => pathname === "/",
  },
  {
    key: "agenda",
    label: "Agenda",
    icon: "☷",
    path: "/agenda",
    isActive: (pathname) => pathname.startsWith("/agenda") || pathname.startsWith("/turno"),
  },
  {
    key: "patients",
    label: "Pacientes",
    icon: "⌕",
    path: "/pacientes",
    isActive: (pathname) =>
      pathname.startsWith("/pacientes") || pathname.startsWith("/paciente/"),
  },
  {
    key: "more",
    label: "Más",
    icon: "⋯",
    path: "/mas",
    isActive: (pathname) => pathname.startsWith("/mas"),
  },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="bottom-nav" aria-label="Navegación principal">
      {items.map((item) => {
        const active = item.isActive(location.pathname);

        return (
          <button
            key={item.key}
            className={`bottom-nav__item ${active ? "bottom-nav__item--active" : ""}`}
            onClick={() => navigate(item.path)}
            type="button"
          >
            <span className="bottom-nav__icon" aria-hidden="true">
              {item.icon}
            </span>
            <span className="bottom-nav__label">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
