import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Recipe from "@/models/Recipe";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();
  const cuisine = searchParams.get("cuisine")?.trim();
  const quick = searchParams.get("quick") === "true";

  await connectToDatabase();

  const filter = {};

  // Each comma-separated term must appear in title OR an ingredient name
  if (q) {
    const terms = q.split(",").map((t) => t.trim()).filter(Boolean);
    filter.$and = terms.map((term) => ({
      $or: [
        { title: { $regex: term, $options: "i" } },
        { "ingredients.name": { $regex: term, $options: "i" } },
      ],
    }));
  }

  if (cuisine) {
    const list = cuisine.split(",").map((c) => c.trim()).filter(Boolean);
    filter.cuisine = { $in: list.map((c) => new RegExp(`^${c}$`, "i")) };
  }

  // Strictly exclude recipes with null/missing cookTimeMinutes
  if (quick) {
    filter.cookTimeMinutes = { $lt: 20 };
  }

  const recipes = await Recipe.find(filter)
    .sort({ createdAt: -1 })
    .limit(24)
    .lean();

  return NextResponse.json(JSON.parse(JSON.stringify(recipes)));
}
