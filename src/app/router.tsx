import { createBrowserRouter, Outlet } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import AgendaPage from "../pages/AgendaPage";
import AvailabilityPage from "../pages/AvailabilityPage";
import ChargePage from "../pages/ChargePage";
import ContractStubPage from "../pages/ContractStubPage";
import EquipmentPage from "../pages/EquipmentPage";
import MorePage from "../pages/MorePage";
import PatientHistoryPage from "../pages/PatientHistoryPage";
import PatientsPage from "../pages/PatientsPage";
import ProductsPage from "../pages/ProductsPage";
import SuppliesPage from "../pages/SuppliesPage";
import TreatmentsPage from "../pages/TreatmentsPage";
import TodayPage from "../pages/TodayPage";
import TurnWorkspacePage from "../pages/TurnWorkspacePage";

const basename =
  import.meta.env.BASE_URL === "/"
    ? undefined
    : import.meta.env.BASE_URL.replace(/\/$/, "");

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
        element: <TreatmentsPage />,
      },
      {
        path: "tratamientos/nuevo",
        element: (
          <ContractStubPage
            title="Nuevo tratamiento"
            targetPath="/tratamientos/nuevo"
          />
        ),
      },
      {
        path: "nuevo-tratamiento",
        element: (
          <ContractStubPage
            title="Nuevo tratamiento"
            targetPath="/nuevo-tratamiento"
          />
        ),
      },
      {
        path: "equipos",
        element: <EquipmentPage />,
      },
      {
        path: "equipos/nuevo",
        element: (
          <ContractStubPage
            title="Nuevo equipo"
            targetPath="/equipos/nuevo"
          />
        ),
      },
      {
        path: "equipos/:id/editar",
        element: (
          <ContractStubPage
            title="Editar equipo"
            targetPath="/equipos/:id/editar"
          />
        ),
      },
      {
        path: "equipos/:id/traslado",
        element: (
          <ContractStubPage
            title="Traslado de equipo"
            targetPath="/equipos/:id/traslado"
          />
        ),
      },
      {
        path: "insumos",
        element: <SuppliesPage />,
      },
      {
        path: "insumos/nuevo",
        element: (
          <ContractStubPage
            title="Nuevo insumo"
            targetPath="/insumos/nuevo"
          />
        ),
      },
      {
        path: "insumos/:id/editar",
        element: (
          <ContractStubPage
            title="Editar insumo"
            targetPath="/insumos/:id/editar"
          />
        ),
      },
      {
        path: "insumos/:id/traslado",
        element: (
          <ContractStubPage
            title="Traslado de insumo"
            targetPath="/insumos/:id/traslado"
          />
        ),
      },
      {
        path: "productos",
        element: <ProductsPage />,
      },
      {
        path: "productos/nuevo",
        element: (
          <ContractStubPage
            title="Nuevo producto"
            targetPath="/productos/nuevo"
          />
        ),
      },
      {
        path: "productos/:id/editar",
        element: (
          <ContractStubPage
            title="Editar producto"
            targetPath="/productos/:id/editar"
          />
        ),
      },
      {
        path: "productos/:id/traslado",
        element: (
          <ContractStubPage
            title="Traslado de producto"
            targetPath="/productos/:id/traslado"
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
      {
        path: "tratamientos/:id/editar",
        element: (
          <ContractStubPage
            title="Editar tratamiento"
            targetPath="/tratamientos/:id/editar"
          />
        ),
      },
      {
        path: "tratamiento/:id/editar",
        element: (
          <ContractStubPage
            title="Editar tratamiento"
            targetPath="/tratamiento/:id/editar"
          />
        ),
      },
      {
        path: "insumo/:id",
        element: (
          <ContractStubPage
            title="Detalle de insumo"
            targetPath="/insumo/:id"
          />
        ),
      },
      {
        path: "certificacion/:id",
        element: (
          <ContractStubPage
            title="Detalle de certificación"
            targetPath="/certificacion/:id"
          />
        ),
      },
      { path: "paciente/:id/historial", element: <PatientHistoryPage /> },
      { path: "turno/:id", element: <TurnWorkspacePage /> },
      { path: "cobro/:id", element: <ChargePage /> },
    ],
  },
], { basename });
