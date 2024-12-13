import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMyStores } from "@/context/StoresContext";
import type { FiltersType, FilterStringTypes } from "@/types";
import { suggestStores } from "@/lib/utils";
import useStores from "@/hooks/useStores";
import PriceRangeFilters from "./PriceRangeFilters";
import FiltersWithSearch from "./FiltersWithSearch";
import RatingFilters from "./RatingFilters";
import { categoryFilters, brandFilters } from "@/filters";
import { X } from "lucide-react";

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
    navigate("/", { state: { suggestedStores, openSearchBar: true } });
  };

  useEffect(() => {
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

  const toggleFilterURL = (filterType: string, value: string) => {
    const currentParams = new URLSearchParams(searchParams);
    const currentValues = currentParams.getAll(filterType);

    if (currentValues.includes(value)) {
      currentParams.delete(filterType);
      currentValues
        .filter((v) => v !== value)
        .forEach((v) => {
          currentParams.append(filterType, v);
        });
    } else {
      currentParams.append(filterType, value);
    }

    setSearchParams(currentParams);
  };

  const getFilterValuesFromURL = (filterType: string): string[] => {
    return searchParams.getAll(filterType);
  };

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
    const currentParams = new URLSearchParams(searchParams);
    currentParams.delete(filterToCamelCase[currentFilter]);
    if (currentFilter === "Rating") currentParams.delete("numRatings");
    setSearchParams(currentParams);
  };

  const ActiveFilters = () => {
    const activeFilters = {
      brand: filters.brand,
      priceRange: filters.priceRange,
      category: filters.category,
      rating: filters.rating ? [`${filters.rating}⭐`] : [],
      numRatings: filters.numRatings
        ? [`Min ${filters.numRatings} reviews`]
        : [],
    };

    const removeFilter = (type: keyof typeof activeFilters, value: string) => {
      if (type === "rating") {
        setRatingFilter("rating", 0);
        handleSearchOrRatingURL("rating", "");
      } else if (type === "numRatings") {
        setRatingFilter("numRatings", 0);
        handleSearchOrRatingURL("numRatings", "");
      } else {
        toggleFilter(type, value);
        toggleFilterURL(type, value);
      }
    };

    return (
      <div className="flex flex-wrap gap-2 mb-6">
        {Object.entries(activeFilters).map(([type, values]) =>
          values.map((value: string) => (
            <div
              key={`${type}-${value}`}
              className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-sm"
            >
              <span className="text-gray-700">{value}</span>
              <button
                onClick={() =>
                  removeFilter(type as keyof typeof activeFilters, value)
                }
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            </div>
          )),
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <nav className="flex justify-center gap-4 p-6">
        {filterNames.map((filter) => (
          <button
            key={filter}
            onClick={() => setCurrentFilter(filter)}
            className={`px-6 py-2 text-sm font-medium rounded-full transition-all
              ${
                filter === currentFilter
                  ? "bg-green-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
          >
            {filter}
          </button>
        ))}
      </nav>

      <main className="flex-1 max-w-3xl mx-auto w-full px-6">
        {isAnyFilterApplied && <ActiveFilters />}

        <div className="space-y-6">
          {currentFilter === "Brand" && (
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="search"
                  placeholder="Search brands..."
                  className="w-full p-3 pl-10 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                  onChange={(e) =>
                    handleSearchOrRatingURL("brandSearch", e.target.value)
                  }
                  value={getFilterValuesFromURL("brandSearch")[0] || ""}
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    strokeWidth="2"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <div className="relative flex">
                <div
                  className="flex-1 space-y-2 max-h-[60vh] overflow-y-auto pr-4"
                  id="brandList"
                >
                  {/* Special Characters Section */}
                  {(() => {
                    const specialBrands = brandFilters.filter(
                      (brand) =>
                        !/^[a-zA-Z]/.test(brand) &&
                        brand
                          .toLowerCase()
                          .includes(
                            (
                              getFilterValuesFromURL("brandSearch")[0] || ""
                            ).toLowerCase(),
                          ),
                    );

                    if (specialBrands.length > 0) {
                      return (
                        <div key="#" id="section-special">
                          <div className="sticky top-0 bg-white py-1 text-sm font-medium text-gray-500">
                            #
                          </div>
                          {specialBrands.map((brand) => (
                            <button
                              key={brand}
                              onClick={() => {
                                toggleFilter("brand", brand);
                                toggleFilterURL("brand", brand);
                              }}
                              className={`w-full p-3 text-left rounded-lg transition-colors
                                ${
                                  filters.brand.includes(brand)
                                    ? "bg-green-600 text-white hover:bg-green-700"
                                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                                }`}
                            >
                              {brand}
                            </button>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  })()}

                  {/* Alphabetical Sections */}
                  {Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ").map((letter) => {
                    const brandsWithLetter = brandFilters.filter(
                      (brand) =>
                        brand.toLowerCase().startsWith(letter.toLowerCase()) &&
                        brand
                          .toLowerCase()
                          .includes(
                            (
                              getFilterValuesFromURL("brandSearch")[0] || ""
                            ).toLowerCase(),
                          ),
                    );

                    if (brandsWithLetter.length === 0) return null;

                    return (
                      <div key={letter} id={`section-${letter}`}>
                        <div className="sticky top-0 bg-white py-1 text-sm font-medium text-gray-500">
                          {letter}
                        </div>
                        {brandsWithLetter.map((brand) => (
                          <button
                            key={brand}
                            onClick={() => {
                              toggleFilter("brand", brand);
                              toggleFilterURL("brand", brand);
                            }}
                            className={`w-full p-3 text-left rounded-lg transition-colors
                              ${
                                filters.brand.includes(brand)
                                  ? "bg-green-600 text-white hover:bg-green-700"
                                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                              }`}
                          >
                            {brand}
                          </button>
                        ))}
                      </div>
                    );
                  })}
                </div>

                {/* Index */}
                <div className="flex flex-col justify-center text-xs font-medium text-gray-500 pl-1">
                  {/* Special Characters Index */}
                  <button
                    className={`py-0.5 px-1 hover:text-gray-900 focus:text-green-600
                      ${!brandFilters.some((brand) => !/^[a-zA-Z]/.test(brand)) ? "opacity-30 cursor-not-allowed" : ""}`}
                    onClick={() => {
                      const element =
                        document.getElementById("section-special");
                      if (element) {
                        const container = document.getElementById("brandList");
                        if (container) {
                          container.scrollTop =
                            element.offsetTop - container.offsetTop;
                        }
                      }
                    }}
                  >
                    #
                  </button>

                  {/* Alphabetical Index */}
                  {Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ").map((letter) => {
                    const hasBrands = brandFilters.some((brand) =>
                      brand.toLowerCase().startsWith(letter.toLowerCase()),
                    );

                    return (
                      <button
                        key={letter}
                        className={`py-0.5 px-1 hover:text-gray-900 focus:text-green-600
                          ${!hasBrands ? "opacity-30 cursor-not-allowed" : ""}`}
                        onClick={() => {
                          if (hasBrands) {
                            const element = document.getElementById(
                              `section-${letter}`,
                            );
                            if (element) {
                              const container =
                                document.getElementById("brandList");
                              if (container) {
                                container.scrollTop =
                                  element.offsetTop - container.offsetTop;
                              }
                            }
                          }
                        }}
                        disabled={!hasBrands}
                      >
                        {letter}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {currentFilter === "Price Range" && (
            <PriceRangeFilters handleFilterClick={toggleFilter} />
          )}

          {currentFilter === "Rating" && (
            <RatingFilters handleRatingURL={handleSearchOrRatingURL} />
          )}

          {currentFilter === "Category" && (
            <FiltersWithSearch
              key="category"
              handleFilterClick={toggleFilter}
              handleSearchURL={handleSearchOrRatingURL}
              urlFilterParam="category"
              urlSearchParam="categorySearch"
              filters={categoryFilters}
              savedSearch={getFilterValuesFromURL("categorySearch")[0] || ""}
              placeholder="Search categories..."
            />
          )}
        </div>

        <Button
          onClick={handleClearFilters}
          variant="outline"
          className="mt-6 w-full border-gray-200 text-gray-600 hover:bg-gray-50"
        >
          Clear Filters
        </Button>

        <Button
          className="w-full mt-6 mb-6 bg-green-600 hover:bg-green-700 border-green-600"
          onClick={handleGenerateStores}
          disabled={!isAnyFilterApplied}
        >
          Generate Stores
        </Button>
      </main>
    </div>
  );
}
