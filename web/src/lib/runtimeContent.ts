import "server-only";

import path from "path";
import { readFile, readdir } from "fs/promises";
import { unstable_noStore as noStore } from "next/cache";
import type { Product, SiteConfig } from "@/lib/site";

async function readJson<T>(absPath: string): Promise<T> {
  const raw = await readFile(absPath, "utf8");
  return JSON.parse(raw) as T;
}

export async function getSiteRuntime(): Promise<SiteConfig> {
  // Ensure we read from disk each request in dev/admin flows.
  noStore();
  const filePath = path.join(process.cwd(), "content", "site.json");
  return await readJson<SiteConfig>(filePath);
}

export async function getProductsRuntime(): Promise<Product[]> {
  noStore();
  const dir = path.join(process.cwd(), "content", "products");
  const files = (await readdir(dir)).filter((f) => f.endsWith(".json")).sort();
  const products: Product[] = [];
  for (const f of files) {
    try {
      products.push(await readJson<Product>(path.join(dir, f)));
    } catch {
      // ignore
    }
  }
  return products;
}

