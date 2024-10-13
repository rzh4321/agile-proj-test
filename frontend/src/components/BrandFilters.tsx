import { Button } from "./ui/button";
import type { Filters } from "@/types";
import { useMyStores } from "@/context/StoresContext";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

type Props = {
  handleFilterClick: (filter: keyof Filters, filterValue: string) => void;
  handleSearchURL: (filter: string, searchValue: string) => void;
};

export default function BrandFilters({
  handleFilterClick,
  handleSearchURL,
}: Props) {
  const brandFilters = [
    "Brand A",
    "Brand B",
    "TechMaster",
    "EcoGear",
    "LuxeStyle",
    "InnoWave",
    "PrimePulse",
    "VitalVibe",
    "NexaCore",
    "ZenithZone",
    "QuantumQuest",
    "AeroFlex",
    "SolarSpark",
    "OmegaOasis",
    "CyberSync",
  ];
  const { filterIsApplied } = useMyStores();
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    handleSearchURL("brandSearch", e.target.value);
  };

  const normalizeString = (str: string) => str.replace(/-/g, "").toLowerCase();

  const brandButtons = brandFilters
    .filter((brand) => normalizeString(brand).includes(normalizeString(search)))
    .map((brand) => (
      <Button
        key={brand}
        onClick={() => handleFilterClick("brand", brand)}
        className={`text-2xl block w-full active:bg-green-200 active:text-black active:border:bg-green-300 rounded-none  ${filterIsApplied("brand" as keyof Filters, brand) ? "bg-green-600 border-green-700 hover:bg-green-600 text-white" : "bg-green-300 hover:bg-green-400 text-green-800 border-green-400"} h-[125px] py-6`}
      >
        {brand}
      </Button>
    ));
  return (
    <div className="flex flex-col gap-8">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
        <Input
          type="search"
          className="pl-10 pr-4 py-2 w-full"
          placeholder="Search brands..."
          onChange={(e) => handleSearch(e)}
        />
      </div>
      <div className=" max-h-[57vh] overflow-y-auto py-3">{brandButtons}</div>
    </div>
  );
}
