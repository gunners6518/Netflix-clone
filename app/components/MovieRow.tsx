import { Row } from "./Row";
import { fetchMovies, type MovieCategory } from "@/lib/tmdb";

type MovieRowProps = {
  category: MovieCategory;
};

export async function MovieRow({ category }: MovieRowProps) {
  const movies = await fetchMovies(category.url);
  return (
    <Row
      title={category.title}
      movies={movies}
      isLargeRow={category.isLargeRow}
    />
  );
}

