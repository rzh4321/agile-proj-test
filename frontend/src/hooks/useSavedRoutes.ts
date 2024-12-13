import { useState, useEffect } from "react";
import type { SavedRoute } from "@/types";
import useAuth from "@/context/AuthContext";
import { API_URL } from "@/config";

export default function useSavedRoutes() {
  const [routes, setRoutes] = useState<SavedRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuth();

  const fetchRoutes = async () => {
    if (!user) return;

    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/user/saved-routes`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        const routes = await res.json();
        setRoutes(routes);
      } else {
        const { message } = await res.json();
        console.error(message);
        setError(message);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchRoutes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user]);

  return { routes, loading, error, refetch: fetchRoutes };
}
