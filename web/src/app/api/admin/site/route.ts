import { NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/adminAuth";
import type { SiteConfig } from "@/lib/site";
import { getSiteRuntime } from "@/lib/runtimeContent";
import path from "path";
import { writeFile } from "fs/promises";
import { commitTextFile, githubEnabled, toRepoContentPath } from "@/lib/githubContent";

export async function GET() {
  if (!(await isAdminAuthed())) return new NextResponse("Unauthorized", { status: 401 });
  // Read latest from disk (avoid stale static import caching).
  const site = await getSiteRuntime();
  return NextResponse.json(site);
}

export async function POST(req: Request) {
  if (!(await isAdminAuthed())) return new NextResponse("Unauthorized", { status: 401 });
  const site = (await req.json()) as SiteConfig;

  try {
    // Strip any accidental top-level keys like "brand.name" introduced by faulty editors.
    const cleaned = Object.fromEntries(
      Object.entries(site as unknown as Record<string, unknown>).filter(([k]) => !k.includes("."))
    ) as unknown as SiteConfig;

    const text = JSON.stringify(cleaned, null, 2) + "\n";

    if (githubEnabled()) {
      const repoPath = toRepoContentPath("content/site.json");
      const result = await commitTextFile({
        repoPath,
        text,
        message: `Admin: update site config (${new Date().toISOString()})`,
      });
      return NextResponse.json({ persisted: "github", ...result });
    }

    // Local-dev persistence: write back into the repo file.
    // Note: On Vercel, filesystem writes are not guaranteed to persist unless using GitHub persistence above.
    const filePath = path.join(process.cwd(), "content", "site.json");
    await writeFile(filePath, text, "utf8");
    return NextResponse.json({ ok: true, persisted: "fs" });
  } catch (e) {
    return new NextResponse(`Failed to save on server: ${String(e)}`, { status: 500 });
  }
}

