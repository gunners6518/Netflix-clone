import axios from "../../axios.ts";
import { requests } from "../../request.ts";
import { Movie } from "../../type.ts";
import { useQuery } from "react-query";
import { useContext, useEffect } from "react";
import { BannerDataContext } from "../../BannerDataContext.tsx";

export const useProps = () => {
  const { setMovie } = useContext(BannerDataContext);
  const fetchMovie = async () => {
    const request = await axios.get(requests.fetchNetflixOriginals);
    const randomIndex = Math.floor(
      Math.random() * request.data.results.length - 1,
    );
    const movieUrl = await axios.get(
      requests.fetchMovieVideos(request.data.results[randomIndex].id),
    );
    return {
      movieData: request.data.results[randomIndex] as Movie,
      movieUrl: movieUrl.data.results[0]?.key,
    };
  };

  const { data } = useQuery("movie", fetchMovie);

  useEffect(() => {
    if (data) {
      setMovie(data.movieData);
    }
  }, [data]);

  // descriptionの切り捨てよう関数
  const truncate = (str: string | undefined, n: number): string => {
    if (!str) {
      return "";
    }
    if (str.length > n) {
      return str.substr(0, n - 1) + "...";
    } else {
      return str;
    }
  };

  return {
    truncate,
  };
};
