import Axios from "axios";
import React, { useState, useEffect } from "react";
import { readConfigFile } from "typescript";
import { requests } from "../request";
import axios from "./../axios";
import "./Row.scss";

const base_url = "https://image.tmdb.org/t/p/original";

type Props = {
  title: string;
  fetchUrl: string;
};

type Movie = {
  name: string;
  poster_path: string;
};

export const Row = ({ title, fetchUrl }: Props) => {
  const [movies, setMovies] = useState<Movie[]>([]);

  //urlが更新される度に
  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(fetchUrl);
      setMovies(request.data.results);
      return request;
    }
    fetchData();
  }, [fetchUrl]);

  console.log(movies);

  return (
    <div className="Row">
      <h2>{title}</h2>
      <div className="Row-posters">
        {/* ポスターコンテンツ */}
        {movies.map((movie, i) => (
          <img
            className="Row-poster"
            src={`${base_url}${movie.poster_path}`}
            alt={movie.name}
            key={i}
          />
        ))}
      </div>
    </div>
  );
};
