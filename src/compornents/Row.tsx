import Axios from "axios";
import React, { useState, useEffect } from "react";
import { readConfigFile } from "typescript";
import { requests } from "../request";
import axios from "./../axios";

type Props = {
  title: string;
  fetchUrl: string;
};

export const Row = ({ title, fetchUrl }: Props) => {
  const [movies, setMovies] = useState([]);

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
    <div>
      <h2>{title}</h2>
    </div>
  );
};
