こんな感じで映像をクリックした際にYoutubeのトレイラーが流れるように修正します。

![](https://storage.googleapis.com/zenn-user-upload/fce5760c63a8-20240507.png)

## 7-1 必要な機能
- 映像一覧をクリックするとプロモーション映像が流れる
- もう一度クリックすると閉じる

クリックした際にその映像の関する予告データをAPIから取得し、Youtubeプレイヤーにて表示します。

## 7-2 react-youtubeをインストールする
まずReact内でYoutubeのトライラーを表示する為に、react-youtubeを使用します。

https://www.npmjs.com/package/react-youtube

以下のコマンドでプロジェクトにreact-youtubeをインストールして下さい。

```bash
npm i react-youtube
```

これでインストールは完了です。

## 7-3 RowコンポーネントのusePropsでクリック時の挙動を追加する
まずはクリック時に予告映像のデータを取得するAPIを追加しましょう。

### request.ts

```ts
export const requests = {
  fetchTrending: `/trending/all/week?api_key=${API_KEY}&watch_region=JP&language=ja-JP`,
  fetchNetflixOriginals: `${BASE_URL}${API_KEY}&with_networks=213&watch_region=JP&language=ja`,
  fetchTopRated: `${BASE_URL}${API_KEY}&language=ja-JP`,
  fetchActionMovies: `${BASE_URL}${API_KEY}&with_genres=10759&watch_region=JP&language=ja-JP`,
  fetchNewsMovies: `${BASE_URL}${API_KEY}&with_genres=10763&watch_region=JP&language=ja-JP`,
  fetchKidsMovies: `${BASE_URL}${API_KEY}&with_genres=10762&watch_region=JP&language=ja-JP`,
  fetchRomanceMovies: `${BASE_URL}${API_KEY}&with_genres=10749&watch_region=JP&language=ja-JP`,
  fetchDocumentMovies: `${BASE_URL}${API_KEY}&with_genres=99&watch_region=JP&language=ja-JP`,
  // 追加
  fetchMovieVideos: (movieId: string) =>
    `/tv/${movieId}/videos?api_key=${API_KEY}`,
};
```

fetchMovieVideosを追加しています。
この関数はmovieIdを引数に貰って、その映像の予告動画を取得してくれます。

次にRowコンポーネントのusePropsにクリック時に追加したAPIを叩く処理を書きましょう！

```ts
export const useProps = (fetchUrl: string) => {
  const [movies, setMovies] = useState<Movie[]>([]);
　　　// 追加
  const [trailerUrl, setTrailerUrl] = useState<string | null>("");

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(fetchUrl);
      const movies = request.data.results.map((movie: Movie) => ({
        id: movie.id,
        name: movie.name,
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
      }));
      setMovies(movies);
      return request;
    }
    fetchData();
  }, [fetchUrl]);

　　　// 追加
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
　　　　　　　　// 追加
    trailerUrl,
    handleClick,
  };
};
```

まずusePropsの戻り値に以下の2つを追加します。

- trailerUrl：表示する予告映像のURL
- handleClick：映画をクリックした時に予告映像のURLを取ってくる処理

これらはLayout側で使います。

### TrailerUrlで予告映像を管理する
trailerUrlの値はuseStateを使ってローカルstateとして管理します。
クリック時にAPIから予告映像データが取得出来れば、setTrailerUrlで上書きしていきます。

### handleClickでポスタークリック時の挙動を実装する
```ts
  const handleClick = async (movie: Movie) => {
    if (trailerUrl) {
      setTrailerUrl("");
    } else {
      const moviePlayUrl = await axios.get(requests.fetchMovieVideos(movie.id));
      setTrailerUrl(moviePlayUrl.data.results[0]?.key);
    }
  };
```

handleClickでは再度、映像がクリックされた際に予告映像を閉じる為に、if文を使って条件分岐をします。

条件は以下です。

- trailerUrlが既にあれば空文字をセットする
- trailerUrlがない場合は、APIを叩いて予告映像を取得する

これにてロジック部分は完了です。

## 7-4 RowコンポーネントのLayoutで予告映像を表示する
先ほどのusePropsで作ったtrailerUrlとhandleClickをLayoutに組み込んで行きます。

```tsx
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
　　　　// 追加
  trailerUrl: string | null;
  handleClick: (movie: Movie) => void;
};

// 追加
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
　　　　// 追加
  handleClick,
  trailerUrl,
}: LayoutProps) => {
  const image_url = "https://image.tmdb.org/t/p/original";
　　　// 追加
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
        {movies.map((movie) => (
          <img
            key={movie.id}
            className={`object-contain w-full max-h-24 m-2 transform transition-transform duration-450 ${
              isLargeRow ? "max-h-60 hover:scale-110" : "hover:scale-108"
            }`}
            src={`${image_url}${
              isLargeRow ? movie.poster_path : movie.backdrop_path
            }`}
　　　　　　　　　　　　　　　　　　　　　　　　// 追加
            onClick={() => handleClick(movie)}
            alt={movie.name}
          />
        ))}
      </div>
　　　　　　　　　　　　// 追加
      {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
    </div>
  );
};
```

### Layoutコンポーネントにpropsを追加する
まずはLayoutのpropsにhandleClickとtrailerUrlを追加しています。

```tsx
type LayoutProps = {
  title: string;
  isLargeRow?: boolean;
  movies: Movie[];
　　　　// 追加
  trailerUrl: string | null;
  handleClick: (movie: Movie) => void;
};

~~~~

export const Layout = ({
  title,
  movies,
  isLargeRow,
　　　　// 追加
  handleClick,
  trailerUrl,
}: LayoutProps) => {
 
~~~~

```

### handleClickの設定
次に映像の画像部分をクリックした際にhandleClickを発火させます。

```ts
{movies.map((movie) => (
          <img
            key={movie.id}
            className={`object-contain w-full max-h-24 m-2 transform transition-transform duration-450 ${
              isLargeRow ? "max-h-60 hover:scale-110" : "hover:scale-108"
            }`}
            src={`${image_url}${
              isLargeRow ? movie.poster_path : movie.backdrop_path
            }`}
　　　　　　　　　　　　　　　　　　　　　　　　// 追加
            onClick={() => handleClick(movie)}
            alt={movie.name}
          />
        ))}
```

onClickはReactの埋め込み関数でその要素をクリックイベントを設定出来ます。

```ts
onClick={() => handleClick(movie)}
```

クリック時に無名関数を定義し、handleClickが実行されます。

### YoutubeのiFrameを埋め込む

最後にYoutubeを埋め込みます

```ts
import YouTube from "react-youtube";


~~~~

type Options = {
  height: string;
  width: string;
  playerVars: {
    autoplay: 0 | 1 | undefined;
  };
};


~~~

  const opts: Options = {
    height: "390",
    width: "640",
    playerVars: {
      autoplay: 1,
    },
  };



~~~~
 </div>
      {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
    </div>
  );
};
```

trailerUrlがある場合はYoutubeコンポーネントを表示します。
Youtubeコンポーネントはreact-youtubeのコンポーネントで、videoIdとoptsにて映像の設定を行います。

videoIdにはusePropsから取得したtrailerUrlを代入します。

optsは映像の表示設定を行うオブジェクトです。
今回は以下の設定にしました。(こちらはお好みでOKです！)

```ts
  const opts: Options = {
    height: "390",
    width: "640",
    playerVars: {
      autoplay: 1,
    },
  };
  ```

さてここまでやったら、画面表示に戻って映像をクリックして見てください！

![](https://storage.googleapis.com/zenn-user-upload/dfbb2d016890-20240507.png)

この様にYoutubeのトレイラーが流れる様になっているはずです！

もしうまくいかない場合はDevtoolのconsoleにエラーがないか確認して見ましょう。

例えばAPIの取得が上手く行ってない時は以下の様なエラーがconsoleに表示されます。

![](https://storage.googleapis.com/zenn-user-upload/b989c0a4d2cb-20240507.png)

エラーログを確認する事で、何が上手く行ってないかを正しく把握することが出来ます

この表示まで完了したらアプリケーションとしては完了です！
最後の仕上げとしてデプロイして他の人が見れる状態にしていきましょう。

