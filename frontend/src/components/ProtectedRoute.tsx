import { Navigate, Outlet } from "react-router-dom";
import useAuth from "@/context/AuthContext";
import Navbar from "./Navbar";

const ProtectedRoute = ({ requiresAuth }: { requiresAuth: boolean }) => {
  const { isAuthenticated } = useAuth();

  // unauthenticated user attempting to access protected route
  if (requiresAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  // logged in user attempting to go back to auth page
  else if (!requiresAuth && isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  // logged in user on a protected route
  else if (requiresAuth) {
    return (
      <>
        <Navbar />
        <Outlet />
      </>
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
