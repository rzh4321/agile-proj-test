import { createContext, useState, useContext, useCallback } from "react";
import type { Store, Filters } from "@/types";

type StoreContextType = {
  stores: Store[];
  hasStore: (id: string) => boolean;
  addStore: (store: Store) => void;
  removeStore: (id: string) => void;
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
};

// Create the context
const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Create a provider component
export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [stores, setStores] = useState<Store[]>([]);
  const [filters, setFilters] = useState<Filters>({
    category: "",
    priceRange: "Budget",
    // ... initial filter values
  });

  const addStore = useCallback((newStore: Store) => {
    setStores((prevStores) => [...prevStores, newStore]);
  }, []);

  const removeStore = useCallback((id: string) => {
    setStores((prevStores) => prevStores.filter((store) => store._id !== id));
  }, []);

  const hasStore = useCallback(
    (id: string) => {
      return stores.some((store) => store._id === id);
    },
    [stores],
  );

  return (
    <StoreContext.Provider
      value={{ stores, addStore, removeStore, hasStore, filters, setFilters }}
    >
      {children}
    </StoreContext.Provider>
  );
};

// Custom hook to use the shop context
export const useMyStores = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useMyStores must be used within a StoreProvider");
  }
  return context;
};
