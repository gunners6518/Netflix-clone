import { Suspense } from "react";
import { Header } from "./components/Header";
import { Banner } from "./components/Banner";
import { MovieRow } from "./components/MovieRow";
import { RowSkeleton } from "./components/RowSkeleton";
import { fetchRandomMovie, getMovieCategories } from "@/lib/tmdb";

export default async function HomePage() {
  const bannerMovie = await fetchRandomMovie();
  const movieCategories = getMovieCategories();

  return (
    <div className="App">
      <Header />
      <Banner movie={bannerMovie} />
      {movieCategories.map((category) => (
        <Suspense key={category.title} fallback={<RowSkeleton />}>
          <MovieRow category={category} />
        </Suspense>
      ))}
    </div>
  );
}

