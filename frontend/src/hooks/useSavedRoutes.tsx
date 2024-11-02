import { useState, useEffect } from "react";
import type { SavedRoute } from "@/types";
import useAuth from "@/context/AuthContext";

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
      const res = await fetch(
        `http://localhost:3001/routes/user/${user?._id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      if (res.ok) {
        const routes = await res.json();
        console.log("user's saved routes are ", routes);
        setRoutes(routes);
      } else {
        const { message } = await res.json();
        setError(message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchRoutes();
  }, [authLoading, user]);

  return { routes, loading, error, refetch: fetchRoutes };
}
