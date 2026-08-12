import { NextRequest, NextResponse } from "next/server";
import { getArtistById } from "@/lib/jiosaavn";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const id = searchParams.get("id")?.trim() ?? "";
  const limit = Math.min(
    Math.max(Number(searchParams.get("limit")) || 10, 1),
    50,
  );

  if (!id) {
    return NextResponse.json(
      { success: false, message: "id is required" },
      { status: 400 },
    );
  }

  try {
    const data = await getArtistById({ id, limit });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Failed to fetch artist:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch artist" },
      { status: 502 },
    );
  }
}