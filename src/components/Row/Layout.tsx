import { Movie } from "../../type.ts";

export type Props = {
  title: string;
  fetchUrl: string;
};

type LayoutProps = {
  title: string;
  movies: Movie[];
  handleClick: (movie: Movie) => void;
  isLoading: boolean;
};

export const Layout = ({
  title,
  movies,
  handleClick,
  isLoading,
}: LayoutProps) => {
  const image_url = "https://image.tmdb.org/t/p/original";
  return (
    <div className="ml-5 text-white">
      <h2>{title}</h2>
      <div className="flex overflow-y-hidden overflow-x-scroll p-5 scrollbar-hide">
        {!isLoading &&
          movies.map((movie) => (
            <img
              key={movie.id}
              className="object-contain w-full max-h-36 m-2 transform transition-transform duration-450"
              src={`${image_url}${movie.backdrop_path}`}
              onClick={() => handleClick(movie)}
              alt={movie.name}
            />
          ))}
      </div>
    </div>
  );
};
