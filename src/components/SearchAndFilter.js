"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, Zap } from "lucide-react";
import RecipeCard from "./RecipeCard";

const CUISINES = ["Chinese", "Korean", "Taiwanese", "Japanese", "Thai", "Vietnamese"];

export default function SearchAndFilter({ initialRecipes }) {
  const [query, setQuery] = useState("");
  const [activeCuisines, setActiveCuisines] = useState(new Set());
  const [quickFilter, setQuickFilter] = useState(false);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  const isFiltering = Boolean(query.trim() || activeCuisines.size > 0 || quickFilter);
  const displayed = isFiltering ? (results ?? []) : initialRecipes;

  const toggleCuisine = (c) => {
    setActiveCuisines((prev) => {
      const next = new Set(prev);
      if (next.has(c)) next.delete(c);
      else next.add(c);
      return next;
    });
  };

  useEffect(() => {
    if (!isFiltering) {
      setResults(null);
      return;
    }

    setLoading(true);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const params = new URLSearchParams();
        if (query.trim()) params.set("q", query.trim());
        if (activeCuisines.size > 0) params.set("cuisine", [...activeCuisines].join(","));
        if (quickFilter) params.set("quick", "true");

        const res = await fetch(`/api/search?${params}`);
        const data = await res.json();
        setResults(data);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [query, activeCuisines, quickFilter, isFiltering]);

  return (
    <div className="flex flex-col gap-3">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by dish or ingredient…"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          className="w-full pl-10 pr-10 py-3 rounded-2xl border border-neutral-200 bg-white text-sm text-neutral-900 placeholder:text-neutral-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-800/25 transition [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-neutral-100 transition"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5 text-neutral-400" />
          </button>
        )}
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-4 px-4">
        {CUISINES.map((c) => (
          <button
            key={c}
            onClick={() => toggleCuisine(c)}
            className={`shrink-0 text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-colors ${
              activeCuisines.has(c)
                ? "bg-slate-800 border-slate-800 text-white"
                : "bg-white border-neutral-200 text-neutral-600 active:bg-neutral-50"
            }`}
          >
            {c}
          </button>
        ))}
        <button
          onClick={() => setQuickFilter((v) => !v)}
          className={`shrink-0 flex items-center gap-1 text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-colors ${
            quickFilter
              ? "bg-green-600 border-green-600 text-white"
              : "bg-white border-neutral-200 text-neutral-600 active:bg-neutral-50"
          }`}
        >
          <Zap className="w-3 h-3" />
          &lt; 20 Mins
        </button>
      </div>

      {/* Section label */}
      {!isFiltering && (
        <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 px-1 mt-1">
          Fresh Picks
        </p>
      )}

      {/* Recipe list */}
      <div className="flex flex-col gap-4">
        {loading && (
          <p className="text-center text-sm text-neutral-400 py-12">Searching…</p>
        )}

        {!loading && isFiltering && results?.length === 0 && (
          <p className="text-center text-sm text-neutral-400 py-12">
            Nothing in the fridge matches that — try adding more ingredients!
          </p>
        )}

        {!loading && displayed.map((recipe) => (
          <RecipeCard key={recipe._id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}
