こんな感じの1番上に表示するバナーを作っていきます。

![](https://storage.googleapis.com/zenn-user-upload/f1fbffded101-20240507.png)

## 5-1 必要な機能
- バナーに必要な機能は以下です。
- ランダムで背景のmovie画像を持ってくる
- そのmovieのタイトル持ってくる
- ボタンとdescriptionをつけてスタイリング
- descriptionを大きさに応じて切り捨てる
- Bannerの下、1/3をfadeさせる

## 5-2 index.tsxでBannerコンポーネントのエンドポイントを作る
前回のRowコンポーネント同様にBannerコンポーネントを作り、index.tsx、useProps.ts、Layout.tsxを作成します。

![](https://storage.googleapis.com/zenn-user-upload/ae414bafd465-20240507.png)

### App.tsx
まずはBannerコンポーネントを呼び出すApp.tsxです。
Rowコンポーネントの上でBannerコンポーネントを呼び出しましょう。

```tsx
function App() {
  return (
    <div className="App">
　　　　　　　　　　　// 追加
      <Banner />
      <Row
        title="NETFLIX ORIGUINALS"
        fetchUrl={requests.fetchNetflixOriginals}
        isLargeRow
      />
      <Row title="Top Rated" fetchUrl={requests.fetchTopRated} />
      <Row title="Action Movies" fetchUrl={requests.fetchActionMovies} />
      <Row title="News Movies" fetchUrl={requests.fetchNewsMovies} />
      <Row title="Kids Movies" fetchUrl={requests.fetchKidsMovies} />
      <Row title="Romance Movies" fetchUrl={requests.fetchRomanceMovies} />
      <Row title="Documentaries" fetchUrl={requests.fetchDocumentMovies} />
    </div>
  );
}
```

### index.tsx

```tsx
import { useProps } from "./useProps";
import { Layout } from "./Layout";

export const Banner = () => {
  // ①propsをスプレッド構文で渡す
  return <Layout {...useProps()} />;
};
```

次にindex.tsxの実装です。usePropsで受け取った間をLayoutコンポーネントに渡す以外は何もしていません。

### ① propsをスプレッド構文で渡す
今回はpropsを渡す書き方の別パターンとしてスプレッド構文を使いました。
まだ実装していませんが、usePropsではmovie、truncateのオブジェクトを返して、そのままLayoutに渡す予定です。

なので、今までのpropsの渡し方だとこうなります。

```tsx
export const Banner = () => {
  const { movie, truncate } = useProps();
  return <Layout movie={movie} truncate={truncate} />;
};
```

この書き方でももちろんOKです！

ここら辺は好みで良いですが、自分の場合は、一度movieなどを定義してからLayoutコンポーネントに渡すとコードが長くなるので、スプレッド構文を使い、以下のように書くことが多いです。

```tsx
export const Banner = () => {
  return <Layout {...useProps()} />;
};
```

## 余談：スプレッド構文とは
スプレット構文を使う事で、配列やオブジェクトを展開する事が出来ます。

https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/Spread_syntax

オブジェクト・配列ともに追加、更新、結合などをする際に使うことが多いです。
こちらはuserオブジェクトのnameを上書きする際のスプレッド構文を使用した例です。

```ts
const user = { id: 1, name: "太郎", age: 20 };
 
const changeNameUser = { ...user, name: "次郎" };
console.log(changeNameUser);
// 結果：{id: 1, name: '次郎', age: 20}
```

このスプレッド構文を使ったオブジェクトの更新や追加の用法はコンポーネントにpropsを渡す際に応用が効きます。

### 例:スプレッド構文を用いて、movieだけ更新する
truncateはそのまま使い、movieはnewMovieに更新してLayoutコンポーネントに渡したいとします。
普通の書き方だと以下になります。

```tsx
export const Banner = () => {
  const { truncate } = useProps();
  const newMovie = {
    id: "1",
    name: "Test",
    poster_path: "/Test.jpg",
    backdrop_path: "/Test.jpg",
    overview: "Test",
  };
  return <Layout truncate={truncate} movie={newMovie} />;
};
```

スプレッド構文を使うとこうなります。

```tsx
export const Banner = () => {
  const newMovie = {
    id: "1",
    name: "Test",
    poster_path: "/Test.jpg",
    backdrop_path: "/Test.jpg",
    overview: "Test",
  };
  return <Layout {...{ ...useProps(), movie: newMovie }} />;
};
```

どちらを使うかは実装者の好みになりますが、スプレッド構文でpropsを扱う書き方も多くの現場で見られるので、覚えておくと良いでしょう。

## 5-3 usePropsにロジックを書く
さて、次はusePropsに入っていきます。

### type.tsに共通の型を定義する
その前に、先ほどRowコンポーネントで定義したMovieタイプですが、今回のBannerコンポーネントでも使いそうです。

```ts
export type Movie = {
  id: string;
  name: string;
  poster_path: string;
  backdrop_path: string;
};
```

このように複数箇所で使い回しそうな型データは共通で扱えるtype.tsなどの定義ファイルを作って管理する事にしましょう。

src/type.tsを作成して以下を定義します。
Bannerコンポーネントで新しくoverviewを使用するので、型に追加しました。

```ts
export type Movie = {
  id: string;
  name: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
};
```

Rowコンポーネントで定義していたMovieを削除して、各ファイルでのimport元もRowコンポーネントからtype.tsに修正しておきましょう。

### usePropsを実装する
usePropsでは以下の実装します。

- 返却値
    - movie：バナーで表示する映像データ
    - truncate：映像データの概要を整形する関数
- movieはAPI経由でNetflixオリジナルの映像データからランダムで取得する

こちらがコードになります。

```ts
import { useEffect, useState } from "react";
import axios from "../../axios";
import { requests } from "../../request.ts";
import { Movie } from "../../type.ts";

export const useProps = () => {
  const [movie, setMovie] = useState<Movie>();
  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(requests.fetchNetflixOriginals);

      // ① 取得した映像データからランダムでmovieに格納
      setMovie(
        request.data.results[
          Math.floor(Math.random() * request.data.results.length - 1)
        ],
      );
    }
    fetchData();
  }, []);

  // ② descriptionの切り捨て用の関数
  const truncate = (str: string | undefined, n: number): string => {
    if (!str) {
      return "";
    }
    return str.length > n ? str.substr(0, n - 1) + "..." : str;
  };

  return {
    movie,
    truncate,
  };
};
```

基本的な流れは先ほどのRowコンポーネントと同じですね。

- useEffectを使い非同期処理でAPIからデータを取得する
- 取得したデータはuseStateでローカルのstateとして扱う

### ① 取得した映像データからランダムでmovieに格納

```ts
async function fetchData() {
      const request = await axios.get(requests.fetchNetflixOriginals);

      // ① 取得した映像データからランダムでmovieに格納
      setMovie(
        request.data.results[
          Math.floor(Math.random() * request.data.results.length - 1)
        ],
      );
    }
```

APIから取得したrequest.data.resultsには映像のデータが配列として格納されています。
その中から1つ映像を選ぶ場合は、このように書きます。

```ts
request.data.result[3] // ３番目の映像の場合
```

今回はランダムに映像を選びたいので、適当な数字を出す為に以下の式を使いました。

```ts
Math.floor(Math.random() * request.data.results.length - 1)
```

この式で「0~配列の値-1」までの範囲でのランダムな値を入手出来ます。
入手した値をsetMovieを使ってstateに保存しています。

### ② descriptionの切り捨て用の関数
```ts
  // ② descriptionの切り捨て用の関数
  const truncate = (str: string | undefined, n: number): string => {
    if (!str) {
      return "";
    }
    return str.length > n ? str.substr(0, n - 1) + "..." : str;
  };
```

truncateは文字数を指定した長さに切り捨てる関数です。
第1引数のstrで文字列を、第2引数で文字数を受け取ります。

strがundefinedの場合は空文字を返します。

戻り値は以下です。

```ts
str.length > n ? str.substr(0, n - 1) + "..." : str;
```

こちらは三項演算子を使っていて、strがnより長い場合はn-1文字まで切り捨てて、末尾に「…」を追加しています。


## 余談：Mathを使ってランダムな数字を出した部分を詳しく解説

先ほどのMathを使ったランダムな数字の入手部分を処理毎に詳しく見ていきます。

```ts
Math.floor(Math.random() * request.data.results.length - 1)
```

例としてrequest.data.resultsは要素を20個持つ配列として考えていきましょう！(request.data.results.length = 20)

### Math.random
Math.randomは0~1の間で適当な値をランダムに出してくれます。

https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Math/random

0.xみたいな値ですね。ランダムな値を作る基としてこれを使います。

```ts
Math.random() * request.data.results.length - 1
```

### 範囲の拡張
次にMath.randomで貰った小数を「request.data.results.length - 1」をかける事で、「0~配列の値-1」までの範囲に拡張します。

よって、以下の式は0~19までの少数を含む値になります。(14.5など)

```ts
Math.random() * request.data.results.length - 1
```

### Math.floor
最後にMath.floorです。
これは値を整数に丸めるために使います。

小数切り捨てで整数に値を丸めてくれます。

```ts
Math.floor(12.5) // 12
```

https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Math/floor

これを使うことで以下は0~19までの整数になります。

```ts
Math.floor(Math.random() * request.data.results.length - 1)
```


## 余談：三項演算子 vs 条件式(if文)
これもエンジニアにとって好みの問題ですが、JavaScriptでの簡単な条件分岐の実装をする際の選択肢として、if文と三項演算子があります。

**先ほどの実装が三項演算子を使ったパターンですね。**
三項演算子の基本形は以下になります。

```
条件式 ? A: B;
```

条件式がtrueならA、falseならBとなる訳です。

https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/Conditional_operator

先ほどの実装を見てみましょう。

```ts
str.length > n ? str.substr(0, n - 1) + "..." : str;
```

条件式が「str.length > n」となっていて、strの文字数とnを比較しています。
そしてtrue、すならちstrの文字数がnより大きい場合は「str.substr(0, n - 1) + "..."」を返しています。

逆にfalseの場合はstrをそのまま返します。

**これをif文のパターンで書いてみるとこの様になります。**

```ts
if (str.length > n) {
  return str.substr(0, n - 1) + "...";
} else {
  return str;
}
```

このような2パターンの条件分岐はif文と三項演算子のどちらを使っても問題ないですが、**個人的には見た目のスッキリ感から、三項演算子を好んで使います！**

### 条件分岐が3パターン以上になる場合

さて、先ほどは条件分岐が2パターンの場合でしたが、試しに3パターンの場合も見ていきましょう。

else ifを使った実装になります。

```ts
if (num > 10) {
  return "10より大きい";
} else if (num < 10) {
  return ”10より小さい”;
} else {
  return "10";
}
```

これを三項演算子で書いてみましょう！

```ts
num > 10 ? "10より大きい" : (num < 10 ? "10より小さい" : "10");
```

どうでしょう？
個人的には少し可読性が下がった様に感じます。

まとめると

- if文は条件分岐の数が増えても対応しやすい
- 三項演算子はスッキリしていて可読性が高いが、条件分岐の数が増えると可読性が一気に下がる

これを踏まえて、僕は2パターンの条件分岐は三項演算子、それ以上はif文、もしくはswitchを使う様にしています。

## 5-4 Layoutで見た目を作る
さて、次はLayoutを作っていきます。
Layoutはindex.tsxからmovieとtrancateをpropsとして貰って画面表示を責務としています。

### Layout.tsx

```tsx
import { Movie } from "../../type.ts";

type Props = {
  movie: Movie | undefined;
  truncate: (str: string, n: number) => string;
};
export const Layout = ({ movie, truncate }: Props) => {
  return (
    <header
      className="text-white object-contain"
      style={{
        backgroundSize: "cover",
        backgroundImage: `url("https://image.tmdb.org/t/p/original${movie?.backdrop_path}")`,
        backgroundPosition: "center center",
      }}
    >
      <div className="ml-8 pt-36">
        <h1 className="text-6xl font-extrabold pb-1">{movie?.name}</h1>
        <div className="w-[45rem] leading-[1.3] pt-4 text-sm max-w-[360px] h-[80px]">
          {movie && truncate(movie?.overview, 150)}
        </div>
      </div>
     // ① Tailwindのグラデーション
      <div className="h-[7.4rem] bg-gradual-gradient" />
    </header>
  );
};
```

今回のDOM部分では特筆すべき事はありませんが、1点Tailwindのスタイリングで注意が必要な箇所があります。

### ① Tailwindのグラデーション
今回のBannerは下が徐々に黒くなっていく見た目にする必要があります。
![](https://storage.googleapis.com/zenn-user-upload/d78fc137cfa4-20240507.png)

その場合にCSSのグラデーションを使うのですが、Tailwindでは個別に設定が必要です。

tailwind.config.jsのthemeの中に以下をコピペします。

```js
theme: {
  extend: {
    backgroundImage: {
      "gradual-gradient":
        "linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.9), #000)",
    },
  },
},
```

backgroundImageは要素の背景画像を制御するユーティリティクラスで、これでバナーの背景画像にグラデーションを加えていきます。

https://tailwindcss.com/docs/background-image

「gradual-gradient」というクラス名で以下のCSSを登録しています。

``js
linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.9), #000)
``

linear-gradientはフェード処理を行なってくれます。

https://developer.mozilla.org/ja/docs/Web/CSS/gradient/linear-gradient

さて、この様な見た目のバナーが表示されたらこの章は完了です。

![](https://storage.googleapis.com/zenn-user-upload/a2d2daf9a4a1-20240507.png)

