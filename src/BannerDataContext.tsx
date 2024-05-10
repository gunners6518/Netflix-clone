import React, { useState, ReactNode } from "react";
import { Movie } from "./type.ts";

type TrailerUrlContextType = {
  trailerUrl: string | null;
  setTrailerUrl: React.Dispatch<React.SetStateAction<string | null>>;
  movie: Movie | null;
  setMovie: React.Dispatch<React.SetStateAction<Movie | null>>;
  isMuted: boolean;
  setIsMuted: React.Dispatch<React.SetStateAction<boolean>>;
};

export const BannerDataContext = React.createContext<TrailerUrlContextType>({
  trailerUrl: null,
  setTrailerUrl: () => {},
  movie: {} as Movie,
  setMovie: () => {},
  isMuted: false,
  setIsMuted: () => {},
});

type BannerDataProviderProps = {
  children: ReactNode;
};

export const BannerDataProvider: React.FC<BannerDataProviderProps> = ({
  children,
}) => {
  const [trailerUrl, setTrailerUrl] = useState<string | null>(null);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  return (
    <BannerDataContext.Provider
      value={{
        trailerUrl,
        movie,
        setTrailerUrl,
        setMovie,
        isMuted,
        setIsMuted,
      }}
    >
      {children}
    </BannerDataContext.Provider>
  );
};
