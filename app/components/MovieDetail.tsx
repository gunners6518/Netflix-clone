import { fetchMovieById } from "@/lib/tmdb";
import { CloseModalButton } from "./CloseModalButton";
import { fetchMovieVideos } from "@/lib/actions/tmdb";

type MovieDetailProps = {
  movieId: string;
  isModal?: boolean;
};

export async function MovieDetail({ movieId, isModal = false }: MovieDetailProps) {
  const [movie, trailerKey] = await Promise.all([
    fetchMovieById(movieId),
    fetchMovieVideos(movieId),
  ]);

  if (!movie) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-white">Movie not found</p>
      </div>
    );
  }

  const imageUrl = "https://image.tmdb.org/t/p/original";

  return (
    <div
      className={`relative min-h-screen bg-black text-white ${
        isModal ? "fixed inset-0 z-50 overflow-y-auto" : ""
      }`}
    >
      {isModal && <CloseModalButton />}
      
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url("${imageUrl}${movie.backdrop_path}")`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black" />
      </div>

      <div className={`relative z-10 container mx-auto px-8 py-16 ${isModal ? "pt-20" : ""}`}>
        <div className="max-w-4xl">
          <div className="flex items-center gap-4 mb-6">
            <h1 className="text-5xl font-bold">{movie.name}</h1>
          </div>

          <p className="text-lg mb-8 leading-relaxed max-w-2xl">
            {movie.overview}
          </p>

          {trailerKey && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">トレイラー</h2>
              <div className="aspect-video max-w-4xl rounded-lg overflow-hidden">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${trailerKey}?autoplay=0&rel=0`}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {movie.poster_path && (
            <div className="mt-8">
              <img
                src={`${imageUrl}${movie.poster_path}`}
                alt={movie.name}
                className="max-w-xs rounded-lg shadow-2xl"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

