import useAuth from "@/context/AuthContext";
import { Button } from "./ui/button";
import HelpButton from "./HelpButton";

export default function Navbar() {
  const { logout } = useAuth();

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="w-1/3">
          <HelpButton />
        
        </div>

        {/* Logo in the middle */}
        <div className="w-1/3 flex justify-center">
          <div className="text-white text-2xl font-bold">
            LOGO
          </div>
        </div>

        <div className="w-1/3 flex justify-end">
          <Button variant={"destructive"} onClick={logout}>
            Log Out
          </Button>
        </div>
      </div>
    </nav>
  );
}
