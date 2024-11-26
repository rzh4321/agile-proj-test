import PriceRangeFilters from "./PriceRangeFilters";
import FiltersWithSearch from "./FiltersWithSearch";
import RatingFilters from "./RatingFilters";
import { useMyStores } from "@/context/StoresContext";
import type { FiltersType } from "@/types";
import { categoryFilters, brandFilters } from "@/filters";

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
    // toggle both the filter context and its search param
    toggleFilter(filter, filterValue);
    toggleFilterURL(filter, filterValue);
  };

  if (currentFilter === "Price Range")
    return <PriceRangeFilters handleFilterClick={handleFilterClick} />;
  else if (currentFilter === "Rating")
    return <RatingFilters handleRatingURL={handleSearchOrRatingURL} />;
  else if (currentFilter === "Brand")
    return (
      <FiltersWithSearch
        handleFilterClick={handleFilterClick}
        handleSearchURL={handleSearchOrRatingURL}
        urlFilterParam="brand"
        urlSearchParam="brandSearch"
        filters={brandFilters}
        savedSearch={getFilterValuesFromURL("brandSearch")[0] || ""}
        placeholder="Search brands..."
      />
    );
  else if (currentFilter === "Category")
    return (
      <FiltersWithSearch
        key={"category"} // needed to fix search bar being shared across filters
        handleFilterClick={handleFilterClick}
        handleSearchURL={handleSearchOrRatingURL}
        urlFilterParam="category"
        urlSearchParam="categorySearch"
        filters={categoryFilters}
        savedSearch={getFilterValuesFromURL("categorySearch")[0] || ""}
        placeholder="Search categories..."
      />
    );
}
