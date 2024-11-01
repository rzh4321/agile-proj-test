import { useState, useEffect } from "react";

export default function useGeolocation() {
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const watchLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setLoading(true);
    const watchId = navigator.geolocation.watchPosition(
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
        enableHighAccuracy: true, // More accurate position
        timeout: 5000, // Time to wait for position
        maximumAge: 0, // Don't use cached position
      },
    );

    return () => navigator.geolocation.clearWatch(watchId);
  };

  // Start watching location when component mounts
  useEffect(() => {
    const cleanup = watchLocation();
    return cleanup;
  }, []);

  return { coordinates, error, loading };
}
