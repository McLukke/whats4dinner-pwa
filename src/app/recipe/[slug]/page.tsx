import { connectToDatabase } from "@/lib/mongodb";
import Recipe from "@/models/Recipe";
import RecipeDetailClient from "./RecipeDetailClient";
import { notFound } from "next/navigation";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";

export default async function RecipePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  await connectToDatabase();

  // Primary lookup by slug; fall back to _id for any old links in the wild
  let recipe =
    (await Recipe.findOne({ slug }).lean()) ??
    (mongoose.isValidObjectId(slug) ? await Recipe.findById(slug).lean() : null);

  if (!recipe) notFound();

  return <RecipeDetailClient recipe={JSON.parse(JSON.stringify(recipe))} />;
}
