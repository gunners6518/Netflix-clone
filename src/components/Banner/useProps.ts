import { useEffect, useState } from "react";
import axios from "../../axios";
import { requests } from "../../request.ts";
import { Movie } from "../../type.ts";

export const useProps = () => {
  const [movie, setMovie] = useState<Movie>();
  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(requests.fetchNetflixOriginals);

      //apiからランダムで値を取得している
      setMovie(
        request.data.results[
          Math.floor(Math.random() * request.data.results.length - 1)
        ],
      );
    }
    fetchData();
  }, []);

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
    movie,
    truncate,
  };
};
