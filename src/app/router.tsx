import { createBrowserRouter, Outlet } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import AgendaPage from "../pages/AgendaPage";
import AvailabilityPage from "../pages/AvailabilityPage";
import ChargePage from "../pages/ChargePage";
import ContractStubPage from "../pages/ContractStubPage";
import MorePage from "../pages/MorePage";
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
      { path: "mas", element: <MorePage /> },
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
        path: "disponibilidad",
        element: <AvailabilityPage />,
      },
      {
        path: "tratamientos",
        element: (
          <ContractStubPage
            title="Tratamientos"
            targetPath="/tratamientos"
          />
        ),
      },
      {
        path: "equipos",
        element: (
          <ContractStubPage
            title="Equipos"
            targetPath="/equipos"
          />
        ),
      },
      {
        path: "insumos",
        element: (
          <ContractStubPage
            title="Insumos"
            targetPath="/insumos"
          />
        ),
      },
      {
        path: "productos",
        element: (
          <ContractStubPage
            title="Productos"
            targetPath="/productos"
          />
        ),
      },
      {
        path: "promociones",
        element: (
          <ContractStubPage
            title="Promociones"
            targetPath="/promociones"
          />
        ),
      },
      {
        path: "configuracion",
        element: (
          <ContractStubPage
            title="Configuración"
            targetPath="/configuracion"
          />
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
