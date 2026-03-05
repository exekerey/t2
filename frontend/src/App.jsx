import { Routes, Route, Navigate } from "react-router-dom";

import HrLayout from "./layouts/HrLayout";

import HrDashboardHome from "./pages/hr/HrDashboardHome";
import HrSuppliers from "./pages/hr/HrSuppliers";
import HrContracts from "./pages/hr/HrContracts";
import HrTrainings from "./pages/hr/HrTrainings";
import HrListeners from "./pages/hr/HrListeners";
import HrRequests from "./pages/hr/HrRequests";

import ManagerDashboard from "./pages/ManagerDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/hr" replace />} />

      <Route path="/hr" element={<HrLayout />}>
        <Route index element={<HrDashboardHome />} />
        <Route path="suppliers" element={<HrSuppliers />} />
        <Route path="contracts" element={<HrContracts />} />
        <Route path="trainings" element={<HrTrainings />} />
        <Route path="listeners" element={<HrListeners />} />
        <Route path="requests" element={<HrRequests />} />
      </Route>

      <Route path="/manager" element={<ManagerDashboard />} />
      <Route path="/employee" element={<EmployeeDashboard />} />
    </Routes>
  );
}