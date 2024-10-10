import { createContext, useState, useContext } from 'react';
import type { Store, Filters } from '@/types';

type StoreContextType = {
  stores: Store[];
  setStores: React.Dispatch<React.SetStateAction<Store[]>>;
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
};

// Create the context
const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Create a provider component
export const StoreProvider = ({ children } : { children: React.ReactNode}) => {
  const [stores, setStores] = useState<Store[]>([]);
  const [filters, setFilters] = useState<Filters>({
    category: '',
    priceRange: 'Budget',
    // ... initial filter values
  });

  return (
    <StoreContext.Provider value={{ stores, setStores, filters, setFilters }}>
      {children}
    </StoreContext.Provider>
  );
};

// Custom hook to use the shop context
export const useStores = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStores must be used within a StoreProvider');
  }
  return context;
};