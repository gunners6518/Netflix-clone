import React, { useState, useEffect } from "react";
import YouTube from "react-youtube";
import "./Row.scss";

const base_url = "https://image.tmdb.org/t/p/original";

type Props = {
  title: string;
  requests: any;
  isLargeRow?: boolean;
};

type Movie = {
  id: string;
  name: string;
  title: string;
  original_name: string;
  poster_path: string;
  backdrop_path: string;
};

//trailerのoption
type Options = {
  height: string;
  width: string;
  playerVars: {
    autoplay: 0 | 1 | undefined;
  };
};

export const Row = ({ title, requests, isLargeRow }: Props) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [trailerUrl, setTrailerUrl] = useState<string | null>("");

  //urlが更新される度に
  useEffect(() => {
    console.log(requests.data.results);
    setMovies(requests.data.results);
  }, []);

  const opts: Options = {
    height: "390",
    width: "640",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };

  // const handleClick = async (movie: Movie) => {
  //   // if (trailerUrl) {
  //     setTrailerUrl("");
  //   } else {
  //     let trailerurl = await axios.get(
  //       `/movie/${movie.id}/videos?api_key=fb34530271b349314af0de263d16ab5a`
  //     );
  //     setTrailerUrl(trailerurl.data.results[0]?.key);
  //   }
  //     movieTrailer(movie?.name || movie?.title || movie?.original_name || "")
  //       .then((url: string) => {
  //         const urlParams = new URLSearchParams(new URL(url).search);
  //         setTrailerUrl(urlParams.get("v"));
  //       })
  //       .catch((error: any) => console.log(error.message));
  //   }
  // };

  return (
    <div className="Row">
      <h2>{title}</h2>
      <div className="Row-posters">
        {/* ポスターコンテンツ */}
        {movies.map((movie, i) => (
          <img
            key={movie.id}
            className={`Row-poster ${isLargeRow && "Row-poster-large"}`}
            src={`${base_url}${
              isLargeRow ? movie.poster_path : movie.backdrop_path
            }`}
            alt={movie.name}
            // onClick={() => handleClick(movie)}
          />
        ))}
      </div>
      {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
    </div>
  );
};
