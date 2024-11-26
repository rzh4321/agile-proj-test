type PaymentOptions = {
  acceptsCashOnly: string;
  acceptsCreditCards: string;
  acceptsDebitCards: string;
  acceptsNFC: string;
};

export type Store = {
  _id?: string;
  name: string;
  address: string;
  reviews: string[];
  categories: string[];
  priceRange: string;
  description: string;
  photos: string[];
  brand: string;
  rating: number;
  googleMapsURI: string;
  phoneNumber: string;
  paymentOptions: PaymentOptions;
  openingHours: string;
  ratingCount: number;
  websiteURI: string;
  lat: number;
  lng: number;
};
export type FiltersType = {
  category: string[];
  priceRange: string[];
  brand: string[];
  rating: number | null;
  numRatings: number | null;
};

export type FilterStringTypes = "Brand" | "Price Range" | "Category" | "Rating";

export type PriceRange = "Budget" | "Mid-Range" | "High-end" | "Premium";

export type SavedRoute = {
  _id: string;
  description: string;
  name: string;
  stores: Store[];
  created_by: string;
};

export type User = {
  _id: string;
  username: string;
  saved_routes: SavedRoute[];
};

export type TravelMode = "DRIVING" | "WALKING" | "BICYCLING";

export type SelectedStore = {
  store: Store;
  index: number;
};
