import type { Metadata } from "next";
import { Suspense } from "react";
import { SolutionsClient } from "@/app/solutions/SolutionsClient";
import { getProductsRuntime } from "@/lib/runtimeContent";

export const metadata: Metadata = {
  title: "Solutions",
  description: "Explore Maxgreen Mobility electric vehicle solutions and technical specifications.",
};

export const dynamic = "force-dynamic";

export default async function SolutionsPage() {
  const products = await getProductsRuntime();
  return (
    <Suspense fallback={<div className="py-16 text-center text-sm text-muted">Loading…</div>}>
      <SolutionsClient products={products} />
    </Suspense>
  );
}

