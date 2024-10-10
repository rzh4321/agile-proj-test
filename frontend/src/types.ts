export type Store = {
  _id: string;
  name: string;
  priceRange: string;
  category: string;
  description: string;
  image: string;
};

export type Filters = {
  category: string;
  priceRange: string;
};
