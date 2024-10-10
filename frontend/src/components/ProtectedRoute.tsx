import { Navigate, Outlet } from "react-router-dom";
import useAuth from "@/context/AuthContext";

const ProtectedRoute = ({requiresAuth} : {requiresAuth : boolean}) => {
  const { isAuthenticated } = useAuth();

  if (requiresAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  else if (!requiresAuth && isAuthenticated) {
    return <Navigate to="#" replace />;

  }
  return <Outlet />;
};

export default ProtectedRoute;
