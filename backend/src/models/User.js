import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const UserSchema = new Schema({
  username: {
    type: String,
    required: [true, "Username is required!"],
    unique: [true, "Username already exists!"],
  },
  password: {
    type: String,
  },
  saved_routes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Route",
    },
  ],
});

const User = models.User || model("User", UserSchema);

export default User;
