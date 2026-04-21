"use client";

import { useState } from "react";
import { useWakeLock } from "@/hooks/useWakeLock";
import MediaGallery from "@/components/MediaGallery";
import { ArrowLeft, Check } from "lucide-react";
import { useRouter } from "next/navigation";

// ---------- ingredient helpers ----------

function IngredientRow({ item, done, onToggle }) {
  const isString = typeof item === "string";
  const qty = !isString && [item.quantity, item.unit].filter(Boolean).join(" ");
  const name = isString ? item : (item.name ?? "");
  const notes = !isString && item.notes;

  return (
    <li
      onClick={onToggle}
      className={`flex items-start gap-3 min-h-[48px] px-3 py-2.5 rounded-xl cursor-pointer select-none active:scale-[0.98] transition-all ${
        done ? "bg-neutral-100 text-neutral-400" : "bg-white text-neutral-800 shadow-sm"
      }`}
    >
      <span
        className={`mt-0.5 shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
          done ? "bg-green-500 border-green-500" : "border-neutral-300"
        }`}
      >
        {done && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
      </span>
      <span className={`text-base leading-snug flex-1 ${done ? "line-through" : ""}`}>
        {qty && <span className="font-bold">{qty} </span>}
        {name}
        {notes && (
          <span className="block text-sm italic text-neutral-500 mt-0.5 font-normal not-italic">
            {notes}
          </span>
        )}
      </span>
    </li>
  );
}

function IngredientList({ ingredients, crossed, onToggle }) {
  const nodes = [];
  let rowIndex = 0;
  let lastGroup = null;

  for (let i = 0; i < ingredients.length; i++) {
    const item = ingredients[i];
    const group = typeof item === "object" && item !== null ? (item.group ?? null) : null;

    if (group && group !== lastGroup) {
      nodes.push(
        <li key={`grp-${i}`} className={`px-1 pb-0.5 ${nodes.length > 0 ? "pt-4" : "pt-0"}`}>
          <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">
            {group}
          </span>
        </li>
      );
      lastGroup = group;
    }

    const idx = rowIndex++;
    const done = crossed.has(idx);
    nodes.push(
      <IngredientRow
        key={`ing-${i}`}
        item={item}
        done={done}
        onToggle={() => onToggle(idx)}
      />
    );
  }

  return <ul className="flex flex-col gap-1.5">{nodes}</ul>;
}

// ---------- badge helpers ----------

const DIFFICULTY_STYLES = {
  easy: "bg-green-100 text-green-800",
  medium: "bg-amber-100 text-amber-800",
  hard: "bg-red-100 text-red-800",
};

// ---------- main component ----------

export default function RecipeDetailClient({ recipe }) {
  useWakeLock(true);
  const router = useRouter();
  const [crossed, setCrossed] = useState(new Set());

  const toggleIngredient = (i) => {
    setCrossed((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  // prefer instructions; fall back to legacy steps field
  const steps = recipe.instructions?.length ? recipe.instructions : (recipe.steps ?? []);

  const difficultyKey = recipe.difficulty?.toLowerCase();
  const difficultyStyle = DIFFICULTY_STYLES[difficultyKey] ?? "bg-neutral-200 text-neutral-700";

  const hasIngredients = recipe.ingredients?.length > 0;
  const hasSteps = steps.length > 0;
  const isProcessing = !hasIngredients && !hasSteps;

  return (
    <main className="min-h-screen bg-[#f8f9fa] pb-12">
      <header className="sticky top-0 z-10 bg-[#f8f9fa] border-b border-neutral-200 px-4 py-4 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 -ml-2 rounded-xl active:bg-neutral-200 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-6 h-6 text-neutral-700" />
        </button>
        <div className="flex flex-col min-w-0">
          <h1 className="text-lg font-bold text-neutral-900 leading-tight line-clamp-1">
            {recipe.title}
          </h1>
          {recipe.asianName && (
            <span className="text-sm text-neutral-500 leading-tight line-clamp-1">
              {recipe.asianName}
            </span>
          )}
        </div>
      </header>

      <div className="pt-4 px-4 max-w-lg mx-auto flex flex-col gap-5">
        <MediaGallery images={recipe.images || []} videoUrl={recipe.videoUrl} />

        {/* Cuisine + Difficulty badges */}
        <div className="flex items-center gap-2 flex-wrap">
          {recipe.cuisine && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-100 uppercase tracking-wide">
              {recipe.cuisine}
            </span>
          )}
          {recipe.difficulty && (
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide ${difficultyStyle}`}>
              {recipe.difficulty}
            </span>
          )}
        </div>

        {recipe.description && (
          <p className="text-base text-neutral-700 leading-relaxed">
            {recipe.description}
          </p>
        )}

        {/* Processing fallback */}
        {isProcessing && (
          <p className="text-sm text-neutral-400 italic text-center py-8">
            Recipe details are still being processed by the scraper…
          </p>
        )}

        {/* Ingredients */}
        {hasIngredients && (
          <section>
            <h2 className="text-lg font-semibold text-neutral-900 mb-3">Ingredients</h2>
            <IngredientList
              ingredients={recipe.ingredients}
              crossed={crossed}
              onToggle={toggleIngredient}
            />
          </section>
        )}

        {/* Instructions */}
        {hasSteps && (
          <section>
            <h2 className="text-lg font-semibold text-neutral-900 mb-3">Instructions</h2>
            <ol className="flex flex-col gap-5">
              {steps.map((step, i) => (
                <li key={i} className="flex gap-4">
                  <span className="shrink-0 w-9 h-9 rounded-full bg-neutral-900 text-white text-base font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <p className="text-xl font-sans font-medium text-neutral-900 leading-relaxed pt-1">
                    {step}
                  </p>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* Bottom tags */}
        {(recipe.tags?.length > 0 || recipe.sourceSite) && (
          <section className="pt-2 border-t border-neutral-200">
            <div className="flex flex-wrap gap-1.5">
              {recipe.sourceSite && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-200 text-neutral-600">
                  {recipe.sourceSite}
                </span>
              )}
              {recipe.tags?.map((tag, i) => (
                <span
                  key={i}
                  className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-500"
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
