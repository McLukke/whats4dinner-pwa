"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") return null;

  if (session) {
    return (
      <button
        onClick={() => signOut()}
        className="shrink-0 text-xs font-medium px-3 py-1.5 rounded-full bg-neutral-200 text-neutral-700 active:bg-neutral-300 transition-colors"
      >
        Sign out
      </button>
    );
  }

  return (
    <button
      onClick={() => signIn("google")}
      className="shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-800 text-white active:bg-slate-700 transition-colors"
    >
      Sign in with Google
    </button>
  );
}
