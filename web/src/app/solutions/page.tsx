import type { Metadata } from "next";
import { Suspense } from "react";
import { SolutionsClient } from "@/app/solutions/SolutionsClient";
import { getProductsRuntime, getSiteRuntime } from "@/lib/runtimeContent";

export const metadata: Metadata = {
  title: "Solutions",
  description: "Explore Maxgreen Mobility electric vehicle solutions and technical specifications.",
};

export const dynamic = "force-dynamic";

export default async function SolutionsPage() {
  const [productsAll, site] = await Promise.all([getProductsRuntime(), getSiteRuntime()]);

  // Single source of truth:
  // Whatever products you add/remove on Home (`site.home.products.items`) will also appear here.
  const homeIds = new Set(
    (site.home.products.items ?? [])
      .map((it) => {
        try {
          const href = it?.href ?? "";
          const q = href.includes("?") ? href.slice(href.indexOf("?") + 1) : "";
          const product = new URLSearchParams(q).get("product");
          return product || null;
        } catch {
          return null;
        }
      })
      .filter((x): x is string => Boolean(x))
  );

  const products = homeIds.size ? productsAll.filter((p) => homeIds.has(p.id)) : productsAll;
  return (
    <Suspense fallback={<div className="py-16 text-center text-sm text-muted">Loading…</div>}>
      <SolutionsClient products={products} />
    </Suspense>
  );
}

