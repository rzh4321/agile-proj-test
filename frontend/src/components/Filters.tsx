import PriceRangeFilters from "./PriceRangeFilters";
import FiltersWithSearch from "./FiltersWithSearch";
import RatingFilters from "./RatingFilters";
import { useMyStores } from "@/context/StoresContext";
import type { FiltersType } from "@/types";

const brandFilters = [
  "Apple",
  "Aesop",
  "Balenciaga",
  "Burberry",
  "Chanel",
  "Celine",
  "Diesel",
  "Dolce & Gabbana",
  "Gucci",
  "Glossier",
  "Hermès",
  "Isabel Marant",
  "John Varvatos",
  "Kith",
  "Lululemon",
  "Louis Vuitton",
  "Moncler",
  "Nike",
  "Off-White",
  "Prada",
  "Rag & Bone",
  "Ralph Lauren",
  "Saint Laurent",
  "Stüssy",
  "Supreme",
  "The North Face",
  "Tiffany & Co.",
  "Uniqlo",
  "Valentino",
  "Vans",
  "Versace",
  "Zimmermann",
];

const categoryFilters = [
  "Designer Boutiques",
  "Vintage Clothing",
  "Contemporary Art Galleries",
  "Streetwear Shops",
  "High-End Furniture",
  "Trendy Accessories",
  "Luxury Jewelry",
  "Indie Bookstores",
  "Artisanal Coffee Shops",
  "Gourmet Food Markets",
  "Concept Stores",
  "Sustainable Fashion",
  "Beauty & Cosmetics",
  "Home Decor & Design",
  "Specialty Sneaker Stores",
  "Avant-Garde Fashion",
  "Handcrafted Jewelry",
  "Organic Skincare",
  "Pop-Up Shops",
  "Vinyl Record Stores",
  "Athleisure Brands",
  "Lifestyle & Gift Boutiques",
  "Bespoke Tailors",
  "Artisan Chocolatiers",
  "Designer Eyewear",
  "Craft Cocktail Bars",
  "Niche Perfumeries",
  "Curated Vintage Shops",
  "Tech & Gadget Stores",
  "Upscale Consignment Shops",
];

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
      />
    );
}
