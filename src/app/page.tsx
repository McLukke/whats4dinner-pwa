import { Suspense } from "react";
import SearchAndFilter from "@/components/SearchAndFilter";
import AuthButton from "@/components/AuthButton";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f8f9fa]">
      <header className="sticky top-0 z-10 bg-[#f8f9fa] border-b border-neutral-200 px-4 pt-4 pb-3 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            What&apos;s 4 Dinner?
          </h1>
          <p className="text-sm text-neutral-500 mt-0.5">Discover your next meal</p>
        </div>
        <div className="pt-1">
          <AuthButton />
        </div>
      </header>

      <div className="px-4 pt-4 pb-8 max-w-lg mx-auto">
        <Suspense>
          <SearchAndFilter />
        </Suspense>
      </div>
    </main>
  );
}
