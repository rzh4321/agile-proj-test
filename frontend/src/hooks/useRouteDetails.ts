import { useEffect, useState } from "react";
import type { SavedRoute } from "@/types";
import { API_URL } from "@/config";

export default function useRouteDetails(routeId: string | undefined) {
  const [routeDetails, setRouteDetails] = useState<SavedRoute | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRouteDetails = async () => {
      if (!routeId) return;

      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/routes/${routeId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch route details");
        }

        const data = await response.json();
        setRouteDetails(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRouteDetails();
  }, [routeId]);

  return { routeDetails, isLoading, error };
}
