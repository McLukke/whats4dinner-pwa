import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Recipe from "@/models/Recipe";

export async function GET() {
  await connectToDatabase();
  const recipes = await Recipe.find({})
    .sort({ createdAt: -1 })
    .limit(24)
    .lean();
  return NextResponse.json(recipes);
}
