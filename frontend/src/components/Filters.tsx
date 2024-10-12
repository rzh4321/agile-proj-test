import PriceRangeFilters from "./PriceRangeFilters";

export default function Filters({currentFilter} : {currentFilter: string}) {

    if (currentFilter === 'Price Range') return <PriceRangeFilters />
}