こんな感じで画像を列で表示するRowコンポーネントを作っていきます。

![](https://storage.googleapis.com/zenn-user-upload/965f48a8eb4b-20240507.png)

## 4-1 必要な機能
・カテゴリー毎に映画の画像を取ってくる
・Top ratedの画像は大きめにする
・列毎に横スライドができるようにする

APIの準備ができたのでコンポーネントを作っていきます。
まずは映画のAPIが取得出来る事を確認してきます。

## 4-2 コンポーネントの雛形を作る

以下の階層でRowフォルダを作り、index.tsx、Layout.tsx、useProps.tsを作成しましょう。

![](https://storage.googleapis.com/zenn-user-upload/362d5a720608-20240507.png)

今回のプロジェクトでは、この3つのファイルで構成されたコンポーネントを基本として扱います。
これは**ロジックとUIで責務の分離をするべきという考えに基づいたものです。**

- index.tsx：コンポーネントのエントリポイントを定義している。他の2つのファイルをインポートして、統合した形でエクスポートする役割
- Layout.tsx：コンポーネントのUI部分を定義している
- useProps.ts：コンポーネントのロジック部分を定義している

ファイルを分ける事でコードの可読性と再利用性が向上します。
またこのプロジェクトでは行いませんが、テストコードを書いてのメンテナンスが行いやすくなります。

## 4-3 index.tsxでRowコンポーネントのエンドポイントを作る

API経由でのデータの取得が確認出来たので、Rowコンポーネントを作成していきます。

TopカテゴリではRowコンポーネントを大きく表示したいので、optionalでislargeRowをプロップスに受け取ります。

### index.tsx

```tsx
import { useProps } from "./useProps";
import { Layout } from "./Layout";

type Props = {
  title: string;
  fetchUrl: string;
  isLargeRow?: boolean;
};

export const Row = ({ title, fetchUrl, isLargeRow }: Props) => {
  return (
    <Layout title={title} isLargeRow={isLargeRow} {...useProps(fetchUrl)} />
  );
};

```

index.tsxはRowコンポーネントのエンドポイントの役割です。

propsのfetchUrlはusePropsに渡す事で映像データの取得に使います。
titleとisLargeRowはUI表示に使うので、Layoutに渡しています。

## 4-4 useProps.tsでAPIからmovieデータを取得する

usePropsはindex.tsxから呼び出されて、Rowコンポーネントのロジック部分を責務としています。
**今回の役割はAPIから映画データを取得して、表示に使う形式に整形する事です。**

### useProps.ts

```ts
import { useEffect, useState } from "react";
import axios from "../../axios";

// ②データの整形
export type Movie = {
  id: string;
  name: string;
  poster_path: string;
  backdrop_path: string;
};

export const useProps = (fetchUrl: string) => {
  const [movies, setMovies] = useState<Movie[]>([]);

　　　// ①APIの取得はuseEffectを使う
  useEffect(() => {
    async function fetchData() {
　　　　　　　　　　　 const request = await axios.get(fetchUrl);
       // ②データの整形
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

  return movies;
};
```

ポイントを個別に見ていきましょう。

### ① APIの取得はuseEffectを使う
Reactでは外部からデータを取得する場合は、副作用として扱いuseEffectを利用します。

> useEffect は、コンポーネントを外部システムと同期させるための React フックです。


https://ja.react.dev/reference/react/useEffect

useEffectの基本的な使い方はこちらの記事で解説しています。

今回は依存配列をfetchUrlとしている為、Rowコンポーネントのレンダリング後に、fetchUrlに変更がある度にAPIを叩いてデータを更新します。

映画のデータはローカルのstateとして管理したいので、useStateを扱います。
APIは非同期処理なので、初期値は空配列に設定し、データが取れ次第更新しています。

### ② データの整形
APIから取得したデータが今回扱いたい型になっているとは限りません。
以下のようにconsole.logで取得した映画データを確認してみましょう。

```ts
const request = await axios.get(fetchUrl);
console.log(request.data.results);
```

このような形式になっています。

![](https://storage.googleapis.com/zenn-user-upload/7eaf0b1ebfba-20240507.png)

全てのデータが必要な訳ではないので、データの整形を行いましょう。

まず必要なデータの形式を定義します。

```ts
export type Movie = {
  id: string;
  name: string;
  poster_path: string; // 画像の表示に使用
  backdrop_path: string;　// 画像の表示に使用
};
```

次にMovieの型に合わせて、request.data.resultsの配列をmapで1つずつ抽出して整形し、moviesを作ります。

```ts
const movies = request.data.results.map((movie: Movie) => ({
        id: movie.id,
        name: movie.name,
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
      }));
```

#### mapについて

JavaScriptにおけるmapはArray(配列)インスタンスのメソッドです。
**配列を1つ1つ取り出して、処理を行い新しい配列を作る事が出来ます！**

https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/map

今回はrequest.data.resultsという不要な要素も含むオブジェクトの配列から、moviesという必要な要素だけのオブジェクトの配列への整形をmapで行いました。

## 余談：非同期処理について
今回のコードのfetchData関数は非同期処理を使っています。

```ts
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
```

非同期処理にはPromiseを使った方法とasync/awaitを使った方法があります。

**2つの違いとしてasync/awaitはES2017にて導入され、Promiseより直感的で扱いやすくしたものなので、自分は好んで使っています。**

**なぜAPI取得で非同期処理を行うのか？**

ざっくりとした同期処理と非同期処理のイメージは以下になります。

- 同期処理：コードを上から順番に処理していく、終わったら次の行に進む
- 非同期処理：並行して複数のコードを処理していく

もし、普通に同期処理だけでデータの取得を行う場合、データ取得の為の通信中は他の処理が止まってしまい、ページ自体の表示がとてつもなく遅くなってしまいます。

現代のWebサービスではCore Web VitalというGoogleによるサイト評価の指標があり、その中で初期のコンテンツ表示を最優先とする概念があります。

https://developers.google.com/search/docs/appearance/core-web-vitals?hl=ja#:~:text=Core%20Web%20Vitals%20%E3%81%AF%E3%80%81%E3%83%9A%E3%83%BC%E3%82%B8,%E3%81%99%E3%82%8B%E4%B8%80%E9%80%A3%E3%81%AE%E6%8C%87%E6%A8%99%E3%81%A7%E3%81%99%E3%80%82

**その為、初期のページ表示をいち早く行って、データが取れ次第、画面に反映していく形が外部API取得では主流な方法となっています。**

同期処理と非同期処理の違いや概念は、こちらの記事でとても詳しく解説されています。

https://jsprimer.net/basic/async/

## 4-5 Layoutコンポーネントにて画面表示を行う

### layout.tsx

```tsx
import { Movie } from "./useProps.ts";

type LayoutProps = {
  title: string;
  movies: Movie[];
  isLargeRow?: boolean;
};

export const Layout = ({ title, movies, isLargeRow }: LayoutProps) => {
  const image_url = "https://image.tmdb.org/t/p/original";
  return (
    <div>
      <h2>{title}</h2>
      <div>
        {movies.map((movie) => (
　　　　　　　　　　　　　　　　　　// ①DOM表示にmapを使う際はkeyを必ず設定する
          <img
            key={movie.id}
　　　　　　　　　　　　　　　　　　　　　　　　// ②使用する画像を使い分ける
            src={`${image_url}${
              isLargeRow ? movie.poster_path : movie.backdrop_path
            }`}
            alt={movie.name}
          />
        ))}
      </div>
    </div>
  );
};
```

Layoutコンポーネントはtitle、movies、isLargeRowをpropsに貰いRowコンポーネントの表示を責務としています。

以下の画像のように、「カテゴリータイトル + 画像横並び 」形式の見た目で作っていきます。

![](https://storage.googleapis.com/zenn-user-upload/9111c53385c1-20240507.png)

カテゴリータイトルはpropsとして貰ったものをそのまま表示し、画像横並びの部分はpropsで受け取ったmoviesをmapで表示させています。

### ① DOM表示にmapを使う際はkeyを必ず設定する

```ts
{movies.map((movie) => (
  <img
     // 必須！
     key={movie.id}
     src={`${image_url}${
          isLargeRow ? movie.poster_path : movie.backdrop_path
     }`}
     alt={movie.name}
   />
))}
```

ReactのtsxのDOM部分でmapを使う際はkeyの設定が必ず必要です。
もし欠けていた場合、 **「Warning: Each child in a list should have a unique "key" prop.」** といコンソールエラーが出ます。

![](https://storage.googleapis.com/zenn-user-upload/94562e3e3376-20240507.png)

これはReactのDOMツリーを正しく更新する為に、mapで抽出した配列の各要素に対してそれぞれを個別に認識する必要があります。

その為にkeyにはユニークな値を設定する必要があります。
ユニークな値として基本的にはデータ自体のIDが望ましいです！！

https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key

#### 極力、indexは使わない！！

keyがないとエラーが出るからといって、indexを無闇に使ってエラーを消す事は望ましい実装ではありません！！

```ts
{movies.map((movie, i) => (
    <img
       key={i}
       src={`${image_url}${
              isLargeRow ? movie.poster_path : movie.backdrop_path
       }`}
       alt={movie.name}
     />
))}
```

mapの際に生成されるindexはすなわち、map処理の要素の1番目、2番目といった配列内の順番に相当する値です！！

ですので、もし要素を追加、削除、場所をドラッグ&ドロップで更新！などで配列の順番が変わった際に、ズレが生じバグの原因になってしまうんですね。

この記事で理由について詳しく解説されています。

https://zenn.dev/luvmini511/articles/f7b22d93e9c182


## 4-6 Tailwind CSSにてLayoutコンポーネントをスタイリングする

Layout.tsxが実装できたら、スタイリングを行なっていきます！
Reactのスタイリング方法は色々ありますが、最近現場レベルでの使用がメジャーになっているTailwind CSSを利用します。

### プロジェクトにTaiwind CSSを導入する

https://tailwindcss.com/docs/guides/vite

以下のコマンドでTailwindをインストール・初期化します。

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

次にプロジェクトルートに作成されたtailwind.config.jsに以下をコピペします。

```js
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

ルートのcssファイルにTailwindを読み込ませる為に、index.cssに以下を書き込みます。

```css
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';
```

ここまでしたら、以下コマンドで一旦プロジェクトをプロジェクトを再ビルドして下さい。

```bash
npm run dev
```

これでTailwindの導入は完了です！

### Layoutコンポーネントのスタイリング
さて、先ほどのLayoutコンポーネントをTailwindを使って以下のようにスタイリングして下さい。

```tsx
export const Layout = ({ title, movies, isLargeRow }: LayoutProps) => {
  const image_url = "https://image.tmdb.org/t/p/original";
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
            alt={movie.name}
          />
        ))}
      </div>
    </div>
  );
};
```

Tailwind CSSではclassNameに"ml-5"などのクラス名を入力する事で、cssを当てる事が出来ます。
**ちなみに"ml-5"はmargin-left: 1.25rem; を意味します！**

https://tailwindcss.com/docs/margin

スタイリングを行なって、以下のような画面表示が出来たらこの章は完了です！！

![](https://storage.googleapis.com/zenn-user-upload/e605b331c53c-20240507.png)

## 余談：Tailwind CSSとは
Tailwind CSSは「ユーティリティファースト」なCSSフレームワークです。

HTMLやjsx、tsxなどに直接クラス名を入力する事でCSSを当てる事が出来る為、スタイリング実装をcssファイルに分けて行う必要がなく簡単に行なうことが出来ます。(一昔前のBootstrapのようなイメージです)

今回はマージン以外にも様々なclassを使っています。

- Padding：p-5
- Text Color：text-white
- flex：flex
- Overflow：overflow-y-hidden

Tailwindではよく使うclassNameはある程度、頭に入れておいた方が実装がスムーズになるため、よく使うものは公式ドキュメントで確認しておくと良いでしょう。

https://tailwindcss.com/docs/installation

また、Reactのスタイリング手段は様々な選択肢があります。

- styled-components
- emotion
- Chakra UI

これらの特徴の違いは以下の記事にて分かりやすく解説されています。

https://zenn.dev/chiji/articles/b0669fc3094ce3#tailwind-css