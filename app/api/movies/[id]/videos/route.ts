import { fetchMovieVideos } from "@/lib/actions/tmdb";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const key = await fetchMovieVideos(id);
    return NextResponse.json({ key });
  } catch (error) {
    console.error("Error fetching movie videos:", error);
    return NextResponse.json(
      { error: "Failed to fetch movie videos" },
      { status: 500 }
    );
  }
}

