import type { Metadata } from "next";
import { Suspense } from "react";
import { SolutionsClient } from "@/app/solutions/SolutionsClient";

export const metadata: Metadata = {
  title: "Solutions",
  description: "Explore Maxgreen Mobility electric vehicle solutions and technical specifications.",
};

export default function SolutionsPage() {
  return (
    <Suspense fallback={<div className="py-16 text-center text-sm text-muted">Loading…</div>}>
      <SolutionsClient />
    </Suspense>
  );
}

