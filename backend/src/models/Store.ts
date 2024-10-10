import { Schema, model, models } from "mongoose";

const StoreSchema = new Schema({
  name: {
    type: String,
  },
  category: { type: String },
  priceRange: { type: String },
  description: { type: String }
});

const Store = models.Store || model("Store", StoreSchema);

export default Store;