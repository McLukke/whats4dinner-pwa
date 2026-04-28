"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

export function useFavorites() {
  const { data: session } = useSession();
  const [favoriteIds, setFavoriteIds] = useState(new Set());

  useEffect(() => {
    if (!session?.user?.id) {
      setFavoriteIds(new Set());
      return;
    }
    fetch("/api/favorites?idsOnly=true")
      .then((r) => r.json())
      .then((ids) => setFavoriteIds(new Set(ids)))
      .catch(() => {});
  }, [session?.user?.id]);

  const toggle = useCallback(
    async (recipeId) => {
      if (!session?.user?.id) return;
      const id = String(recipeId);
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
      try {
        const res = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ recipeId: id }),
        });
        const data = await res.json();
        setFavoriteIds(new Set(data.favorites));
      } catch {
        setFavoriteIds((prev) => {
          const next = new Set(prev);
          if (next.has(id)) next.delete(id);
          else next.add(id);
          return next;
        });
      }
    },
    [session?.user?.id]
  );

  const isFavorited = useCallback((id) => favoriteIds.has(String(id)), [favoriteIds]);

  return { favoriteIds, toggle, isFavorited, isSignedIn: Boolean(session?.user?.id) };
}
