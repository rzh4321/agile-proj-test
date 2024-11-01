import { useState, useEffect } from "react";

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
          setCoordinates({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
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
          timeout: 5000,
          maximumAge: 0,
        },
      );
    };

    // Get initial position
    getCurrentPosition();

    // Set up interval to update position
    const intervalId = setInterval(getCurrentPosition, intervalMs);

    // Cleanup function
    return () => clearInterval(intervalId);
  }, [intervalMs]);

  return { coordinates, error, loading };
}
