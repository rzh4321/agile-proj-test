import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import Filters from "./Filters";
import { useMyStores } from "@/context/StoresContext";
import { FiltersType } from "@/types";
import { FilterStringTypes } from "@/types";

const filterDescriptions: Record<FilterStringTypes, string> = {
  Brand: "brand desc",
  "Price Range": "price range desc",
  Category: "category desc",
};

const filterToCamelCase: Record<FilterStringTypes, keyof FiltersType> = {
  Brand: "brand",
  "Price Range": "priceRange",
  Category: "category",
};

const filterNames: FilterStringTypes[] = ["Brand", "Price Range", "Category"];

export default function FilterPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentFilter, setCurrentFilter] =
    useState<FilterStringTypes>("Brand");
  const { clearFilters, toggleFilter, filters } = useMyStores();

  const navigate = useNavigate();

  useEffect(() => {
    // reapply any filters to the filter context using the URL params
    const priceRangeFilters = getFilterValuesFromURL("priceRange");
    priceRangeFilters.forEach((priceRange) =>
      toggleFilter("priceRange", priceRange),
    );
    const brandFilters = getFilterValuesFromURL("brand");
    brandFilters.forEach((brand) => toggleFilter("brand", brand));
    const categoryFilters = getFilterValuesFromURL("category");
    categoryFilters.forEach((category) => toggleFilter("category", category));

    // reapply URL params from the filter context
    if (
      priceRangeFilters.length === 0 &&
      brandFilters.length === 0 &&
      categoryFilters.length === 0
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

      setSearchParams(currentParams);
    }
  }, []);

  // toggle filter from URL
  const toggleFilterURL = (filterType: string, value: string) => {
    const currentParams = new URLSearchParams(searchParams);
    const currentValues = currentParams.getAll(filterType);

    if (currentValues.includes(value)) {
      // remove  value if  exists
      currentParams.delete(filterType);
      currentValues
        .filter((v) => v !== value)
        .forEach((v) => {
          // add search param values back after filtering
          currentParams.append(filterType, v);
        });
    } else {
      // add  value if  doesn't exist
      currentParams.append(filterType, value);
    }

    setSearchParams(currentParams);
  };

  const getFilterValuesFromURL = (filterType: string): string[] => {
    return searchParams.getAll(filterType);
  };

  // update search URL param
  const handleSearchURL = (filter: string, searchValue: string) => {
    const currentParams = new URLSearchParams(searchParams);
    if (searchValue !== "") {
      console.log(filter, searchValue);

      currentParams.set(filter, searchValue);
    } else {
      currentParams.delete(filter);
    }
    setSearchParams(currentParams);
  };

  const handleClearFilters = () => {
    clearFilters(currentFilter);
    const currentParams = new URLSearchParams(searchParams);
    currentParams.delete(filterToCamelCase[currentFilter]);
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
              className={`${filter === currentFilter ? "bg-green-600 font-extrabold text-2xl" : "hover:bg-blue-500 text-xl"} p-4 py-8 font-bold cursor-pointer`}
            >
              {filter}
            </li>
          ))}
        </ul>
      </nav>
      <main className="flex-1 p-6 overflow-y-auto h-fit max-h-[calc(100vh-68px)]">
        <h1 className="text-3xl font-bold mb-4">{currentFilter}</h1>
        <p className="text-gray-600 mb-6">
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
          handleSearchURL={handleSearchURL}
          currentFilter={currentFilter}
        />
        <div className="my-8">
          <Button variant={"secondary"} onClick={() => navigate("/")}>
            Go Back
          </Button>
        </div>
      </main>
    </div>
  );
}
