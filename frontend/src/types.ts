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
};
export type Filters = {
  category: string[];
  priceRange: string[];
  brand: string[];
};

export type PriceRange = "Budget" | "Mid-Range" | "Premium" | "Luxury";
