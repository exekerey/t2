import { Routes, Route, Navigate } from "react-router-dom";

import HrLayout from "./layouts/HrLayout";

import HrDashboardHome from "./pages/hr/HrDashboardHome";
import HrSuppliers from "./pages/hr/HrSuppliers";
import HrContracts from "./pages/hr/HrContracts";
import HrTrainings from "./pages/hr/HrTrainings";
import HrListeners from "./pages/hr/HrListeners";
import HrRequests from "./pages/hr/HrRequests";

import ManagerDashboard from "./pages/manager/ManagerDashboard";
import ManagerCatalog from "./pages/manager/ManagerCatalog";
import ManagerCreateRequest from "./pages/manager/ManagerCreateRequest";
import ManagerRequests from "./pages/manager/ManagerRequests";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import MainPage from "./pages/MainPage";

import LogIn from "./components/auth/LogIn";
import Register from "./components/auth/Register";
import PublicOnlyRoute from "./components/PublicOnlyRoute";
import RoleRoute from "./components/auth/RoleRoute";


function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<MainPage />} />

        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<LogIn />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<RoleRoute allowRoles={["HR"]} />}>
          <Route path="/hr" element={<HrLayout />}>
            <Route index element={<HrDashboardHome />} />
            <Route path="suppliers" element={<HrSuppliers />} />
            <Route path="contracts" element={<HrContracts />} />
            <Route path="trainings" element={<HrTrainings />} />
            <Route path="listeners" element={<HrListeners />} />
            <Route path="requests" element={<HrRequests />} />
          </Route>
        </Route>

        {/* <Route element={<RoleRoute allowRoles={["MANAGER"]} />}> */}
        <Route path="/manager">
          <Route index element={<ManagerDashboard />} />
          <Route path="catalog" element={<ManagerCatalog />} />
          <Route path="request" element={<ManagerCreateRequest />} />
          <Route path="requests" element={<ManagerRequests />} />
        </Route>
        {/* </Route> */}

        <Route element={<RoleRoute allowRoles={["EMPLOYEE"]} />}>
          <Route path="/employee" element={<EmployeeDashboard />} />
        </Route>
      </Routes >
    </>
  )
}

export default App
