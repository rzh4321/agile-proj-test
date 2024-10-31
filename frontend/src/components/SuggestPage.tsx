import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import Filters from "./Filters";
import { useMyStores } from "@/context/StoresContext";
import { FiltersType } from "@/types";
import { FilterStringTypes } from "@/types";
import { suggestStores } from "@/lib/utils";
import useStores from "@/hooks/useStores";

const filterDescriptions: Record<FilterStringTypes, string> = {
  Brand: "Select specific retailers and boutiques",
  "Price Range": "Filter stores by typical price points from budget to luxury",
  Category: "Browse by store type like clothing, accessories, beauty and more",
  Rating:
    "Sort by Google review ratings from 1 to 5 stars and number of ratings",
};

const filterToCamelCase: Record<FilterStringTypes, keyof FiltersType> = {
  Brand: "brand",
  "Price Range": "priceRange",
  Category: "category",
  Rating: "rating",
};

const filterNames: FilterStringTypes[] = [
  "Brand",
  "Price Range",
  "Category",
  "Rating",
];

export default function SuggestPage() {
  const { stores, loading, error } = useStores();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentFilter, setCurrentFilter] =
    useState<FilterStringTypes>("Brand");
  const {
    clearFilters,
    toggleFilter,
    setRatingFilter,
    isAnyFilterApplied,
    filters,
  } = useMyStores();

  const navigate = useNavigate();

  const handleGenerateStores = () => {
    if (error || loading) return;
    const suggestedStores = suggestStores(stores, filters);
    navigate("/", {
      state: {
        suggestedStores: suggestedStores,
        openSearchBar: true,
      },
    });
  };

  useEffect(() => {
    // reapply any filters to the filter context using search params
    const priceRangeFilters = getFilterValuesFromURL("priceRange");
    priceRangeFilters.forEach((priceRange) =>
      toggleFilter("priceRange", priceRange),
    );
    const brandFilters = getFilterValuesFromURL("brand");
    brandFilters.forEach((brand) => toggleFilter("brand", brand));
    const categoryFilters = getFilterValuesFromURL("category");
    categoryFilters.forEach((category) => toggleFilter("category", category));
    const ratingFilterArr = getFilterValuesFromURL("rating");
    if (ratingFilterArr.length > 0)
      setRatingFilter("rating", +ratingFilterArr[0]);
    const numRatingsFilterArr = getFilterValuesFromURL("numRatings");
    if (numRatingsFilterArr.length > 0)
      setRatingFilter("numRatings", +numRatingsFilterArr[0]);

    // reapply search params from the filter context
    if (
      priceRangeFilters.length === 0 &&
      brandFilters.length === 0 &&
      categoryFilters.length === 0 &&
      ratingFilterArr.length === 0 &&
      numRatingsFilterArr.length === 0
    ) {
      const currentParams = new URLSearchParams(searchParams);

      filters.brand.forEach((brand) => {
        if (!currentParams.getAll("brand").includes(brand)) {
          currentParams.append("brand", brand);
        }
      });

      filters.category.forEach((category) => {
        if (!currentParams.getAll("category").includes(category)) {
          currentParams.append("category", category);
        }
      });

      filters.priceRange.forEach((priceRange) => {
        if (!currentParams.getAll("priceRange").includes(priceRange)) {
          currentParams.append("priceRange", priceRange);
        }
      });

      if (filters.rating)
        currentParams.set("rating", filters.rating.toString());
      if (filters.numRatings)
        currentParams.set("numRatings", filters.numRatings.toString());

      setSearchParams(currentParams);
    }
  }, []);

  // toggle filter search param
  const toggleFilterURL = (filterType: string, value: string) => {
    const currentParams = new URLSearchParams(searchParams);
    const currentValues = currentParams.getAll(filterType);

    if (currentValues.includes(value)) {
      // remove param if it exists
      currentParams.delete(filterType);
      currentValues
        .filter((v) => v !== value)
        .forEach((v) => {
          // add search params back after filtering
          currentParams.append(filterType, v);
        });
    } else {
      // add param if doesn't exist
      currentParams.append(filterType, value);
    }

    setSearchParams(currentParams);
  };

  const getFilterValuesFromURL = (filterType: string): string[] => {
    return searchParams.getAll(filterType);
  };

  // update search or rating param
  const handleSearchOrRatingURL = (filter: string, value: string) => {
    const currentParams = new URLSearchParams(searchParams);
    if (value !== "") {
      currentParams.set(filter, value);
    } else {
      currentParams.delete(filter);
    }
    setSearchParams(currentParams);
  };

  const handleClearFilters = () => {
    clearFilters(currentFilter);
    // delete the search param
    const currentParams = new URLSearchParams(searchParams);
    currentParams.delete(filterToCamelCase[currentFilter]);
    if (currentFilter === "Rating") currentParams.delete("numRatings"); // also delete numRatings param
    setSearchParams(currentParams);
  };

  return (
    <div className="flex">
      <nav className="w-32 bg-blue-400 overflow-y-auto h-[calc(100vh-68px)]">
        <ul className="divide-y divide-black">
          {filterNames.map((filter) => (
            <li
              key={filter}
              onClick={() => setCurrentFilter(filter)}
              className={`${filter === currentFilter ? "bg-green-600 font-extrabold text-xl" : "hover:bg-blue-500 text-lg"} p-4 py-8 font-bold text-center cursor-pointer`}
            >
              {filter}
            </li>
          ))}
        </ul>
      </nav>
      <main className="flex-1 p-6 overflow-y-auto h-fit max-h-[calc(100vh-68px)]">
        <h1 className="text-3xl font-bold mb-4">{currentFilter}</h1>
        <p className="text-gray-600 mb-6 leading-5 text-sm font-light">
          {filterDescriptions[currentFilter]}
        </p>
        <Button
          onClick={handleClearFilters}
          className="mb-5"
          variant={"destructive"}
        >
          Clear Filters
        </Button>
        <Filters
          getFilterValuesFromURL={getFilterValuesFromURL}
          toggleFilterURL={toggleFilterURL}
          handleSearchOrRatingURL={handleSearchOrRatingURL}
          currentFilter={currentFilter}
        />
        <div className="mt-6">
          <Button
            className="bg-green-600 border-green-700"
            onClick={handleGenerateStores}
            disabled={!isAnyFilterApplied}
          >
            Generate Stores
          </Button>
        </div>
      </main>
    </div>
  );
}
