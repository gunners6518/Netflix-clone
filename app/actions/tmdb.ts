"use server";

function getApiKey() {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    throw new Error("TMDB_API_KEY is not set");
  }
  return apiKey;
}

export async function fetchMovieVideos(movieId: string) {
  const API_KEY = getApiKey();

  // まずTVシリーズとして試す
  let response = await fetch(
    `https://api.themoviedb.org/3/tv/${movieId}/videos?api_key=${API_KEY}`,
    {
      next: { revalidate: 3600 },
    }
  );

  // TVシリーズで見つからない場合は映画として試す
  if (!response.ok) {
    response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}`,
      {
        next: { revalidate: 3600 },
      }
    );
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch videos: ${response.statusText}`);
  }

  const data = await response.json();
  
  // トレイラーを優先的に探す
  const trailer = data.results?.find(
    (video: any) => 
      video.type === "Trailer" && 
      video.site === "YouTube" &&
      (video.name?.toLowerCase().includes("trailer") || 
       video.name?.toLowerCase().includes("トレイラー") ||
       video.name?.toLowerCase().includes("予告"))
  );
  
  // トレイラーが見つからない場合は、YouTubeのTrailerタイプを探す
  const youtubeTrailer = data.results?.find(
    (video: any) => video.type === "Trailer" && video.site === "YouTube"
  );
  
  // それでも見つからない場合は、最初のYouTube動画を返す
  const youtubeVideo = data.results?.find(
    (video: any) => video.site === "YouTube"
  );
  
  return trailer?.key || youtubeTrailer?.key || youtubeVideo?.key || null;
}

