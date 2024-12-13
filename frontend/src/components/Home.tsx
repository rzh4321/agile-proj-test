import StoresSearchBar from "./StoresSearchBar";
import useStores from "@/hooks/useStores";
import { Loader } from "lucide-react";
import MyStoresButton from "./MyStoresButton";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import SoHoMap from "./SoHoMap";
import { useMyStores } from "@/context/StoresContext";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { useState } from "react";

export default function Home() {
  const { stores, loading, error } = useStores();
  const { stores: userStores } = useMyStores();
  const [showOnlyUserStores, setShowOnlyUserStores] = useState(false);
  const navigate = useNavigate();

  const handleClickGenerate = () => {
    navigate("/route");
  };
  return (
    <main className="flex flex-col gap-12 px-5">
      <div className="flex flex-col gap-5">
        {error ? (
          <span className="text-center mt-2 font-bold">
            An error occurred: {error}
          </span>
        ) : !loading ? (
          <StoresSearchBar stores={stores} />
        ) : (
          <Loader className="m-auto mt-5 animate-spin" />
        )}
        <MyStoresButton />
      </div>

      <div className="flex flex-col gap-6 relative">
        <div className="absolute top-[-30px] flex gap-1 items-center">
          <Switch
            id="display"
            checked={showOnlyUserStores}
            onClick={() => setShowOnlyUserStores((prev) => !prev)}
          />
          <Label htmlFor="display" className="font-light text-sm">
            Show only selected stores
          </Label>
        </div>
        <div className="w-full h-[450px] border-2 border-black">
          {loading ? (
            <div className="h-full w-full flex justify-center items-center">
              <Loader className="animate-spin w-[40px] h-[40px]" />
            </div>
          ) : error ? (
            <div>Something went wrong when loading the map: {error}</div>
          ) : (
            <SoHoMap
              key={showOnlyUserStores.toString()}
              stores={showOnlyUserStores ? userStores : stores}
              showOnlyUserStores={showOnlyUserStores}
            />
          )}
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
