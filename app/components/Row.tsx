import type { Movie } from "@/lib/tmdb";
import { RowClient } from "./RowClient";

type RowProps = {
  title: string;
  movies: Movie[];
  isLargeRow?: boolean;
};

export function Row({ title, movies, isLargeRow }: RowProps) {
  return <RowClient title={title} movies={movies} isLargeRow={isLargeRow} />;
}

