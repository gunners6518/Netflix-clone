isLargeRowを削除

該当commit

やる事

isLargeRowを削除してRowコンポーネントの表示をすべて同じ大きさにする

チュートリアル終了後はNetlflix OriginalのRow部分は縦長の画像を使い、他のカテゴリーと大きさを変えていました！

しかし、追加コンテンツではYoutubeトレイラーを際立たせ、従来のNetflixの見た目に近づける為に、Row部分の画像一覧の大きさは一律にしていきます。

コード解説

Row/index.tsx

import { useProps } from "./useProps";
import { Layout, Props } from "./Layout";

export const Row = ({ title, fetchUrl }: Props) => {
  return <Layout title={title} {...useProps(fetchUrl, title)} />;
};

Layoutに渡すpropsからisLargeRowを削っています。

Layout.tsx

import { Movie } from "../../type.ts";
import YouTube from "react-youtube";

export type Props = {
  title: string;
  fetchUrl: string;
};

type LayoutProps = {
  title: string;
  movies: Movie[];
  trailerUrl: string | null;
  handleClick: (movie: Movie) => void;
  isLoading: boolean;
};

type Options = {
  height: string;
  width: string;
  playerVars: {
    autoplay: 0 | 1 | undefined;
  };
};

export const Layout = ({
  title,
  movies,
  handleClick,
  trailerUrl,
  isLoading,
}: LayoutProps) => {
  const image_url = "https://image.tmdb.org/t/p/original";
  const opts: Options = {
    height: "390",
    width: "640",
    playerVars: {
      autoplay: 1,
    },
  };

  return (
    <div className="ml-5 text-white">
      <h2>{title}</h2>
      <div className="flex overflow-y-hidden overflow-x-scroll p-5 scrollbar-hide">
        {!isLoading &&
          movies.map((movie) => (
            <img
              key={movie.id}
              className="object-contain w-full max-h-36 m-2 transform transition-transform duration-450"
              src={`${image_url}${movie.backdrop_path}`}
              onClick={() => handleClick(movie)}
              alt={movie.name}
            />
          ))}
      </div>
      {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
    </div>
  );
};

こちらもisLargeRowを用いたDOMの条件分岐を削りました。

これにてRow部分の表示の大きさは一律になります。

