import { useState } from "react";
import { calculateDistance } from "@/lib/utils";
import type { SelectedStore } from "@/types";

type TravelMode = "DRIVING" | "WALKING" | "BICYCLING";
type DirectionsCache = {
  [key: string]: CacheEntry;
};
type CacheEntry = {
  result: google.maps.DirectionsResult;
  userCoordinates: {
    lat: number;
    lng: number;
  };
};

interface UseDirectionsProps {
  coordinates: { lat: number; lng: number } | null;
  selectedStore: SelectedStore | null;
}

const createCacheKey = (
  mode: TravelMode,
  destinationLat: number,
  destinationLng: number,
) => {
  return `${mode}_${destinationLat.toFixed(6)}_${destinationLng.toFixed(6)}`;
};

export default function useDirections({
  coordinates,
  selectedStore,
}: UseDirectionsProps) {
  const [directionResult, setDirectionResult] =
    useState<google.maps.DirectionsResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOutOfRange, setIsOutOfRange] = useState(false);
  const [directionsCache, setDirectionsCache] = useState<DirectionsCache>({});
  const SIGNIFICANT_DISTANCE_CHANGE = 0.1; // threshold to determine if coordinates changed enough to update cache

  const getDirections = async (destination: string, mode: TravelMode) => {
    if (!coordinates || !selectedStore) return;

    const distanceToDestination = calculateDistance(
      coordinates.lat,
      coordinates.lng,
      selectedStore.store.lat,
      selectedStore.store.lng,
    );

    const MAX_DISTANCES = {
      DRIVING: 100, // miles
      WALKING: 10, // miles
      BICYCLING: 20, // miles
    };

    // Update out of range status
    setIsOutOfRange(distanceToDestination > MAX_DISTANCES[mode]);

    // Create cache key using mode and destination coordinates
    const cacheKey = createCacheKey(
      mode,
      selectedStore.store.lat,
      selectedStore.store.lng,
    );
    const cachedEntry = directionsCache[cacheKey];

    if (cachedEntry) {
      const distanceFromCachedOrigin = calculateDistance(
        coordinates.lat,
        coordinates.lng,
        cachedEntry.userCoordinates.lat,
        cachedEntry.userCoordinates.lng,
      );
      // user hasnt moved much from last time, return cached directions
      if (distanceFromCachedOrigin < SIGNIFICANT_DISTANCE_CHANGE) {
        setDirectionResult(cachedEntry.result);
        return;
      }
    }

    setIsLoading(true);
    console.log(`Getting new directions from Google for ${mode}`);
    const directionsService = new google.maps.DirectionsService();

    try {
      const result = await directionsService.route({
        origin: new google.maps.LatLng(coordinates.lat, coordinates.lng),
        destination: { placeId: destination },
        travelMode: google.maps.TravelMode[mode],
      });

      // Update cache with new result and current coordinates
      setDirectionsCache((prev) => ({
        ...prev,
        [cacheKey]: {
          result,
          userCoordinates: { lat: coordinates.lat, lng: coordinates.lng },
        },
      }));
      setDirectionResult(result);
    } catch (error) {
      console.error("Error fetching directions: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    directionResult,
    isLoading,
    isOutOfRange,
    getDirections,
  };
}
