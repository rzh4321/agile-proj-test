import HelpButton from "./HelpButton";
import { Button } from "./ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "@/context/AuthContext";

export default function Navbar() {
  const { logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isSuggestPage = location.pathname === "/suggest";
  const isHelpPage = location.pathname === "/help";
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";

  const handleAuthClick = () => {
    if (isAuthenticated) {
      logout();
    } else {
      navigate("/login", { state: { from: location.pathname } });
    }
  };

  return (
    <nav className="bg-gray-800 p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="w-1/3">
          {isSuggestPage || isHelpPage ? (
            <Button
              variant={"secondary"}
              className="border-slate-300"
              onClick={() => navigate("/")}
            >
              Cancel
            </Button>
          ) : (
            <HelpButton />
          )}
        </div>

        <div className="absolute left-1/2 transform -translate-x-1/2">
          <div
            className="text-white text-2xl font-bold"
            onClick={() => navigate("/")}
          >
            LOGO
          </div>
        </div>

        {!isAuthPage && (
          <div className="w-1/3 flex justify-end">
            <Button
              variant={isAuthenticated ? "destructive" : "default"}
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
