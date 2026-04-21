"use client";

import { useEffect, useRef } from "react";

/**
 * Requests a Screen Wake Lock for the lifetime of the component.
 * Automatically re-acquires if the page becomes visible again (e.g. tab switch).
 * Call with `enabled = false` to skip (e.g. on the home feed).
 */
export function useWakeLock(enabled = true) {
  const lockRef = useRef(null);

  useEffect(() => {
    if (!enabled || typeof navigator === "undefined" || !("wakeLock" in navigator)) return;

    const acquire = async () => {
      try {
        lockRef.current = await navigator.wakeLock.request("screen");
      } catch {
        // User denied or browser doesn't support — silently ignore
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") acquire();
    };

    acquire();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      lockRef.current?.release();
      lockRef.current = null;
    };
  }, [enabled]);
}
