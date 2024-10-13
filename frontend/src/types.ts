export type Store = {
  _id: string;
  name: string;
  priceRange: string;
  category: string;
  description: string;
  image: string;
  brand: string;
};

export type Filters = {
  category: string[];
  priceRange: string[];
  brand: string[];
};

export type PriceRange = "Budget" | "Mid-Range" | "Premium" | "Luxury";
