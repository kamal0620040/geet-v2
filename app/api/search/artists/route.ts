import { NextRequest, NextResponse } from "next/server";
import { searchArtists } from "@/lib/jiosaavn";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const query = searchParams.get("query")?.trim() ?? "";
  const limit = Math.min(
    Math.max(Number(searchParams.get("limit")) || 10, 1),
    50,
  );
  const page = Math.max(Number(searchParams.get("page")) || 0, 0);

  if (!query) {
    return NextResponse.json(
      { success: false, message: "query is required" },
      { status: 400 },
    );
  }

  try {
    const data = await searchArtists({ query, page, limit });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Failed to search artists:", error);
    return NextResponse.json(
      { success: false, message: "Failed to search artists" },
      { status: 502 },
    );
  }
}