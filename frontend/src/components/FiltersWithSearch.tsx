import { Button } from "./ui/button";
import type { FiltersType } from "@/types";
import { useMyStores } from "@/context/StoresContext";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

type Props = {
  handleFilterClick: (filter: keyof FiltersType, filterValue: string) => void;
  handleSearchURL: (filter: string, searchValue: string) => void;
  urlFilterParam: keyof FiltersType;
  urlSearchParam: string;
  filters: string[];
  savedSearch: string;
};

export default function FiltersWithSearch({
  handleFilterClick,
  handleSearchURL,
  urlFilterParam, // search param for the search bar
  urlSearchParam, // search param for the filter itself
  filters, // array of filter options
  savedSearch, // saved search from URL param
}: Props) {
  const { filterIsApplied } = useMyStores();
  const [search, setSearch] = useState(savedSearch);
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    handleSearchURL(urlSearchParam, e.target.value);
  };

  const normalizeString = (str: string) => str.replace(/-/g, "").toLowerCase();

  const buttons = filters
    .filter((filter) =>
      normalizeString(filter).includes(normalizeString(search)),
    )
    .map((filter) => (
      <Button
        key={filter}
        onClick={() => handleFilterClick(urlFilterParam, filter)}
        className={`text-2xl text-wrap block w-full active:bg-green-200 active:text-black active:border:bg-green-300 rounded-t-sm  ${filterIsApplied(urlFilterParam, filter) ? "bg-green-600 border-green-700 hover:bg-green-600 text-white" : "bg-green-300 hover:bg-green-400 text-green-800 border-green-400"} h-[125px] py-6`}
      >
        {filter}
      </Button>
    ));
  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
        <Input
          type="search"
          className="pl-10 pr-4 py-2 w-full"
          placeholder="Search brands..."
          onChange={(e) => handleSearch(e)}
          value={search}
        />
      </div>
      <div className=" max-h-[57vh] overflow-y-auto py-3">{buttons}</div>
    </div>
  );
}
