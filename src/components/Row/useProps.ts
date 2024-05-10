import { useContext } from "react";
import axios from "../../axios";
import { useQuery } from "react-query";
import { Movie } from "../../type.ts";
import { requests } from "../../request.ts";
import { BannerDataContext } from "../../BannerDataContext.tsx";

export const useProps = (fetchUrl: string, title: string) => {
  const { setTrailerUrl, setMovie } = useContext(BannerDataContext);

  const fetchData = async () => {
    const request = await axios.get(fetchUrl);
    return request.data.results.slice(0, 10).map((movie: Movie) => ({
      id: movie.id,
      name: movie.name,
      poster_path: movie.poster_path,
      backdrop_path: movie.backdrop_path,
      overview: movie.overview,
    }));
  };

  const { data: movies, isLoading } = useQuery(`${title}/movies`, fetchData);

  const handleClick = async (movie: Movie) => {
    const moviePlayUrl = await axios.get(requests.fetchMovieVideos(movie.id));
    setTrailerUrl(moviePlayUrl.data.results[0]?.key);
    setMovie(movie);
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  return {
    movies,
    handleClick,
    isLoading,
  };
};
