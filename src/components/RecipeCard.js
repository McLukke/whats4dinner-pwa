import Link from "next/link";
import AsianPlaceholder from "./AsianPlaceholder";

const DIFFICULTY_STYLES = {
  easy: "bg-green-500/80 text-white",
  medium: "bg-amber-500/80 text-white",
  hard: "bg-red-500/80 text-white",
};

export default function RecipeCard({ recipe }) {
  const heroImage = recipe.images?.[0];
  const difficultyStyle =
    DIFFICULTY_STYLES[recipe.difficulty?.toLowerCase()] ?? "bg-white/60 text-neutral-700";

  return (
    <Link href={`/recipe/${recipe.slug || recipe._id}`} className="block group">
      <div className="rounded-2xl overflow-hidden bg-white border border-neutral-100 shadow-sm active:scale-[0.98] transition-transform">

        {/* Thumbnail — image only, no video overlay */}
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

        <div className="px-4 py-3">
          <h2 className="text-lg font-semibold text-neutral-900 leading-snug line-clamp-2">
            {recipe.title}
          </h2>
        </div>
      </div>
    </Link>
  );
}
