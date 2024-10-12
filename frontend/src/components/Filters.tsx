import PriceRangeFilters from "./PriceRangeFilters";
import { useSearchParams } from "react-router-dom";

export default function Filters({currentFilter} : {currentFilter: string}) {
    const [searchParams, setSearchParams] = useSearchParams();

    // toggle filter from URL
    const toggleFilterURL = (filterType: string, value: string) => {
        const currentParams = new URLSearchParams(searchParams);
        const currentValues = currentParams.getAll(filterType);
        
        if (currentValues.includes(value)) {
          // remove  value if  exists
          currentParams.delete(filterType);
          currentValues.filter(v => v !== value).forEach(v => {
            // add search param values back after filtering
            currentParams.append(filterType, v);
          });
        } else {
          // add  value if  doesn't exist
          currentParams.append(filterType, value);
        }
        
        setSearchParams(currentParams);
      };

    if (currentFilter === 'Price Range') return <PriceRangeFilters toggleFilterURL={toggleFilterURL} />
}