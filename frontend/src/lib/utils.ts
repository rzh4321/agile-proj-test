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

type RouteResult = {
  path: Store[];
  totalDistance: number;
};

function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  // Using Haversine formula to calculate distance between two coordinates
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
}

function getAllPermutations<T>(array: T[]): T[][] {
  const permutations: T[][] = [];

  if (array.length === 0) return [[]];

  for (let i = 0; i < array.length; i++) {
    const currentElement = array[i];
    const remainingElements = array.slice(0, i).concat(array.slice(i + 1));
    const remainingPermutations = getAllPermutations(remainingElements);

    for (const permutation of remainingPermutations) {
      permutations.push([currentElement, ...permutation]);
    }
  }

  return permutations;
}

export function findOptimalRoute(
  userLat: number,
  userLng: number,
  stores: Store[],
): RouteResult {
  // Handle edge cases
  if (!stores.length) return { path: [], totalDistance: 0 };
  if (stores.length === 1)
    return {
      path: stores,
      totalDistance: calculateDistance(
        userLat,
        userLng,
        stores[0].lat,
        stores[0].lng,
      ),
    };

  let shortestDistance = Infinity;
  let optimalPath: Store[] = [];

  // Generate all possible permutations of stores
  const permutations = getAllPermutations(stores);

  // Evaluate each permutation
  for (const permutation of permutations) {
    let totalDistance = 0;

    // Calculate distance from user to first store
    totalDistance += calculateDistance(
      userLat,
      userLng,
      permutation[0].lat,
      permutation[0].lng,
    );

    // Calculate distances between consecutive stores
    for (let i = 0; i < permutation.length - 1; i++) {
      totalDistance += calculateDistance(
        permutation[i].lat,
        permutation[i].lng,
        permutation[i + 1].lat,
        permutation[i + 1].lng,
      );
    }

    // Update optimal path if current path is shorter
    if (totalDistance < shortestDistance) {
      shortestDistance = totalDistance;
      optimalPath = [...permutation];
    }
  }

  return {
    path: optimalPath,
    totalDistance: shortestDistance * 0.621371,
  };
}
