"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Search, X, Zap, Heart } from "lucide-react";
import { useSession } from "next-auth/react";
import RecipeCard from "./RecipeCard";
import { useFavorites } from "@/hooks/useFavorites";

const CUISINES = ["Chinese", "Korean", "Taiwanese", "Japanese", "Thai", "Vietnamese"];

export default function SearchAndFilter() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const urlQ = searchParams.get("q") ?? "";
  const urlFilter = searchParams.get("filter") ?? "";
  const urlQuick = searchParams.get("quick") === "true";
  const urlBaking = searchParams.get("baking") === "true";
  const urlFavorites = searchParams.get("favorites") === "true";
  const isActive = Boolean(urlQ || urlFilter || urlQuick || urlBaking || urlFavorites);

  const activeCuisines = new Set(
    urlFilter ? urlFilter.split(",").map((c) => c.trim()).filter(Boolean) : []
  );

  const [inputValue, setInputValue] = useState(urlQ);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const { isFavorited, toggle: toggleFavorite, isSignedIn } = useFavorites();

  const debounceRef = useRef(null);
  const scrollSaveRef = useRef(null);
  const searchParamsRef = useRef(searchParams);
  const pathnameRef = useRef(pathname);
  searchParamsRef.current = searchParams;
  pathnameRef.current = pathname;

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  }, []);

  useEffect(() => {
    const save = () => {
      clearTimeout(scrollSaveRef.current);
      scrollSaveRef.current = setTimeout(() => {
        const key = `scroll:${searchParamsRef.current.toString()}`;
        sessionStorage.setItem(key, String(Math.round(window.scrollY)));
      }, 150);
    };
    window.addEventListener('scroll', save, { passive: true });
    return () => {
      clearTimeout(scrollSaveRef.current);
      window.removeEventListener('scroll', save);
    };
  }, []);

  useEffect(() => {
    if (!results) return;
    const key = `scroll:${searchParamsRef.current.toString()}`;
    const saved = sessionStorage.getItem(key);
    window.scrollTo({ top: saved ? parseInt(saved, 10) : 0, behavior: 'instant' });
  }, [results]);

  useEffect(() => {
    setInputValue(searchParams.get("q") ?? "");
  }, [searchParams]);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const sp = searchParamsRef.current;
      const pn = pathnameRef.current;
      const trimmed = inputValue.trim();
      if (trimmed === (sp.get("q") ?? "")) return;
      const next = new URLSearchParams(sp.toString());
      if (trimmed) next.set("q", trimmed);
      else next.delete("q");
      const qs = next.toString();
      router.replace(qs ? `${pn}?${qs}` : pn, { scroll: false });
    }, 300);
    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue]);

  useEffect(() => {
    const q = searchParams.get("q")?.trim();
    const filter = searchParams.get("filter");
    const quick = searchParams.get("quick") === "true";
    const baking = searchParams.get("baking") === "true";
    const favorites = searchParams.get("favorites") === "true";

    if (!q && !filter && !quick && !baking && !favorites) {
      setResults(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    if (favorites) {
      fetch("/api/favorites")
        .then((r) => r.json())
        .then((data) => { if (!cancelled) { setResults(data); setLoading(false); } })
        .catch(() => { if (!cancelled) setLoading(false); });
    } else {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (filter) params.set("cuisine", filter);
      if (quick) params.set("quick", "true");
      params.set("baking", baking ? "true" : "false");

      fetch(`/api/search?${params}`)
        .then((r) => r.json())
        .then((data) => { if (!cancelled) { setResults(data); setLoading(false); } })
        .catch(() => { if (!cancelled) setLoading(false); });
    }

    return () => { cancelled = true; };
  }, [searchParams]);

  const toggleCuisine = useCallback((c) => {
    const sp = searchParamsRef.current;
    const pn = pathnameRef.current;
    const current = sp.get("filter") ?? "";
    const set = new Set(current ? current.split(",").map((x) => x.trim()).filter(Boolean) : []);
    if (set.has(c)) set.delete(c);
    else set.add(c);
    const next = new URLSearchParams(sp.toString());
    const filterStr = [...set].join(",");
    if (filterStr) next.set("filter", filterStr);
    else next.delete("filter");
    const qs = next.toString();
    router.replace(qs ? `${pn}?${qs}` : pn, { scroll: false });
  }, [router]);

  const toggleQuick = useCallback(() => {
    const sp = searchParamsRef.current;
    const pn = pathnameRef.current;
    const next = new URLSearchParams(sp.toString());
    if (sp.get("quick") === "true") next.delete("quick");
    else next.set("quick", "true");
    const qs = next.toString();
    router.replace(qs ? `${pn}?${qs}` : pn, { scroll: false });
  }, [router]);

  const toggleBaking = useCallback(() => {
    const sp = searchParamsRef.current;
    const pn = pathnameRef.current;
    const next = new URLSearchParams(sp.toString());
    if (sp.get("baking") === "true") next.delete("baking");
    else next.set("baking", "true");
    const qs = next.toString();
    router.replace(qs ? `${pn}?${qs}` : pn, { scroll: false });
  }, [router]);

  const toggleFavoritesFilter = useCallback(() => {
    const sp = searchParamsRef.current;
    const pn = pathnameRef.current;
    const next = new URLSearchParams(sp.toString());
    if (sp.get("favorites") === "true") next.delete("favorites");
    else next.set("favorites", "true");
    const qs = next.toString();
    router.replace(qs ? `${pn}?${qs}` : pn, { scroll: false });
  }, [router]);

  const clearSearch = useCallback(() => {
    setInputValue("");
    const sp = searchParamsRef.current;
    const pn = pathnameRef.current;
    const next = new URLSearchParams(sp.toString());
    next.delete("q");
    const qs = next.toString();
    router.replace(qs ? `${pn}?${qs}` : pn, { scroll: false });
  }, [router]);

  return (
    <div className="flex flex-col gap-3">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
        <input
          type="search"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search by dish or ingredient…"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          className="w-full pl-10 pr-10 py-3 rounded-2xl border border-neutral-200 bg-white text-sm text-neutral-900 placeholder:text-neutral-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-800/25 transition [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none"
        />
        {inputValue && (
          <button
            onClick={clearSearch}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-neutral-100 transition"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5 text-neutral-400" />
          </button>
        )}
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-4 px-4">
        {/* Baking mode toggle */}
        <button
          onClick={toggleBaking}
          className={`shrink-0 text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-colors ${
            urlBaking
              ? "bg-amber-800 border-amber-800 text-white"
              : "bg-white border-neutral-300 text-neutral-500 active:bg-neutral-50"
          }`}
        >
          Baking
        </button>
        <span className="shrink-0 self-center w-px h-4 bg-neutral-200" aria-hidden="true" />
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
          onClick={toggleQuick}
          className={`shrink-0 flex items-center gap-1 text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-colors ${
            urlQuick
              ? "bg-green-600 border-green-600 text-white"
              : "bg-white border-neutral-200 text-neutral-600 active:bg-neutral-50"
          }`}
        >
          <Zap className="w-3 h-3" />
          &lt; 20 Mins
        </button>
        {isSignedIn && (
          <button
            onClick={toggleFavoritesFilter}
            className={`shrink-0 flex items-center gap-1 text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-colors ${
              urlFavorites
                ? "bg-rose-500 border-rose-500 text-white"
                : "bg-white border-neutral-200 text-neutral-600 active:bg-neutral-50"
            }`}
          >
            <Heart className={`w-3 h-3 ${urlFavorites ? "fill-white" : ""}`} />
            Favorites
          </button>
        )}
      </div>

      {/* Results area */}
      <div className="flex flex-col gap-4 mt-1">
        {!isActive && (
          <p className="text-center text-sm text-neutral-400 py-12">
            Search for a recipe to begin
          </p>
        )}

        {isActive && loading && (
          <p className="text-center text-sm text-neutral-400 py-12">Searching…</p>
        )}

        {isActive && !loading && results?.length === 0 && (
          <p className="text-center text-sm text-neutral-400 py-12">
            {urlFavorites
              ? "No favorites yet — heart a recipe to save it here."
              : "Nothing in the fridge matches that — try adding more ingredients!"}
          </p>
        )}

        {isActive && !loading && results?.map((recipe) => (
          <RecipeCard
            key={recipe._id}
            recipe={recipe}
            isFavorited={isFavorited(recipe._id)}
            onToggleFavorite={isSignedIn ? toggleFavorite : undefined}
          />
        ))}
      </div>
    </div>
  );
}
