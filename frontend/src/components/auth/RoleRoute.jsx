import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./useAuth";

function roleToHome(role) {
  if (role === "HR") return "/";
  if (role === "MANAGER") return "/manager";
  return "/employee";
}

export default function RoleRoute({ allowRoles }) {
  const { loading, me } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!me) return <Navigate to="/login" replace />;

  if (!allowRoles.includes(me.role)) {
    return <Navigate to={roleToHome(me.role)} replace />;
  }

  return <Outlet />;
}