import PriceRangeFilters from "./PriceRangeFilters";
import FiltersWithSearch from "./FiltersWithSearch";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { useMyStores } from "@/context/StoresContext";
import type { Filters } from "@/types";

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

const categoryFilters = [
  "Clothing",
  "Accessories",
  "Art Galleries",
  "Home Decor",
  "Jewelry",
  "Vintage & Thrift",
  "Beauty & Cosmetics",
  "Books & Stationery",
  "Electronics",
  "Footwear",
  "Gourmet Food & Drinks",
  "Health & Wellness",
  "Lifestyle & Gifts",
  "Menswear",
  "Womenswear",
  "Designer Boutiques",
  "Streetwear",
  "Furniture",
  "Eyewear",
  "Music & Vinyl",
  "Outdoor & Sports",
  "Pet Supplies",
  "Kitchenware",
  "Toys & Games",
];

export default function Filters({ currentFilter }: { currentFilter: string }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { toggleFilter, filters } = useMyStores();

  // toggle filter from URL
  const toggleFilterURL = (filterType: string, value: string) => {
    const currentParams = new URLSearchParams(searchParams);
    const currentValues = currentParams.getAll(filterType);
    console.log(filterType, value);

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
      console.log(currentParams.getAll("priceRange"));
    }

    setSearchParams(currentParams);
  };

  const getFilterValuesFromURL = (filterType: string): string[] => {
    return searchParams.getAll(filterType);
  };

  const handleFilterClick = (filter: keyof Filters, filterValue: string) => {
    toggleFilter(filter, filterValue);
    toggleFilterURL(filter, filterValue);
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

  if (currentFilter === "Price Range")
    return <PriceRangeFilters handleFilterClick={handleFilterClick} />;
  else if (currentFilter === "Brand")
    return (
      <FiltersWithSearch
        handleFilterClick={handleFilterClick}
        handleSearchURL={handleSearchURL}
        urlFilterParam="brand"
        urlSearchParam="brandSearch"
        filters={brandFilters}
        savedSearch={getFilterValuesFromURL("brandSearch")[0] || ""}
      />
    );
  else if (currentFilter === "Category")
    return (
      <FiltersWithSearch
        key={"category"} // needed to fix search bar being shared across filters
        handleFilterClick={handleFilterClick}
        handleSearchURL={handleSearchURL}
        urlFilterParam="category"
        urlSearchParam="categorySearch"
        filters={categoryFilters}
        savedSearch={getFilterValuesFromURL("categorySearch")[0] || ""}
      />
    );
}
