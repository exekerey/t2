import { Routes, Route } from "react-router-dom";

import HrDashboard from "./pages/HrDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HrDashboard />} />
      <Route path="/manager" element={<ManagerDashboard />} />
      <Route path="/employee" element={<EmployeeDashboard />} />
    </Routes>
  );
}

export default App;