import { Row } from "./Row";
import { fetchMovies, type MovieCategory } from "@/lib/tmdb";
import { fetchMovieVideos } from "@/lib/actions/tmdb";

type MovieRowProps = {
  category: MovieCategory;
};

export async function MovieRow({ category }: MovieRowProps) {
  const movies = await fetchMovies(category.url);
  
  // トレイラーが取得できる映画のみをフィルタリング
  const moviesWithTrailers = await Promise.all(
    movies.map(async (movie) => {
      try {
        const trailerKey = await fetchMovieVideos(movie.id);
        return trailerKey ? movie : null;
      } catch {
        return null;
      }
    })
  );
  
  const filteredMovies = moviesWithTrailers.filter((movie): movie is typeof movie => movie !== null);
  
  if (filteredMovies.length === 0) {
    return null;
  }
  
  return (
    <Row
      title={category.title}
      movies={filteredMovies}
      isLargeRow={category.isLargeRow}
    />
  );
}

