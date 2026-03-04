// import { useState } from 'react'
import './App.css'

function App() {
  
  return (
    <>
      <Routes>
      <Route path="/" element={<Landing />} />

      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<Login />} />
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

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </>
  )
}

export default App
