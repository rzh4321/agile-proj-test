import { Button } from "./ui/button";
import type { FiltersType, PriceRange } from "@/types";
import { useMyStores } from "@/context/StoresContext";

const priceRangeToDollarIcons: Record<PriceRange, number> = {
  Budget: 1,
  "Mid-Range": 2,
  "High-end": 3,
  Premium: 5,
};

type Props = {
  handleFilterClick: (filter: keyof FiltersType, filterValue: string) => void;
};

export default function PriceRangeFilters({ handleFilterClick }: Props) {
  const priceRanges = ["Budget", "Mid-Range", "High-end", "Premium"];
  const { filterIsApplied } = useMyStores();

  const priceRangeButtons = priceRanges.map((priceRange) => (
    <Button
      key={priceRange}
      onClick={() => handleFilterClick("priceRange", priceRange)}
      className={`text-2xl active:bg-green-200 active:text-black active:border:bg-green-300  ${filterIsApplied("priceRange" as keyof FiltersType, priceRange) ? "bg-green-600 border-green-700 hover:bg-green-600 text-white" : "bg-green-300 hover:bg-green-400 text-green-800 border-green-400"}`}
    >
      {priceRange} (
      {"$".repeat(priceRangeToDollarIcons[priceRange as PriceRange])})
    </Button>
  ));
  return <div className="flex flex-col gap-5">{priceRangeButtons}</div>;
}
