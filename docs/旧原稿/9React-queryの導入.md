react-queryの導入

該当commit

やること

react-queryの導入

Rowコンポーネントでのデータの取得をreact-queryに移行

Netflixクローンのstate管理について

Webサービスのフロントエンドは大きく分けると以下の3パターンで状態を管理することが多いです。

ローカルステート

グローバルステート

サーバーステート

チュートリアル後の状態だとローカルステートのみを扱い、useStateでのPropsのバケツリレーを用にて状態を管理していました。

今回の追加コンテンツでは複数のコンポーネントで状態を参照したいのでuseContextを用いてグローバルステートも使います！！

そして、react-queryで扱うのがサーバーステートです！簡単に説明するとサーバー側からフェッチしてデータをキャッシュを用いたステートとして保持して、良い感じに管理してくれるやつです。

詳しくはこちらの解説が分かりやすいです！！

react-queryとは？

正式名称がreact-queryからTanStack Queryに変わりましたがreact-queryで覚えて大丈夫です笑

先ほどのサーバーステートを管理するライブラリになります。

こちらの記事の解説が分かりやすいですね。

react-queryを用いる事で非同期でも効率的にAPIからのデータを管理する事が出来ます。

コード解説

まずはターミナルで以下を実行してreact-queryをinstallします。

npm install @tanstack/react-query

次にアプリケーションでreact-queryが使える様に定義を入れていきます。

App.tsx

import { requests } from "./request";
import { Row } from "./components/Row";
import { Banner } from "./components/Banner";
import { Header } from "./components/Header";
import { QueryClient, QueryClientProvider } from "react-query";

// react-queryを定義
const queryClient = new QueryClient();

function App() {
  return (
　　　　　　　// トップレベルでラップする
    <QueryClientProvider client={queryClient}>
        <div className="App">
          <Header />
          <Banner />
          <Row
            title="NETFLIX ORIGUINALS"
            fetchUrl={requests.fetchNetflixOriginals}
          />
          <Row title="Trand Movies" fetchUrl={requests.fetchTrending} />
          <Row title="Action Movies" fetchUrl={requests.fetchActionMovies} />
          <Row title="News Movies" fetchUrl={requests.fetchNewsMovies} />
          <Row title="Kids Movies" fetchUrl={requests.fetchKidsMovies} />
          <Row title="Romance Movies" fetchUrl={requests.fetchRomanceMovies} />
          <Row title="Documentaries" fetchUrl={requests.fetchDocumentMovies} />
        </div>
    </QueryClientProvider>
  );
}

export default App;


これによってアプリケーション内でreact-queryが使える様になりました。

Row/index.tsx

import { useProps } from "./useProps";
import { Layout, Props } from "./Layout";

export const Row = ({ title, fetchUrl }: Props) => {
  return <Layout title={title}  isLargeRow={isLargeRow} {...useProps(fetchUrl, title)} />;
};


react-queryの判別に使うtitleをusePropsへの引数に追加しています。

Row/useProps.ts

import { useState } from "react";
import axios from "../../axios";
import { useQuery } from "react-query";
import { Movie } from "../../type.ts";
import { requests } from "../../request.ts";

export const useProps = (fetchUrl: string, title: string) => {
  const [trailerUrl, setTrailerUrl] = useState<string | null>("");
  const fetchData = async () => {
    const request = await axios.get(fetchUrl);
    return request.data.results.map((movie: Movie) => ({
      id: movie.id,
      name: movie.name,
      poster_path: movie.poster_path,
      backdrop_path: movie.backdrop_path,
    }));
  };

  // react-queryを用いてfetchDataを実行
  const { data: movies, isLoading } = useQuery(`${title}/movies`, fetchData);

  const handleClick = async (movie: Movie) => {
    if (trailerUrl) {
      setTrailerUrl("");
    } else {
      const moviePlayUrl = await axios.get(requests.fetchMovieVideos(movie.id));
      setTrailerUrl(moviePlayUrl.data.results[0]?.key);
    }
  };

  return {
    movies,
    trailerUrl,
    handleClick,
    isLoading,
  };
};

はい。まず、APIを叩く処理はfetchDataに入れています。

  const fetchData = async () => {
    const request = await axios.get(fetchUrl);
    return request.data.results.map((movie: Movie) => ({
      id: movie.id,
      name: movie.name,
      poster_path: movie.poster_path,
      backdrop_path: movie.backdrop_path,
    }));
  };

これは今までと変わらないですね！

次にreact-queryでを通じてfetchDataを実行します。

 // react-queryを用いてfetchDataを実行
  const { data: movies, isLoading } = useQuery(`${title}movies`, fetchData);

Rowコンポーネントはカテゴリー毎に複数あるので、`${title}movies`として、それぞれ別のステートとして管理します。

useQueryでデータが取得出来たらmovieに格納、データ取得中はisLoading=trueを返しています。

Row/Layout.tsx

import { Movie } from "../../type.ts";
import YouTube from "react-youtube";

export type Props = {
  title: string;
  fetchUrl: string;
  isLargeRow?: boolean;
};

type LayoutProps = {
  title: string;
  isLargeRow?: boolean;
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
  isLargeRow,
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
        // isLoadingなら表示なし
　　　　　　　　　　　　　　　　{!isLoading &&
          movies.map((movie) => (
            <img
              key={movie.id}
              className={`object-contain w-full max-h-24 m-2 transform transition-transform duration-450 ${
                isLargeRow ? "max-h-60 hover:scale-110" : "hover:scale-108"
              }`}
              src={`${image_url}${
                isLargeRow ? movie.poster_path : movie.backdrop_path
              }`}
              onClick={() => handleClick(movie)}
              alt={movie.name}
            />
          ))}
      </div>
      {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
    </div>
  );
};

react-queryを通じて返却されたisLoadingの部分を追加しています。