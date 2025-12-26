この章ではTMDBのデータをAPIで取得し、画面で確認する所まで進めていきます。

## 3-1 この章でやる事
- axios.tsの作成
- request.tsの作成
- API取得の確認

さて実際に入ります。
この章ではTMDBからAPIを取得の確認まで行います。

## 3-2 axios.tsの作成
以下のコマンドでaxiosをインストールします。

```bash
npm install axios
npm install @types/axios --save-dev
```

次にaxios.tsファイルをsrc配下に作成し、instanceを作成します。

```ts
import axios from 'axios'

//TMDBからのbaseURLリクエストを作成
const instance = axios.create({
  baseURL: "https://api.themoviedb.org/3",
});

export default instance;
```

baseURLではTMDBのベースとなるURLを定義しています。

この後、TMDBからカテゴリー別でAPIを複数叩いてデータを取得しますが、この際に使い回ししやすい方にaxios.tsでインスタンスを作成しています。

## 3-3 request.tsの作成
まずは以下のコマンドでプロジェクトに.envファイルを作りましょう！

```
cp .env.example .env
```

作成した.envファイルに最初にメモしておいたTMDBのAPIKEYをコピペして下さい。

次にrequest.tsを作っていきます。
こちらがrequest.tsのコードになります。

```ts
// ① .envからAPI_KEYを取得
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "/discover/tv?api_key=";

// ② named export
export const requests = {
  fetchTrending: `/trending/all/week?api_key=${API_KEY}&watch_region=JP&language=ja-JP`,
  fetchNetflixOriginals: `${BASE_URL}${API_KEY}&with_networks=213&watch_region=JP&language=ja`,
  fetchTopRated: `${BASE_URL}${API_KEY}&language=ja-JP`,
  fetchActionMovies: `${BASE_URL}${API_KEY}&with_genres=10759&watch_region=JP&language=ja-JP`,
  fetchNewsMovies: `${BASE_URL}${API_KEY}&with_genres=10763&watch_region=JP&language=ja-JP`,
  fetchKidsMovies: `${BASE_URL}${API_KEY}&with_genres=10762&watch_region=JP&language=ja-JP`,
  fetchRomanceMovies: `${BASE_URL}${API_KEY}&with_genres=10749&watch_region=JP&language=ja-JP`,
  fetchDocumentMovies: `${BASE_URL}${API_KEY}&with_genres=99&watch_region=JP&language=ja-JP`,
};
```

1つずつ解説していきます。

### ① import.meta.env.VITE_TMDB_API_KEY
Viteでは、環境変数は VITE_ で始まる必要があるため、 **import.meta.env** を用いて.envの環境変数を取得しています！

### ② named export
またここではexport defaultを使わずにnamed exportを使っています。
メリットデメリットは様々ありますが、import側で命名が変わらないように僕は好んで、named exportの方を使います。

2つの違いについて詳しくはこちらの記事に書いてあります。

https://engineering.linecorp.com/ja/blog/you-dont-need-default-export

これにてAPIを取得する下準備は完了です。

## 余談：.envについて

一般的なWeb開発では機密情報(APIキー、DB接続情報など)はセキュリティの観点からプロジェクトのコードとは分離します。

その際に用いられるのが、.envで環境変数を管理するという方法です。

Githubなどのリポジトリには.env.exampleを置いて、開発者が手元で、.env.exampleをコピーして作成した.envにて環境変数を管理するという手順ですね。

**.envには機密情報が詰まっているので実際の開発では、作成した.envは.gitignoreファイルなどを使ってGitのコミット対象外に設定しておきましょう。**

## 3-4 APIを取得できるか確認

テスト用に以下のファイルを作成・変更します。

- src/components/Row/index.tsx
- scr/App.tsx

### index.tsx

```tsx
import axios from "../../axios";

export const Row = ({ fetchUrl }: { fetchUrl: string }) => {
  async function fetchData() {
    const request = await axios.get(fetchUrl);
  }

  fetchData();

  return <div className="Row" />;
};
```
これはRowコンポーネントでfetchUrlをpropsとして受け取り、fetchDataにて先ほど定義したaxiosを使ってAPIを叩いています。

### App.tsx

```tsx
import { requests } from "./request";
import { Row } from "./components/Row";

function App() {
  return (
   // 追加箇所
    <div className="App">
     <Row fetchUrl={requests.fetchNetflixOriginals} />
    </div>
  );
}

export default App;
```

App.tsx側ではRowコンポーネントにfetchUrlとしてテスト用のURLを渡しています。

**さて、ちゃんとAPIからデータが取得出来ているか見てみましょう。**

devtoolのNetworkタブを開いて画面をリロードして、データが取得出来ているか確認します。
画像の赤で囲った「tv?api_key=xxxxx」のリクエストを確認します。

![](https://storage.googleapis.com/zenn-user-upload/1c9c6afc4d3e-20240507.png)

RequestURLとReequest Methodsを確認しつつ、**Statusコードが200 OK**なっていれば無事にAPIからデータが取得出来ています！

次にどんなデータが取得出来たかを見ていきます！

Previewタブを開いて、レスポンスで返ってきた値を確認していきましょう。

![](https://storage.googleapis.com/zenn-user-upload/409f61cee625-20240507.png)

resultの中に映像ごとのデータが配列として格納されています。
配列の要素はid、name、backdrop_pathなどのプロパティを持つオブジェクトである事が分かります。

TMDBのAPIはページングのフィルタがあり、デフォルトで1ページ20レコードとなっています。
今回はページングのフィルタをしていないので、最初の20レコードが取得出来ています。

こちらは今回叩いたAPIのTMDBのAPIのリファレンスになります。

https://developer.themoviedb.org/reference/discover-tv

今回はwith_genres、languageあたりのフィルタを使いましたが、他にも制御できるフィルタを確認出来ます！

レスポンスの値がちゃんと取れた事が確認出来たらこの章はクリアです！！