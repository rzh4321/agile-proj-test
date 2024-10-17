import { createContext, useState, useContext } from "react";
import type { Store, FiltersType, FilterStringTypes } from "@/types";

type StoreContextType = {
  stores: Store[];
  hasStore: (id: string) => boolean;
  addStore: (store: Store) => void;
  removeStore: (id: string) => void;
  clearStores: () => void;
  filters: FiltersType;
  toggleFilter: (filter: keyof FiltersType, value: string) => void;
  filterIsApplied: (filter: keyof FiltersType, value: string) => boolean;
  clearFilters: (filterToReset: FilterStringTypes) => void;
};

const defaultFilters: FiltersType = {
  category: [],
  priceRange: [],
  brand: [],
};

const filterToCamelCase: Record<FilterStringTypes, keyof FiltersType> = {
  Brand: "brand",
  "Price Range": "priceRange",
  Category: "category",
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [stores, setStores] = useState<Store[]>([]);
  const [filters, setFilters] = useState<FiltersType>({
    category: [],
    priceRange: [],
    brand: [],
  });

  const addStore = (newStore: Store) => {
    setStores((prevStores) => [...prevStores, newStore]);
  };

  const removeStore = (id: string) => {
    setStores((prevStores) => prevStores.filter((store) => store._id !== id));
  };

  const clearStores = () => {
    setStores([]);
  };

  const hasStore = (id: string) => {
    return stores.some((store) => store._id === id);
  };

  const addFilter = (filter: keyof FiltersType, value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filter]: [...new Set([...prevFilters[filter], value])],
    }));
  };

  const removeFilter = (filter: keyof FiltersType, value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filter]: prevFilters[filter].filter((item) => item !== value),
    }));
  };

  const filterIsApplied = (
    filter: keyof FiltersType,
    value: string,
  ): boolean => {
    return filters[filter].includes(value);
  };

  const toggleFilter = (filter: keyof FiltersType, value: string) => {
    if (filterIsApplied(filter, value)) {
      removeFilter(filter, value);
    } else {
      addFilter(filter, value);
    }
  };

  const clearFilters = (filterToReset: FilterStringTypes) => {
    const filter = filterToCamelCase[filterToReset];
    console.log(filterToReset);
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filter]: defaultFilters[filter],
    }));
  };

  return (
    <StoreContext.Provider
      value={{
        stores,
        addStore,
        removeStore,
        clearStores,
        hasStore,
        filters,
        toggleFilter,
        filterIsApplied,
        clearFilters,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useMyStores = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useMyStores must be used within a StoreProvider");
  }
  return context;
};
