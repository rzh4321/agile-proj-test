import HelpButton from "./HelpButton";
import { Button } from "./ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "@/context/AuthContext";

export default function Navbar() {
  const { logout, isAuthenticated, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isSuggestPage = location.pathname === "/suggest";
  const isHelpPage = location.pathname === "/help";
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";
  const isRoutePage = location.pathname === "/route";
  const isSavedPage = location.pathname === "/saved-routes";

  const handleAuthClick = () => {
    if (isAuthenticated) {
      logout();
    } else {
      navigate("/login", { state: { from: location.pathname } });
    }
  };

  return (

    <nav className="bg-blue-950 sticky top-0 z-50" style={{ height: '6rem' }}>
      <div className="flex justify-between items-center h-full px-4">
        <div
          className="text-white text-2xl font-bold cursor-pointer"
          onClick={() => navigate("/")}
        >
          {isAuthenticated ? `Hello, ${user?.username}` : "SoHo Shopper"}

        </div>

        {!isAuthPage && (
          <div className="flex justify-end items-center space-x-4">
            {isSuggestPage || isHelpPage || isRoutePage || isSavedPage ? (
              <Button
                variant={"secondary"}
                className="border-slate-300"
                onClick={() => navigate("/")}
              >
                Back
              </Button>
            ) : (
              <HelpButton />
            )}
            <Button
              variant={"link"}
              className="text-white bg-transparent font-poppins"
              onClick={handleAuthClick}
            >
              {isAuthenticated ? "Log Out" : "Sign In"}
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
