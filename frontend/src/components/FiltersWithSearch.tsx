import { Button } from "./ui/button";
import type { FiltersType } from "@/types";
import { useMyStores } from "@/context/StoresContext";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

const styles = {
  container: "flex flex-col gap-4 p-4 bg-gray-50 rounded-lg shadow-md",
  searchBar: "relative flex items-center",
  searchIcon:
    "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none",
  input:
    "pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
  buttonsContainer: "max-h-[50vh] overflow-y-auto flex flex-col gap-2",
  button:
    "text-lg font-semibold text-left w-full py-4 px-3 rounded-lg transition-colors border-none active:bg-green-600 active:text-white",
  activeButton: "bg-green-600 text-white hover:bg-green-700",
  inactiveButton: "bg-gray-200 text-gray-800 hover:bg-gray-300",
};

type Props = {
  handleFilterClick: (filter: keyof FiltersType, filterValue: string) => void;
  handleSearchURL: (filter: string, searchValue: string) => void;
  urlFilterParam: keyof FiltersType;
  urlSearchParam: string;
  filters: string[];
  savedSearch: string;
  placeholder: string;
};

export default function FiltersWithSearch({
  handleFilterClick,
  handleSearchURL,
  urlFilterParam,
  urlSearchParam,
  filters,
  savedSearch,
  placeholder,
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
        className={`${styles.button} ${
          filterIsApplied(urlFilterParam, filter)
            ? styles.activeButton
            : styles.inactiveButton
        }`}
      >
        {filter}
      </Button>
    ));

  return (
    <div className={styles.container}>
      <div className={styles.searchBar}>
        <Search className={styles.searchIcon} />
        <Input
          type="search"
          className={styles.input}
          placeholder={placeholder}
          onChange={(e) => handleSearch(e)}
          value={search}
        />
      </div>
      <div className={styles.buttonsContainer}>{buttons}</div>
    </div>
  );
}
