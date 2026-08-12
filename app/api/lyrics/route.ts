import { NextRequest, NextResponse } from "next/server";
import { getLyrics } from "@/lib/jiosaavn";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const id = searchParams.get("id")?.trim() ?? "";

  if (!id) {
    return NextResponse.json(
      { success: false, message: "id is required" },
      { status: 400 },
    );
  }

  try {
    const data = await getLyrics(id);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Failed to fetch lyrics:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch lyrics" },
      { status: 502 },
    );
  }
}