import { Button } from "./ui/button";
import type { Filters, PriceRange } from "@/types";
import { useMyStores } from "@/context/StoresContext";

const priceRangeToDollarIcons: Record<PriceRange, number> = {
    Budget: 1,
    "Mid-Range": 2,
    Premium: 3,
    Luxury: 5,
  };

type Props = {
    toggleFilterURL: (filterType: string, value: string) => void;
}

export default function PriceRangeFilters({toggleFilterURL} : Props) {
    const priceRanges = ['Budget', 'Mid-Range', 'Premium', 'Luxury'];
    const {toggleFilter, filterIsApplied} = useMyStores();

    const handleFilterClick = (priceRange: string) => {
        toggleFilter('priceRange' as keyof Filters, priceRange);
        toggleFilterURL('priceRange', priceRange);
    }

    const priceRangeButtons = priceRanges.map(priceRange => (
        <Button key={priceRange} onClick={() => handleFilterClick(priceRange)} className={`text-2xl active:bg-green-200 active:text-black active:border:bg-green-300  ${filterIsApplied('priceRange' as keyof Filters, priceRange) ? 'bg-green-600 border-green-700 hover:bg-green-600 text-white' : 'bg-green-300 hover:bg-green-400 text-green-800 border-green-400'}`}>{priceRange} (
            {"$".repeat(
              priceRangeToDollarIcons[priceRange as PriceRange],
            )}
            )</Button>
    ))
    return (
        <div className="flex flex-col gap-5">
            {priceRangeButtons}
        </div>
    )
}