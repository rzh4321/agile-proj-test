import { createContext, useState, useContext, useMemo } from "react";
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
  setRatingFilter: (filterType: "rating" | "numRatings", value: number) => void;
  isAnyFilterApplied: boolean;
};

const defaultFilters: FiltersType = {
  category: [],
  priceRange: [],
  brand: [],
  rating: null,
  numRatings: null,
};

const filterToCamelCase: Record<FilterStringTypes, keyof FiltersType> = {
  Brand: "brand",
  "Price Range": "priceRange",
  Category: "category",
  Rating: "rating",
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [stores, setStores] = useState<Store[]>([]);
  const [filters, setFilters] = useState<FiltersType>({
    category: [],
    priceRange: [],
    brand: [],
    rating: null,
    numRatings: null,
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

  const addFilter = (
    filter: keyof FiltersType,
    value: string | number | null,
  ) => {
    setFilters((prevFilters) => {
      if (filter === "rating" || filter === "numRatings") {
        return {
          ...prevFilters,
          [filter]: value,
        };
      } else {
        return {
          ...prevFilters,
          [filter]: [...new Set([...prevFilters[filter], value])],
        };
      }
    });
  };

  const removeFilter = (
    filter: keyof FiltersType,
    value: string | number | null,
  ) => {
    setFilters((prevFilters) => {
      if (filter === "rating" || filter === "numRatings") {
        return {
          ...prevFilters,
          [filter]: null,
        };
      } else {
        return {
          ...prevFilters,
          [filter]: prevFilters[filter].filter((item) => item !== value),
        };
      }
    });
  };
  const filterIsApplied = (
    filter: keyof FiltersType,
    value: string | number | null,
  ): boolean => {
    if (filter === "rating" || filter === "numRatings") {
      return filters[filter] === value;
    } else {
      return filters[filter].includes(value as string);
    }
  };

  const isAnyFilterApplied = useMemo(() => {
    return (
      filters.category.length > 0 ||
      filters.priceRange.length > 0 ||
      filters.brand.length > 0 ||
      filters.rating !== null ||
      filters.numRatings !== null
    );
  }, [filters]);

  const toggleFilter = (filter: keyof FiltersType, value: string) => {
    if (filterIsApplied(filter, value)) {
      removeFilter(filter, value);
    } else {
      addFilter(filter, value);
    }
  };

  const clearFilters = (filterToReset: FilterStringTypes) => {
    if (filterToReset === "Rating") {
      // reset both the rating and number of ratings
      setFilters((prevFilters) => ({
        ...prevFilters,
        rating: defaultFilters.rating,
        numRatings: defaultFilters.numRatings,
      }));
    } else {
      const filter = filterToCamelCase[filterToReset];
      setFilters((prevFilters) => ({
        ...prevFilters,
        [filter]: defaultFilters[filter],
      }));
    }
  };

  const setRatingFilter = (
    filterType: "rating" | "numRatings",
    value: number,
  ) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: value,
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
        setRatingFilter,
        isAnyFilterApplied,
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
