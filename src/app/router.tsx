import { createBrowserRouter, Outlet } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import AgendaPage from "../pages/AgendaPage";
import ChargePage from "../pages/ChargePage";
import ContractStubPage from "../pages/ContractStubPage";
import PatientHistoryPage from "../pages/PatientHistoryPage";
import PatientsPage from "../pages/PatientsPage";
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
      { path: "pacientes", element: <PatientsPage /> },
      {
        path: "nuevo-paciente",
        element: (
          <ContractStubPage
            title="Nuevo paciente"
            targetPath="/nuevo-paciente"
          />
        ),
      },
      {
        path: "nuevo-turno",
        element: (
          <ContractStubPage title="Nuevo turno" targetPath="/nuevo-turno" />
        ),
      },
      {
        path: "paciente/:id/editar",
        element: (
          <ContractStubPage
            title="Editar paciente"
            targetPath="/paciente/:id/editar"
          />
        ),
      },
      { path: "paciente/:id/historial", element: <PatientHistoryPage /> },
      { path: "turno/:id", element: <TurnWorkspacePage /> },
      { path: "cobro/:id", element: <ChargePage /> },
    ],
  },
]);
