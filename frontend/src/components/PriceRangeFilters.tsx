import { Button } from "./ui/button";
import type { Filters, PriceRange } from "@/types";
import { useMyStores } from "@/context/StoresContext";

const priceRangeToDollarIcons: Record<PriceRange, number> = {
    Budget: 1,
    "Mid-Range": 2,
    Premium: 3,
    Luxury: 5,
  };

export default function PriceRangeFilters() {
    const priceRanges = ['Budget', 'Mid-Range', 'Premium', 'Luxury'];
    const {toggleFilter, filterIsApplied} = useMyStores();

    const handleFilterClick = (priceRange: string) => {
        toggleFilter('priceRange' as keyof Filters, priceRange);
    }

    const priceRangeButtons = priceRanges.map(priceRange => (
        <Button key={priceRange} onClick={() => handleFilterClick(priceRange)} className={`text-2xl ${filterIsApplied('priceRange' as keyof Filters, priceRange) ? 'bg-green-500 border-green-600 text-white' : 'bg-green-300 text-green-800 border-green-400'}`}>{priceRange} (
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