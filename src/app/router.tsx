import { createBrowserRouter, Outlet } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import AgendaPage from "../pages/AgendaPage";
import ChargePage from "../pages/ChargePage";
import TodayPage from "../pages/TodayPage";
import TurnWorkspacePage from "../pages/TurnWorkspacePage";

function MobileLayout() {
  return (
    <div className="app-shell">
      <div className="app-shell__content">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MobileLayout />,
    children: [
      { index: true, element: <TodayPage /> },
      { path: "agenda", element: <AgendaPage /> },
      { path: "turno/:id", element: <TurnWorkspacePage /> },
      { path: "cobro/:id", element: <ChargePage /> },
    ],
  },
]);
