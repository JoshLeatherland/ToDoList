import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks";

function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading === true || isAuthenticated === null)
    return <div>Loading...</div>;

  return isAuthenticated ? <Outlet /> : <Navigate to="/auth" />;
}

export default ProtectedRoute;
