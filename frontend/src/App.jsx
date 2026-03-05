import { Routes, Route } from "react-router-dom";

import HrDashboard from "./pages/HrDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";

import LogIn from "./components/auth/LogIn";
import Register from "./components/auth/Register";
import PublicOnlyRoute from "./components/PublicOnlyRoute";
import RoleRoute from "./components/auth/RoleRoute";


function App() {
  
  return (
    <>
      <Routes>
      

      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<LogIn />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route element={<RoleRoute allowRoles={["HR"]} />}>
        <Route path="/hr" element={<HrDashboard />} />
      </Route>

      <Route element={<RoleRoute allowRoles={["MANAGER"]} />}>
        <Route path="/manager" element={<ManagerDashboard />} />
      </Route>

      <Route element={<RoleRoute allowRoles={["EMPLOYEE"]} />}>
        <Route path="/employee" element={<EmployeeDashboard />} />
      </Route>

   
    </Routes>
    </>
  )
}

export default App
