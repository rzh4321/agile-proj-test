// RouteSchema.ts
import { Schema, model, models } from "mongoose";

const RouteSchema = new Schema({
  name: {
    type: String,
    required: [true, "Route name is required!"],
  },
  description: {
    type: String,
    maxLength: 250,
  },
  stores: [
    {
      type: String,
      ref: "Store",
    },
  ],
  created_by: {
    type: String,
    required: true,
  },
});

const Route = models.Route || model("Route", RouteSchema);

export default Route;
