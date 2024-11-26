import { Schema, model, models } from "mongoose";

const StoreSchema = new Schema({
  _id: { type: String },
  name: {
    type: String,
  },
  address: { type: String },
  reviews: { type: [String] },
  categories: { type: [String] },
  priceRange: { type: String },
  description: { type: String },
  photos: { type: [String] },
  brand: { type: String },
  rating: { type: Number },
  googleMapsURI: { type: String },
  phoneNumber: { type: String },
  paymentOptions: {
    acceptsCashOnly: {
      type: String,
      enum: ["true", "false", "N/A"],
      default: "false",
    },
    acceptsCreditCards: {
      type: String,
      enum: ["true", "false", "N/A"],
      default: "false",
    },
    acceptsDebitCards: {
      type: String,
      enum: ["true", "false", "N/A"],
      default: "false",
    },
    acceptsNFC: {
      type: String,
      enum: ["true", "false", "N/A"],
      default: "false",
    },
  },
  openingHours: { type: String },
  ratingCount: { type: Number },
  websiteURI: { type: String },
  lat: { type: Number },
  lng: { type: Number },
  lastUpdated: {type: Date}
});

const Store = models.Store || model("Store", StoreSchema);

export default Store;
