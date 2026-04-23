import { NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/adminAuth";

export async function POST(req: Request) {
  if (!(await isAdminAuthed())) return new NextResponse("Unauthorized", { status: 401 });

  // Media uploads are intentionally disabled. Images/videos are controlled via code only.
  // (This avoids issues with S3 or non-persistent server filesystems.)
  return new NextResponse("Uploads are disabled. Please update media via code.", { status: 410 });
}

