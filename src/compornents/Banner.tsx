import { request } from "https";
import React, { useState, useEffect } from "react";
import axios from "./../axios";
import { requests } from "./../request";

type Props = {
  className?: string;
};

type movieProps = [];

export const Banner = () => {
  const [movie, setMovie] = useState<movieProps>([]);
  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(requests.feachNetflixOriginals);
      setMovie(
        request.data.results[
          Math.floor(Math.random() * request.data.results.length)
        ]
      );
      return request;
    }
    fetchData();
  }, []);
  console.log(movie);

  return (
    <header className="Banner">
      <div className="Banner-contents">
        {/* <h1>{movie?.title || movie?.name || movie?.orignal_name}</h1> */}
      </div>
    </header>
  );
};
