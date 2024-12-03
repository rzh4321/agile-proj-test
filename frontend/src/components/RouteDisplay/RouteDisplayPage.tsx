import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useMyStores } from "@/context/StoresContext";
import useGeolocation from "@/hooks/useGeolocation";
import {
  findOptimalRoute,
  calculateZoomLevel,
  getDescriptionFontSize,
} from "@/lib/utils";
import { ModeSelector } from "./ModeSelector";
import { RouteCards } from "./RouteCards";
import DirectionsPanel from "./DirectionsPanel";
import useDirections from "@/hooks/useDirections";
import useRouteDetails from "@/hooks/useRouteDetails";
import DirectionsMap from "../DirectionsMap";
import { Button } from "../ui/button";
import AddUpdateRouteButton from "../AddUpdateRouteButton";
import type { Store, TravelMode, SelectedStore } from "@/types";
import { useParams } from "react-router-dom";
import CopyLinkButton from "../CopyLinkButton";
import useAuth from "@/context/AuthContext";

export default function RouteDisplayPage() {
  const mapRef = useRef<google.maps.Map | null>(null);
  const { stores } = useMyStores(); // stores they selected from start page
  const navigate = useNavigate();
  const [initialRouteCalculated, setInitialRouteCalculated] = useState(false);
  const [selectedStore, setSelectedStore] = useState<SelectedStore | null>(
    null,
  );
  const [route, setRoute] = useState<Store[]>([]);
  const [totalDistance, setTotalDistance] = useState(0);
  const [selectedMode, setSelectedMode] = useState<TravelMode>("DRIVING");
  const { routeId } = useParams();
  // if routeId is given, fetch route details from backend
  const { routeDetails, isLoading: isLoadingRoute } = useRouteDetails(routeId);
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Use routeDetails.stores if routeId exists, otherwise use stores from start page
  const storeList = useMemo(() => {
    return routeId ? (routeDetails?.stores ?? []) : stores;
  }, [routeId, routeDetails?.stores, stores]);

  // coordinates only change if changed significantly, check every 5 seconds
  const { coordinates, error } = useGeolocation(5000);

  // directions to selected store from current coordinates
  const { directionResult, isLoading, isOutOfRange, getDirections } =
    useDirections({
      coordinates,
      selectedStore,
    });

  const handleStoreClick = (store: Store, ind: number) => {
    if (!mapRef.current) return;
    // clicking on a store pans to store on map
    mapRef.current.panTo({ lat: store.lat, lng: store.lng });
    setSelectedStore({ store, index: ind });
  };

  // Calculate optimal route on initial render with initial coordinates
  useEffect(() => {
    // if route has already been calculated, dont calculate again
    if (coordinates && !initialRouteCalculated && storeList.length > 0) {
      const result = findOptimalRoute(
        coordinates.lat,
        coordinates.lng,
        storeList,
      );
      console.log("Optimal route:");
      result.path.forEach((store, index) => {
        console.log(`${index + 1}. ${store.name}`);
      });
      setRoute(result.path);
      setTotalDistance(result.totalDistance);
      setSelectedStore({ store: result.path[0], index: 0 });
      setInitialRouteCalculated(true);
    } else if (error) {
      alert(`An error occurred while tracking your location: ${error}`);
    }
  }, [coordinates, error, initialRouteCalculated, storeList]);

  // Update directions whenever coordinates, selectedStore, or mode changes
  useEffect(() => {
    if (coordinates && selectedStore) {
      getDirections(selectedStore.store._id as string, selectedMode);
    }
  }, [coordinates, selectedStore, selectedMode, getDirections]);

  if (error) {
    return (
      <div className="flex h-[calc(100vh-68px)] m-auto justify-center items-center flex-col gap-8">
        <div>{error}</div>
        <Button variant={"destructive"} onClick={() => navigate("/")}>
          Back to Start
        </Button>
      </div>
    );
  }

  if (isLoadingRoute) {
    return (
      <div className="flex h-[calc(100vh-68px)] dots m-auto justify-center items-center">
        Loading route details
      </div>
    );
  }

  return (
    <div className="p-5 flex flex-col gap-3">
      <div className="flex flex-col gap-1 items-center">
        <h1 className="text-3xl font-bold text-center">
          {routeId ? routeDetails?.name : "Your Shopping Route"}
        </h1>
        {routeDetails && (
          <span className="text-xs text-gray-600">
            Created by {routeDetails.created_by}
          </span>
        )}
      </div>
      {routeDetails && (
        <div className="text-center text-gray-600">
          <p
            className={`italic text-gray-600 mx-auto max-w-2xl ${getDescriptionFontSize(
              routeDetails.description.length,
            )}`}
          >
            {routeDetails.description}
          </p>

          <CopyLinkButton routeId={routeDetails._id} />
        </div>
      )}
      <div className="w-full h-[300px] border-2 border-black">
        {directionResult && selectedStore && coordinates && (
          <DirectionsMap
            directionResult={directionResult}
            mapRef={mapRef}
            center={{
              lat: selectedStore.store.lat,
              lng: selectedStore.store.lng,
            }}
            // zoom level depends on distance from store
            zoom={calculateZoomLevel(
              coordinates.lat,
              coordinates.lng,
              selectedStore.store.lat,
              selectedStore.store.lng,
            )}
          />
        )}
      </div>

      {route.length > 0 && selectedStore ? (
        <>
          <div className="font-poppins">
            <span className="underline tracking-wide">
              Total travel distance
            </span>
            :{" "}
            <span className="font-bold">{totalDistance.toFixed(0)} miles</span>
            <div className="text-sm font-extralight">
              To minimize travel distance, visit stores in this order:
            </div>
          </div>
          <RouteCards
            route={route}
            selectedStore={selectedStore}
            onStoreClick={handleStoreClick}
          />
        </>
      ) : (
        <div className="text-3xl font-sans tracking-wide text-center">
          Calculating route
          <span className="dots overflow-hidden align-baseline"></span>
        </div>
      )}

      <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
        <ModeSelector
          selectedMode={selectedMode}
          onModeSelect={setSelectedMode}
        />
        {isOutOfRange ? (
          <div className="text-center text-gray-500 py-4">
            <div className="mb-2">
              You're too far away to display {selectedMode.toLowerCase()}{" "}
              directions.
            </div>
            <div className="text-sm">
              Maximum distance for {selectedMode.toLowerCase()}:
              {selectedMode === "DRIVING" && " 100 miles"}
              {selectedMode === "WALKING" && " 10 miles"}
              {selectedMode === "BICYCLING" && " 20 miles"}
            </div>
          </div>
        ) : isLoading ? (
          <div className="text-center text-gray-500 py-4 dots">
            Loading {selectedMode.toLowerCase()} directions
          </div>
        ) : directionResult ? (
          <DirectionsPanel directions={directionResult} mode={selectedMode} />
        ) : (
          <div className="text-center dots text-gray-500 py-4">
            Loading directions
          </div>
        )}
      </div>

      <div className="sticky bottom-0 left-0 right-0 bg-white py-4 mt-auto border-t">
        <div className="max-w-[calc(100vw-2.5rem)] mx-auto flex justify-between">
          {isAuthenticated && (
            <>
              <Button variant={"destructive"} onClick={() => navigate("/")}>
                Back to Start
              </Button>
              <AddUpdateRouteButton type="Add" route={storeList} />
            </>
          )}
          {!isAuthenticated && (
            <Link
              to={"/login"}
              state={{ from: location.pathname }} // to redirect them back to this page
              className="m-auto underline text-gray-500 tracking-wide"
            >
              Log in to save this route
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
