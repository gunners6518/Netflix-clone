import YouTube from "react-youtube";
import { BannerDataContext } from "../../BannerDataContext.tsx";
import { useContext, useEffect, useRef } from "react";

type Props = {
  truncate: (str: string, n: number) => string;
};

type Options = {
  height: string;
  width: string;
  playerVars: {
    autoplay: 0 | 1 | undefined;
    controls: 0 | 1 | undefined;
    modestbranding: 0 | 1 | undefined;
    loop: 0 | 1 | undefined;
    fs: 0 | 1 | undefined;
    cc_load_policty: 0 | 1 | undefined;
    iv_load_policy: 3 | 1 | undefined;
    autohide: 0 | 1 | undefined;
    playlist: string | null;
  };
};
export const Layout = ({ truncate }: Props) => {
  const { trailerUrl, movie, isMuted } = useContext(BannerDataContext);
  const opts: Options = {
    height: "100%",
    width: "100%",
    playerVars: {
      autoplay: 1,
      controls: 0,
      modestbranding: 1,
      loop: 1,
      fs: 1,
      cc_load_policty: 0,
      iv_load_policy: 3,
      autohide: 1,
      playlist: trailerUrl,
    },
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null);

  const setPlayerVolume = () => {
    if (playerRef.current) {
      playerRef.current.setVolume(isMuted ? 0 : 100);
    }
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onPlayerReady = (event: { target: any }) => {
    playerRef.current = event.target;
    setPlayerVolume();
    playerRef.current.playVideo();
  };

  useEffect(() => {
    setPlayerVolume();
  }, [isMuted]);

  const image_url = "https://image.tmdb.org/t/p/original";

  return (
    <header
      className="text-white h-[672px] bg-cover bg-center bg-no-repeat"
      style={{
        position: "relative",
        overflow: "hidden",
        backgroundSize: "cover",
        backgroundPosition: "center center",
      }}
    >
      {trailerUrl ? (
        <YouTube
          videoId={trailerUrl}
          opts={opts}
          onReady={onPlayerReady}
          className="absolute top-0 left-0 z-n1 w-full h-full"
          style={{ pointerEvents: "none" }}
        />
      ) : (
        <img
          className="absolute top-0 left-0 z-n1 w-full h-full"
          src={`${image_url}${movie?.backdrop_path}`}
          alt={movie?.name}
        />
      )}
      <div className="relative z-10 ml-8 pt-36">
        <h1 className="text-4xl font-extrabold pb-1">{movie?.name}</h1>
        <div className="w-[45rem] font-extrabold leading-[1.3] pt-4 text-base max-w-[360px] h-[80px]">
          {movie && truncate(movie?.overview, 150)}
        </div>
      </div>
    </header>
  );
};
