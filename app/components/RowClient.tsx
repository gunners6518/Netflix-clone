"use client";

import { useState } from "react";
import Link from "next/link";
import type { Movie } from "@/lib/tmdb";
import { X } from "lucide-react";

type RowClientProps = {
  title: string;
  movies: Movie[];
  isLargeRow?: boolean;
};

export function RowClient({ title, movies, isLargeRow }: RowClientProps) {
  const [trailerUrl, setTrailerUrl] = useState<string | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleClick = async (movie: Movie, e: React.MouseEvent) => {
    e.preventDefault();
    
    // 同じ映画を再度クリックした場合は閉じる
    if (trailerUrl && selectedMovie?.id === movie.id) {
      setTrailerUrl(null);
      setSelectedMovie(null);
      return;
    }
    
    // 選択した映画を先に設定（ローディング状態を表示）
    const clickedMovieId = movie.id;
    setSelectedMovie(movie);
    setTrailerUrl(null); // リセット
    
    try {
      const response = await fetch(`/api/movies/${movie.id}/videos`);
      const data = await response.json();
      
      // クリックした映画と一致することを確認（非同期処理中に別の映画がクリックされた場合を防ぐ）
      if (data.key && clickedMovieId === movie.id) {
        setTrailerUrl(data.key);
      } else if (!data.key) {
        console.warn(`No trailer found for movie: ${movie.name} (ID: ${movie.id})`);
      }
    } catch (error) {
      console.error("Failed to fetch trailer:", error);
      // エラーが発生した場合も選択状態は維持（ユーザーが閉じられるように）
    }
  };

  const handleClose = () => {
    setTrailerUrl(null);
    setSelectedMovie(null);
  };

  const image_url = "https://image.tmdb.org/t/p/original";

  return (
    <div className="ml-5 text-white relative">
      <h2 className="text-xl md:text-2xl font-bold mb-4 px-5">{title}</h2>
      <div className="flex overflow-y-hidden overflow-x-scroll p-5 scrollbar-hide gap-2">
        {movies.map((movie) => (
          <div key={movie.id} className="flex-shrink-0 group relative">
            <Link 
              href={`/movie/${movie.id}`} 
              scroll={false}
              className="block"
            >
              <img
                className={`object-cover rounded transition-transform duration-300 cursor-pointer ${
                  isLargeRow 
                    ? "h-[300px] md:h-[450px] w-[200px] md:w-[300px] group-hover:scale-105" 
                    : "h-[150px] md:h-[200px] w-[250px] md:w-[350px] group-hover:scale-105"
                }`}
                src={`${image_url}${
                  isLargeRow ? movie.poster_path : movie.backdrop_path
                }`}
                alt={movie.name}
                onClick={(e) => handleClick(movie, e)}
              />
            </Link>
          </div>
        ))}
      </div>
      
      {/* 拡大表示とトレイラー */}
      {selectedMovie && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 md:p-8">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 md:top-8 md:right-8 z-10 text-white hover:text-gray-300 transition-colors"
            aria-label="Close"
          >
            <X className="h-8 w-8 md:h-10 md:w-10" />
          </button>
          
          <div className="w-full max-w-6xl relative">
            {/* 背景画像（拡大表示） */}
            <div
              className="absolute inset-0 bg-cover bg-center rounded-lg opacity-30"
              style={{
                backgroundImage: `url("${image_url}${selectedMovie.backdrop_path || selectedMovie.poster_path}")`,
              }}
            />
            
            {/* グラデーションオーバーレイ */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80 rounded-lg" />
            
            {/* コンテンツ */}
            <div className="relative z-10 p-6 md:p-12">
              {/* タイトル */}
              <h3 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6">
                {selectedMovie.name}
              </h3>
              
              {/* YouTubeトレイラー */}
              {trailerUrl ? (
                <div className="aspect-video w-full rounded-lg overflow-hidden shadow-2xl">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${trailerUrl}?autoplay=1&rel=0`}
                    title={`${selectedMovie.name} - トレイラー`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="aspect-video w-full rounded-lg overflow-hidden bg-gray-900 flex items-center justify-center">
                  <p className="text-gray-400">
                    {selectedMovie ? "トレイラーを読み込み中..." : "トレイラーが見つかりませんでした"}
                  </p>
                </div>
              )}
              
              {/* 説明 */}
              {selectedMovie.overview && (
                <p className="mt-4 md:mt-6 text-sm md:text-base text-gray-300 line-clamp-3">
                  {selectedMovie.overview}
                </p>
              )}
              
              {/* 詳細ページへのリンク */}
              <Link
                href={`/movie/${selectedMovie.id}`}
                className="inline-block mt-4 md:mt-6 px-6 py-2 bg-netflix-red hover:bg-netflix-red/90 text-white rounded font-semibold transition-colors"
                onClick={handleClose}
              >
                詳細を見る
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

