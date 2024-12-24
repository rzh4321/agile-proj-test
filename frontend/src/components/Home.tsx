import StoresSearchBar from "./StoresSearchBar";
import useStores from "@/hooks/useStores";
import { Loader, Filter } from "lucide-react";
import MyStoresButton from "./MyStoresButton";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import SoHoMap from "./SoHoMap";
import { useMyStores } from "@/context/StoresContext";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { useState } from "react";

export default function Home(): JSX.Element {
  const { stores, loading, error } = useStores();
  const { stores: userStores } = useMyStores();
  const [showOnlyUserStores, setShowOnlyUserStores] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleClickGenerate = (): void => {
    navigate("/route");
  };

  return (
    <main className="flex flex-col gap-5 bg-white-100 min-h-screen px-3.5 py-3 text-gray-900">
      {/* Search and MyStores Section */}
      <div className="flex flex-col gap-3">
        {error ? (
          <span className="text-center mt-2 font-bold text-red-500">
            An error occurred: {error}
          </span>
        ) : !loading ? (
          <>
            <StoresSearchBar stores={stores} />
            <MyStoresButton />
          </>
        ) : (
          <Loader
            style={{
              margin: "auto",
              marginTop: "20px",
              animation: "spin 1s linear infinite",
            }}
          />
        )}
        <Button
          variant="secondary"
          className="rounded-xl h-10 flex justify-center gap-1 font-medium text-lg bg-blue-600 text-white shadow-md hover:bg-blue-700 transition"
          onClick={() => navigate("/suggest")}
        >
          <Filter />
          Filters
        </Button>
      </div>

      {/* Map Section */}
      <div className="flex flex-col gap-6 relative">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Your Map</h2>
          <div className="flex items-center gap-2">
            <Switch
              id="display"
              checked={showOnlyUserStores}
              onClick={() => setShowOnlyUserStores((prev) => !prev)}
            />
            <Label htmlFor="display" className="font-light text-sm">
              Only show selections
            </Label>
          </div>
        </div>
        <div className="w-full h-[450px] rounded-lg overflow-hidden shadow-md bg-white border border-gray-300">
          {loading ? (
            <div className="h-full w-full flex justify-center items-center">
              <Loader className="animate-spin w-[40px] h-[40px] text-gray-600" />
            </div>
          ) : error ? (
            <div className="text-center text-red-500">
              Something went wrong when loading the map: {error}
            </div>
          ) : (
            <SoHoMap
              key={showOnlyUserStores.toString()}
              stores={showOnlyUserStores ? userStores : stores}
              showOnlyUserStores={showOnlyUserStores}
            />
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2">
        <Button
          variant="secondary"
          size="lg"
          className="rounded-xl h-11 font-medium shadow-none text-lg bg-green-700 text-white hover:bg-green-800 transition"
          onClick={handleClickGenerate}
          disabled={userStores.length === 0}
        >
          Create your shopping route
        </Button>
        <Button
          size="lg"
          variant="link"
          className="outline-none text-lg font-medium text-gray-500 bg-transparent h-11"
          onClick={() => navigate("/saved-routes")}
        >
          Go to saved routes
        </Button>
      </div>
    </main>
  );
}
