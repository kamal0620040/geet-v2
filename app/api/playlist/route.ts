import { NextRequest, NextResponse } from "next/server";
import { getPlaylist } from "@/lib/jiosaavn";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const id = searchParams.get("id")?.trim() ?? "";
  const limit = Math.min(
    Math.max(Number(searchParams.get("limit")) || 50, 1),
    100,
  );
  const page = Math.max(Number(searchParams.get("page")) || 0, 0);

  if (!id) {
    return NextResponse.json(
      { success: false, message: "id is required" },
      { status: 400 },
    );
  }

  try {
    const data = await getPlaylist({ id, page, limit });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Failed to fetch playlist:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch playlist" },
      { status: 502 },
    );
  }
}