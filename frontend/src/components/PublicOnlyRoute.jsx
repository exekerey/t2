import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../components/auth/useAuth";

function roleToHome(role) {
  if (role === "HR") return "/hr";
  if (role === "MANAGER") return "/manager";
  return "/employee";
}

export default function PublicOnlyRoute() {
  const { loading, me } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (me) return <Navigate to={roleToHome(me.role)} replace />;
  return <Outlet />;
}