import { useState, useEffect } from "react";
import type { Store } from "@/types";

export default function useStores() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStores = async () => {
      const res = await fetch("http://localhost:3001/stores");
      if (res.ok) {
        const stores = await res.json();
        const sortedStores = stores.sort((a: Store, b: Store) =>
          a.name.localeCompare(b.name),
        );
        setStores(sortedStores);
      } else {
        const { message } = await res.json();
        setError(message);
      }

      setLoading(false);
    };
    fetchStores();
  }, []);

  return { stores, loading, error };
}
