import useAuth from "@/context/AuthContext";
import { Button } from "./ui/button";

export default function Navbar() {
  const { logout } = useAuth();

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Empty div for the start of the navbar */}
        <div className="w-1/3"></div>

        {/* Logo in the middle */}
        <div className="w-1/3 flex justify-center">
          <div className="text-white text-2xl font-bold">
            {/* Placeholder for logo */}
            LOGO
          </div>
        </div>

        {/* Logout button at the end */}
        <div className="w-1/3 flex justify-end">
          <Button
            variant={"destructive"}
            onClick={logout}
          >
            Log Out
          </Button>
        </div>
      </div>
    </nav>
  );
}
