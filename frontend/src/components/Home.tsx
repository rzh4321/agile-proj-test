import StoreSearchBar from "./StoreSearchBar";
import useStores from "@/hooks/useStores";
import { Loader } from "lucide-react";
import MyStoresButton from "./MyStoresButton";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import SoHoMap from "./SoHoMap";
import { useMyStores } from "@/context/StoresContext";

export default function Home() {
  const { stores, loading, error } = useStores();
  const { stores: userStores } = useMyStores();
  const navigate = useNavigate();

  const handleClickGenerate = () => {
    // if (allowedLocationAccess) {
    //   navigate("/route");
    //   return;
    // }
    // const allow = confirm("Allow location access?");
    // if (!allow) {
    //   alert("Please allow location access to proceed.");
    // } else {
    //   setAllowedLocationAccess(true);
    //   navigate("/route");
    // }
    navigate("/route");
  };

  return (
    <main className="flex flex-col gap-10 px-5">
      <div className="flex flex-col gap-5">
        {error ? (
          <span>an error: {error}</span>
        ) : !loading ? (
          <StoreSearchBar stores={stores} />
        ) : (
          <Loader className="m-auto animate-spin" />
        )}
        <MyStoresButton />
      </div>

      <div className="flex flex-col gap-6">
        <div className="w-full h-[300px] border-2 border-black">
          <SoHoMap />
        </div>
        <Button
          className="rounded-3xl h-12 font-extrabold text-lg"
          onClick={() => navigate("/suggest")}
        >
          Suggest Stores For Me
        </Button>
        <Button
          className="rounded-3xl h-12 font-extrabold text-lg"
          onClick={() => navigate("/saved-routes")}
        >
          Saved Routes
        </Button>
        <Button
          className="rounded-3xl h-12 font-extrabold text-lg"
          onClick={handleClickGenerate}
          disabled={userStores.length === 0}
        >
          Generate Route
        </Button>
      </div>
    </main>
  );
}
