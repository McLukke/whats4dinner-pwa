import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
  },
  { strict: false }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
