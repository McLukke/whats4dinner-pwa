"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import AsianPlaceholder from "./AsianPlaceholder";

const DIFFICULTY_STYLES = {
  easy: "bg-green-500/80 text-white",
  medium: "bg-amber-500/80 text-white",
  hard: "bg-red-500/80 text-white",
};

export default function RecipeCard({ recipe, isFavorited = false, onToggleFavorite }) {
  const heroImage = recipe.images?.[0];
  const difficultyStyle =
    DIFFICULTY_STYLES[recipe.difficulty?.toLowerCase()] ?? "bg-white/60 text-neutral-700";

  return (
    <div className="relative">
      <Link href={`/recipe/${recipe.slug || recipe._id}`} className="block group">
        <div className="rounded-2xl overflow-hidden bg-white border border-neutral-100 shadow-sm active:scale-[0.98] transition-transform">

          {/* Thumbnail */}
          <div className="relative aspect-video bg-neutral-100">
            {heroImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={heroImage}
                alt={recipe.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <AsianPlaceholder className="w-full h-full" />
            )}

            {/* Top-right glass badges */}
            {(recipe.cuisine || recipe.difficulty) && (
              <div className="absolute top-2.5 right-2.5 flex flex-col items-end gap-1">
                {recipe.cuisine && (
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide
                               bg-slate-800/75 text-slate-100 backdrop-blur-md"
                  >
                    {recipe.cuisine}
                  </span>
                )}
                {recipe.difficulty && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide
                                backdrop-blur-md ${difficultyStyle}`}
                  >
                    {recipe.difficulty}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="px-4 py-3 flex items-start justify-between gap-2">
            <h2 className="flex-1 text-lg font-semibold text-neutral-900 leading-snug line-clamp-2">
              {recipe.title}
            </h2>
            {onToggleFavorite && (
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleFavorite(String(recipe._id)); }}
                className="shrink-0 mt-0.5 p-1 -mr-1 rounded-lg active:bg-neutral-100 transition-colors"
                aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
              >
                <Heart
                  className={`w-5 h-5 transition-colors ${
                    isFavorited ? "fill-rose-500 text-rose-500" : "text-neutral-300"
                  }`}
                />
              </button>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
