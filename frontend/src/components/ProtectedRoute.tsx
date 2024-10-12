import { Navigate, Outlet } from "react-router-dom";
import useAuth from "@/context/AuthContext";
import Navbar from "./Navbar";
import { Loader } from "lucide-react";

const ProtectedRoute = ({ requiresAuth }: { requiresAuth: boolean }) => {
  const { isAuthenticated, loading } = useAuth();

  // authentication status still loading
  if (loading) return <div className="h-screen w-screen flex justify-center items-center"><Loader height={100} width={100} className="animate-spin" /></div>

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
