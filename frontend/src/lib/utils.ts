import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { FiltersType, Store } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// function to calculate the match score for a single store
const calculateMatchScore = (
  store: Store,
  filters: FiltersType,
): number | null => {
  // strict rating and numRatings check
  if (
    (filters.rating !== null && store.rating < filters.rating) ||
    (filters.numRatings !== null && store.ratingCount < filters.numRatings)
  ) {
    return null;
  }

  let score = 0;
  const weights = {
    brand: 5,
    category: 3,
    priceRange: 1,
  };

  // brand match (highest weight)
  if (filters.brand.length > 0 && filters.brand.includes(store.brand)) {
    score += weights.brand;
  }

  // category match
  const categoryMatch = store.categories.some((cat) =>
    filters.category.includes(cat),
  );
  if (filters.category.length > 0 && categoryMatch) {
    score += weights.category;
  }

  // price range match
  if (
    filters.priceRange.length > 0 &&
    filters.priceRange.includes(store.priceRange)
  ) {
    score += weights.priceRange;
  }

  return score;
};

export const suggestStores = (
  stores: Store[],
  filters: FiltersType,
): Store[] => {
  // filter stores based on user filters
  const eligibleStores = stores.filter(
    (store) =>
      (filters.rating === null || store.rating >= filters.rating) &&
      (filters.numRatings === null || store.ratingCount >= filters.numRatings),
  );

  // calculate scores for eligible stores
  const scoredStores = eligibleStores
    .map((store) => ({
      store,
      score: calculateMatchScore(store, filters),
    }))
    .filter((item) => item.score !== null);

  // sort stores by their match score
  const sortedStores = scoredStores.sort((a, b) => b.score! - a.score!);

  return sortedStores.map((item) => item.store);
};
