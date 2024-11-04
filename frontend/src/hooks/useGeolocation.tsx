import { useState, useEffect } from "react";

const DISTANCE_THRESHOLD = 50; // meters

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export default function useGeolocation(intervalMs: number = 5000) {
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setLoading(true);

    const getCurrentPosition = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newCoords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          setCoordinates((prevCoords) => {
            if (!prevCoords) return newCoords;

            const distance = calculateDistance(
              prevCoords.lat,
              prevCoords.lng,
              newCoords.lat,
              newCoords.lng,
            );

            // only update coordinates if distance has changed significantly
            return distance > DISTANCE_THRESHOLD ? newCoords : prevCoords;
          });

          setLoading(false);
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setError("Please allow location access to use this feature");
              break;
            case error.POSITION_UNAVAILABLE:
              setError("Location information is unavailable");
              break;
            case error.TIMEOUT:
              setError("Location request timed out");
              break;
            default:
              setError("An unknown error occurred");
          }
          setLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        },
      );
    };

    getCurrentPosition();
    const intervalId = setInterval(getCurrentPosition, intervalMs);
    return () => clearInterval(intervalId);
  }, [intervalMs]);

  return { coordinates, error, loading };
}
