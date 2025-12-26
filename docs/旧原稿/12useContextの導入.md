useContextの追加

該当commit

やる事

useContextの導入・予告映像、映像情報、音声On/Offをグローバルステートで管理する

BannerコンポーネントにYoutubeトレイラーを移行する、YOutubeトレイラーの音声を制御する

音声アイコンの表示を追加する

映像をクリックしたタイミングでグローバルステートの予告映像・映像情報が更新される処理を追加する

この章で一気に実装を進めていきます！！！

④-1 useContextの導入・予告映像、映像情報、音声On/Offをグローバルステートで管理する

まずuseContextを用いて扱うグローバルデータを整理します。

映像情報(movie)

予告映像(trailerUrl)

音声On/Off(isMuted)

これらはBannerコンポーネントで表示しながら、他のコンポーネントにてデータの更新を行う為、今回はuseContextを用いてグローバルに値を管理します。

まずuseContextでデータを管理する為の定義を行います。BannerDataContext.tsxファイルを作成して下さい。

src/BannerDataContext.tsx

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

映像情報(movie)

予告映像(trailerUrl)

音声On/Off(isMuted)

それぞれの値とそれを更新する関数を定義しています。値に関してはそれぞれnull、falseとしています。

映像データはBannerコンポーネントの読み込み時にデータが取れたらセットし、その他の値は画面操作があった際にセットされます。

これらをApp全体に読み込ませます。

src/App.tsx

import { requests } from "./request";
import { Row } from "./components/Row";
import { Banner } from "./components/Banner";
import { Header } from "./components/Header";
import { QueryClient, QueryClientProvider } from "react-query";
import { BannerDataProvider } from "./BannerDataContext.tsx";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      // 定義したBannerDataProviderでラップする
      <BannerDataProvider>
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
      </BannerDataProvider>
    </QueryClientProvider>
  );
}

export default App;

App.tsxでは先ほど定義したBannerDataProviderで全体をラップします！

次にBannerコンポーネントにて表示を行っていきます。

④-2 BannerコンポーネントにYoutubeトレイラーを移行する

Banner/useProps.ts

import axios from "../../axios.ts";
import { requests } from "../../request.ts";
import { Movie } from "../../type.ts";
import { useQuery } from "react-query";
import { useContext, useEffect } from "react";
import { BannerDataContext } from "../../BannerDataContext.tsx";

export const useProps = () => {
  const { setMovie } = useContext(BannerDataContext);

　　　// ① react-queryを用いて初期データを取得
  const fetchMovie = async () => {
    const request = await axios.get(requests.fetchNetflixOriginals);
    const randomIndex = Math.floor(
      Math.random() * request.data.results.length - 1,
    );
    const movieUrl = await axios.get(
      requests.fetchMovieVideos(request.data.results[randomIndex].id),
    );
    return {
      movieData: request.data.results[randomIndex] as Movie,
      movieUrl: movieUrl.data.results[0]?.key,
    };
  };

  const { data } = useQuery("movie", fetchMovie);

  useEffect(() => {
    if (data) {
　　　　　　　　　　　　// ②初期データをグローバルステートに格納
      setMovie(data.movieData);
    }
  }, [data]);

  // descriptionの切り捨て用関数
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
    truncate,
  };
};

解説していきます。

①  react-queryを用いて初期データを取得

　　　// ① react-queryを用いて初期データを取得
  const fetchMovie = async () => {
    const request = await axios.get(requests.fetchNetflixOriginals);
    const randomIndex = Math.floor(
      Math.random() * request.data.results.length - 1,
    );
    const movieUrl = await axios.get(
      requests.fetchMovieVideos(request.data.results[randomIndex].id),
    );
    return {
      movieData: request.data.results[randomIndex] as Movie,
      movieUrl: movieUrl.data.results[0]?.key,
    };
  };

  const { data } = useQuery("movie", fetchMovie);

まず、Bannerの表示する初期データをRowコンポーネントと同様にreact-queryを用いて取得していきます。

取得するデータはチュートリアルの時と同様にランダムとしています。

② 初期データをグローバルステートに格納

const { setMovie } = useContext(BannerDataContext);

~~~~~

  useEffect(() => {
    if (data) {
　　　　　　　　　　　　// ②初期データをグローバルステートに格納
      setMovie(data.movieData);
    }
  }, [data]);

次に①のfetchMovieにてdataが取得出来たらBannerDataContextから持ってきたsetMovieにて、グローバルに管理している映像データを更新します。

次にBannerの見た目も変えていきます。

Banner/Layout.tsx

import YouTube from "react-youtube";
import { BannerDataContext } from "../../BannerDataContext.tsx";
import { useContext, useEffect, useRef } from "react";

type Props = {
  truncate: (str: string, n: number) => string;
};

// ①Youtubeトレイラーの移行
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
　　　// ③ グローバルステートの参照
  const { trailerUrl, movie, isMuted } = useContext(BannerDataContext);
  // ① Youtubeトレイラーの移行
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

　　　　// ② 音声On/OffをYoutubeトレイラーに渡す
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null);

　　　// ② 音声On/OffをYoutubeトレイラーに渡す
  const setPlayerVolume = () => {
    if (playerRef.current) {
      playerRef.current.setVolume(isMuted ? 0 : 100);
    }
  };

  // ② 音声On/OffをYoutubeトレイラーに渡す
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onPlayerReady = (event: { target: any }) => {
    playerRef.current = event.target;
    setPlayerVolume();
    playerRef.current.playVideo();
  };


  // ② 音声On/OffをYoutubeトレイラーに渡す
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
　　　　　　　　　　// ①Youtubeトレイラーの移行
     // ③ グローバルステートの参照
      {trailerUrl ? (
        <YouTube
          videoId={trailerUrl}
          opts={opts}
　　　　　　　　　　　　　　　　　　　　// ② 音声On/OffをYoutubeトレイラーに渡す
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

差分が多いですね！大きく分けて2つの処理を加えています。

Youtubeトレイラーの移行

音声On/OffをYoutubeトレイラーに渡す

グローバルステートの参照

① Youtubeトレイラーの移行

これは前までRowコンポーネントにあったYoutubeトレイラーをBannerコンポーネントの持っていきています。

あとでRowコンポーネント側も修正します。

// ①Youtubeトレイラーの移行
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
  // ①Youtubeトレイラーの移行
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

  return (
    
   ~~~
     // ①Youtubeトレイラーの移行
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
   
   ~~~
  );
};

ロジック的な変更は特にないです。

② 音声On/OffをYoutubeトレイラーに渡す

次に音声On/Offの切り替えを行っています。


  // ② 音声On/OffをYoutubeトレイラーに渡す
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null);


  // ② 音声On/OffをYoutubeトレイラーに渡す
  const setPlayerVolume = () => {
    if (playerRef.current) {
      playerRef.current.setVolume(isMuted ? 0 : 100);
    }
  };

  // ② 音声On/OffをYoutubeトレイラーに渡す
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
 
   ~~~

      {trailerUrl ? (
        <YouTube
          videoId={trailerUrl}
          opts={opts}
          // ② 音声On/OffをYoutubeトレイラーに渡す
          onReady={onPlayerReady}
          className="absolute top-0 left-0 z-n1 w-full h-full"
          style={{ pointerEvents: "none" }}
        />
      )
   ~~~
  );
};

音声のOn/Offの値自体はisMutedにて管理しています。Youtubeトレイラー側を制御する際にuseRefを用います。

これは音声のOn/Offの変化でコンポーネントの再レンダリングを防ぐ為です。

 // ② 音声On/OffをYoutubeトレイラーに渡す
 // eslint-disable-next-line @typescript-eslint/no-explicit-any
 const playerRef = useRef<any>(null);

YoutubeトレイラーにはonReadyという引数を渡して音声を制御します。

{trailerUrl ? (
        <YouTube
          videoId={trailerUrl}
          opts={opts}
          // ② 音声On/OffをYoutubeトレイラーに渡す
          onReady={onPlayerReady}
          className="absolute top-0 left-0 z-n1 w-full h-full"
          style={{ pointerEvents: "none" }}
        />
      )

onReadyに渡しているonPlayerReadyの内容はこうです！

  const onPlayerReady = (event: { target: any }) => {
    playerRef.current = event.target;
    setPlayerVolume();
    playerRef.current.playVideo();
  };

ざっくりいうとYoutubeトレイラーのDOMを参照しながら、setPlayerVolume()を実行しています。

setPlayerVolumeの中身はこうです。

  const setPlayerVolume = () => {
    if (playerRef.current) {
      playerRef.current.setVolume(isMuted ? 0 : 100);
    }
  };

isMutedがtrueなら音声を0、offなら音声を100にするDOM操作をしています。

これをuseEffectを使いisMutedが変わる度に実行しています。

  useEffect(() => {
    setPlayerVolume();
  }, [isMuted]);

これにてisMutedの値に応じてYoutubeトレイラーの音声を制御する事が出来ました。

③ グローバルステートの参照

bannerで表示する映像情報、予告映像、音声On/OffはuseContextを用いてグローバルステートから参照しています。

import { useContext, useEffect, useRef } from "react";

~~~

export const Layout = ({ truncate }: Props) => {
  // ③ グローバルステートの参照
  const { trailerUrl, movie, isMuted } = useContext(BannerDataContext);

~~~

  return (
  
   ~~~
      {trailerUrl ? (
       // ③ グローバルステートの参照
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
     ~~~
  );
};

このコンポーネントでは更新はないので、trailerUrl, movie, isMutedの参照だけですね。

④-3 音声アイコンの表示を追加する

次にHeaderコンポーネントに音声On/Offのアイコンを追加していきます。

まずはreact-iconsをインストールして、音声On/Offボタンにアイコンが使える状態にします。

npm install react-icons

さて、Headerコンポーネントに音声On/Offアイコンを入れていきましょう！

Header/Layout .tsx

import { useContext } from "react";
import { BannerDataContext } from "../../BannerDataContext.tsx";
import { FiVolume2, FiVolumeX } from "react-icons/fi";

type Props = {
  show: boolean;
};
export const Layout = ({ show }: Props) => {
　　　// ② 音声On/Offの切り替え
  const { isMuted, setIsMuted } = useContext(BannerDataContext);
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  return (
    <div
      className={`fixed top-0 w-full h-16 p-5 z-20 flex justify-between transition-all ease-in duration-500 ${show ? "bg-black" : ""}`}
    >
      <div className="flex items-center">
        <img
          className="w-20 object-contain"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/1920px-Netflix_2015_logo.svg.png"
          alt="Netflix Logo"
        />
　　　　　　　　　　　　　　　// ① 音声On/Offアイコンの追加
        <button onClick={toggleMute} className="ml-4 focus:outline-none">
          {isMuted ? <FiVolumeX /> : <FiVolume2 />}
        </button>
      </div>
      <img
        className="fixed right-5 w-8 object-contain"
        src="https://i.pinimg.com/originals/0d/dc/ca/0ddccae723d85a703b798a5e682c23c1.png"
        alt="Avatar"
      />
    </div>
  );
};

まずはアイコンの設置を見ていきます。

① 音声On/Offアイコンの追加

　// ① 音声On/Offアイコンの追加
 <button onClick={toggleMute} className="ml-4 focus:outline-none">
    {isMuted ? <FiVolumeX /> : <FiVolume2 />}
 </button>

isMuted=trueならFiVolumeXを、falseならFiVolume2を表示しています。

アイコン一覧はこちらで確認出来ます。

次にアイコンをクリックした際のtoggleMuteの処理です。

② 音声On/Offの切り替え

　// ② 音声On/Offの切り替え
  const { isMuted, setIsMuted } = useContext(BannerDataContext);
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

グローバルステートから取得したsetIsMutedにて、isMutedをトグルしています。

これにてNetflixロゴの横に音声アイコンが設置され、On/Offを切り替えられます！！

④-4 映像をクリックしたタイミングでグローバルステートの予告映像・映像情報が更新される処理を追加する

最後にRowコンポーネントを見ていきます！

主にやる事は

Youtubeトレイラーの削除

映像クリック時にグローバルステートを更新

です。

まずはYoutubeトレイラーの削除を見ていくのでLayout.tsxから

Row/Layout.tsx

削除後のコードはこうなります。

import { Movie } from "../../type.ts";

export type Props = {
  title: string;
  fetchUrl: string;
};

type LayoutProps = {
  title: string;
  movies: Movie[];
  handleClick: (movie: Movie) => void;
  isLoading: boolean;
};

export const Layout = ({
  title,
  movies,
  handleClick,
  isLoading,
}: LayoutProps) => {
  const image_url = "https://image.tmdb.org/t/p/original";
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
    </div>
  );
};

本当にYoutubeトレイラーに関するコードを削除しただけです。

次に映像クリック時の処理を見ていきたいので、usePropsを更新していきます。

Row/useProps.ts

import { useContext } from "react";
import axios from "../../axios";
import { useQuery } from "react-query";
import { Movie } from "../../type.ts";
import { requests } from "../../request.ts";
import { BannerDataContext } from "../../BannerDataContext.tsx";

export const useProps = (fetchUrl: string, title: string) => {
  const { setTrailerUrl, setMovie } = useContext(BannerDataContext);

  const fetchData = async () => {
    const request = await axios.get(fetchUrl);
    return request.data.results.slice(0, 10).map((movie: Movie) => ({
      id: movie.id,
      name: movie.name,
      poster_path: movie.poster_path,
      backdrop_path: movie.backdrop_path,
      overview: movie.overview,
    }));
  };

  const { data: movies, isLoading } = useQuery(`${title}/movies`, fetchData);

  const handleClick = async (movie: Movie) => {
    const moviePlayUrl = await axios.get(requests.fetchMovieVideos(movie.id));
    setTrailerUrl(moviePlayUrl.data.results[0]?.key);
    setMovie(movie);
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  return {
    movies,
    handleClick,
    isLoading,
  };
};

この教材の序盤でreact-queryでのデータフェッチに切り替えたと思うので、ここでの変更はuseContextに関わる部分だけですね。

まずuseContextから予告映像と映像情報の更新用の関数を持ってきます。

const { setTrailerUrl, setMovie } = useContext(BannerDataContext);

そしてhandleClickにて実際に更新しています。

const handleClick = async (movie: Movie) => {
    const moviePlayUrl = await axios.get(requests.fetchMovieVideos(movie.id));
    setTrailerUrl(moviePlayUrl.data.results[0]?.key);
    setMovie(movie);
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

window.scrollを加える事で、クリックした際にYoutubeトレイラーが見える最上部にしライドする処理を入れています。

以下の様な画面表示で、映像をクリックした際にYoutubeトレイラーが切り替われば完了です！！

お疲れ様でした。