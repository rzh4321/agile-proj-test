import PriceRangeFilters from "./PriceRangeFilters";
import FiltersWithSearch from "./FiltersWithSearch";
import RatingFilters from "./RatingFilters";
import { useMyStores } from "@/context/StoresContext";
import type { FiltersType } from "@/types";
import { categoryFilters, brandFilters } from "@/filters";

const filterStyles = {
  container: "flex flex-col gap-6 p-5 bg-gray-50 rounded-lg shadow-lg",
  filterSection: "flex flex-col gap-4",
};

type Props = {
  toggleFilterURL: (filterType: string, value: string) => void;
  currentFilter: string;
  handleSearchOrRatingURL: (filter: string, searchValue: string) => void;
  getFilterValuesFromURL: (filterType: string) => string[];
};

export default function Filters({
  currentFilter,
  toggleFilterURL,
  handleSearchOrRatingURL,
  getFilterValuesFromURL,
}: Props) {
  const { toggleFilter } = useMyStores();

  const handleFilterClick = (
    filter: keyof FiltersType,
    filterValue: string,
  ) => {
    toggleFilter(filter, filterValue);
    toggleFilterURL(filter, filterValue);
  };

  return (
    <div className={filterStyles.container}>
      <div className={filterStyles.filterSection}>
        {currentFilter === "Price Range" && (
          <PriceRangeFilters handleFilterClick={handleFilterClick} />
        )}

        {currentFilter === "Rating" && (
          <RatingFilters handleRatingURL={handleSearchOrRatingURL} />
        )}

        {currentFilter === "Brand" && (
          <FiltersWithSearch
            handleFilterClick={handleFilterClick}
            handleSearchURL={handleSearchOrRatingURL}
            urlFilterParam="brand"
            urlSearchParam="brandSearch"
            filters={brandFilters}
            savedSearch={getFilterValuesFromURL("brandSearch")[0] || ""}
            placeholder="Search brands..."
          />
        )}

        {currentFilter === "Category" && (
          <FiltersWithSearch
            key="category"
            handleFilterClick={handleFilterClick}
            handleSearchURL={handleSearchOrRatingURL}
            urlFilterParam="category"
            urlSearchParam="categorySearch"
            filters={categoryFilters}
            savedSearch={getFilterValuesFromURL("categorySearch")[0] || ""}
            placeholder="Search categories..."
          />
        )}
      </div>
    </div>
  );
}
