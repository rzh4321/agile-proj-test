import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SoHoMap from "./SoHoMap";
import RouteDisplayModal from "./RouteDisplayModal";
import { useMyStores } from "@/context/StoresContext";
import useGeolocation from "@/hooks/useGeolocation";
import { findOptimalRoute } from "@/lib/utils";
import type { Store } from "@/types";
import { useMap } from "@vis.gl/react-google-maps";
import AddUpdateRouteButton from "./AddUpdateRouteButton";

export default function RouteDisplayPage() {
  const { stores } = useMyStores();
  const navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<null | Store>(null);
  const [route, setRoute] = useState<Store[]>([]);
  const [totalDistance, setTotalDistance] = useState(0);
  const params = useParams();
  const { coordinates, error, loading: geolocationLoading } = useGeolocation();
  const map = useMap();

  console.log(coordinates);

  // if routeId doesnt exist in database, return to home
  //   if (params.routeId === undefined) navigate('/')

  const handleClick = (store: Store) => {
    if (!map) return;
    map.panTo({ lat: store.lat, lng: store.lng });
    setSelectedStore(store);
  };

  useEffect(() => {
    if (coordinates) {
      // calculate optimal route
      const result = findOptimalRoute(coordinates.lat, coordinates.lng, stores);
      console.log("Optimal route:");
      result.path.forEach((store, index) => {
        console.log(`${index + 1}. ${store.name}`);
      });
      setRoute(result.path);
      setTotalDistance(result.totalDistance);
      setSelectedStore(result.path[0]);
    } else if (error)
      alert(`An error occurred while tracking your location: ${error}`);
    // navigate("/");
  }, [geolocationLoading, error]);

  //   useEffect(() => {
  //     if (!allowedLocationAccess) {
  //       const allow = confirm("Allow location access?");
  //       if (!allow) {
  //         alert("Please allow location access to proceed.");
  //         navigate("/");
  //       } else {
  //         setAllowedLocationAccess(true);
  //       }
  //     }
  //   }, []);

  const handleSaveList = (name: string, description: string) => {
    console.log("saved route:", { name, description, stores: stores });
    alert("route will be saved to database when database is connected");
  };

  const routeDisplay = route?.map((store, index) => (
    <div
      key={store._id}
      onClick={() => handleClick(store)}
      className={`flex cursor-pointer relative flex-col min-w-[100px] max-w-[100px] justify-center items-center text-center border-2 ${selectedStore === store ? "bg-green-400 border-green-500 active:bg-green-400" : "border-gray-300 bg-gray-100 hover:bg-gray-200 active:bg-gray-100"} rounded-md p-2 mb-1`}
    >
      <span className="absolute top-1 left-1 rounded-full bg-green-500 text-white text-lg font-bold border-0 p-0 w-[30px] h-[30px]">
        {" "}
        {index + 1}.{" "}
      </span>
      <span className="text-md font-bold">{store.name}</span>
    </div>
  ));

  const BackButton = (
    <Button variant={"destructive"} onClick={() => navigate("/")}>
      Back to Start
    </Button>
  );

  if (error) {
    return (
      <div className="flex h-[calc(100vh-68px)] m-auto justify-center items-center flex-col gap-8">
        <div>{error}</div>
        {BackButton}
      </div>
    );
  }

  return (
    <div className="p-5 flex flex-col gap-4">
      <div className="text-3xl font-bold text-center">Your Shopping Route</div>

      <div className="w-full h-[300px] border-2 border-black">
        <SoHoMap stores={stores} type="Route Display" />
      </div>
      {totalDistance ? (
        <>
          <div className="font-poppins">
            Total walking distance:{" "}
            <span className="font-bold">{totalDistance.toFixed(0)} miles</span>
          </div>
          <div className="mb-6 overflow-auto h-[150px] flex gap-[1px]">
            {routeDisplay}
          </div>
        </>
      ) : (
        <div className="text-3xl font-sans tracking-wide text-center">
          Calculating route
          <span className="dots overflow-hidden align-baseline"></span>
        </div>
      )}

      <div className="flex justify-between">
        {BackButton}
        <AddUpdateRouteButton type="Add" route={stores} />
      </div>

      <RouteDisplayModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveList}
      />
    </div>
  );
}
