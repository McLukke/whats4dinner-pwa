import mongoose from "mongoose";

const RecipeSchema = new mongoose.Schema(
  {
    title: String,
    slug: { type: String, index: true },
    asianName: String,
    cuisine: String,
    difficulty: String,
    images: [String],
    videoUrl: String,
    description: String,
    ingredients: [mongoose.Schema.Types.Mixed],
    instructions: [String],
    steps: [String],           // legacy alias — prefer instructions
    tags: [String],
    sourceSite: String,
    sourceUrl: String,
    servings: Number,
    prepTimeMinutes: Number,
    cookTimeMinutes: Number,
    marinationTimeMinutes: Number,
    fermentationTimeMinutes: Number,
    scrapedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.models.Recipe || mongoose.model("Recipe", RecipeSchema);
