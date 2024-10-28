import { useProps } from "./useProps";
import { Layout } from "./Layout";

export const Banner = () => {
    const { movie, truncate } = useProps();
    const newMovie = {
      id: "1",
      name: "Test",
      poster_path: "/Test.jpg",
      backdrop_path: "/Test.jpg",
      overview: "Test",

    };
    return <Layout movie={movie} truncate={truncate} />;
  };
