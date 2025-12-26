この章ではこんな感じで、スクロール時に一番上に表示されるHeaderコンポーネントを作っていきます。

![](https://storage.googleapis.com/zenn-user-upload/cf253b188b10-20240507.png)

## 6-1 必要な機能
- Netflixロゴ
- ユーザーアバター画像
- スクロールに合わせてバナーの背景を黒く切り替える

このコンポーネントではロジックはスクロール時のフェードの判定ぐらいしかなく、基本的にはDOM部分が中心になります。

## 6-2 index.tsxでHeaderコンポーネントのエンドポイントを作る
もうお馴染みの作業ですね！
Headerコンポーネントのディレクトリを作り、index.tsx、useProps.ts、Layput.tsxを作成しましょう。

また、App.tsxを以下の様に修正してHeaderコンポーネントを呼び出します。

### App.tsx

```tsx
function App() {
  return (
    <div className="App">
      // 追加
      <Header />
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

次にindex.tsxにエンドポイントを定義していきます。
Headerコンポーネントは特にpropsは受け取らないので、以下の様になります。

### index.tsx

```tsx
import { useProps } from "./useProps";
import { Layout } from "./Layout";

export const Header = () => {
  return <Layout {...useProps()} />;
};
```
前回の章でお馴染みのスプレッド構文でpropsは渡しています。
ここまでは問題なさそうですね。

## 5-3 usePropsにロジックを書く
今回のusePropsではHeaderコンポーネントの背景を黒くするか、透明のままかの判定を行います。

判定結果はstateのshowで管理し、Layoutコンポーネント側に渡します。

### useProps.ts

```ts
import { useEffect, useState } from "react";
export const useProps = () => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    // ① scrollが100を超えたか判定
    const handleShow = () => {
      setShow(window.scrollY > 100);
    };

　　　　　　　// ②イベントリスナーの設定
    window.addEventListener("scroll", handleShow);
    return () => {
      window.removeEventListener("scroll", handleShow);
    };
  }, []);

  return {
    show,
  };
};
```

さてポイントを見ていきましょう。

### ① scrollが100を超えたか判定
handleShowでスクロールが100を超えた際にshow=true、そうでない場合にfalseを返す処理を書いています。

```ts
const handleShow = () => {
      setShow(window.scrollY > 100);
};
```

window.scrollYはwindowインターフェースの水平方向のスクロールの値のプロパティです。
今回の様にページ最上部から縦のどれぐらいスクロールしたかの値を取得出来ます。

https://developer.mozilla.org/ja/docs/Web/API/Window/scrollY

### ② イベントリスナーの設定
ReactではuseEffectを使ってイベントリスナーの登録・削除が出来ます。

```ts
useEffect(() => {
   ~~~

    window.addEventListener("scroll", handleShow);
    return () => {
      window.removeEventListener("scroll", handleShow);
    };
  }, []);
```

今回はHeaderコンポーネントがマウント(表示)されている間は、window.addEventListenerによりscrollされる度にhandleShowが発火します。

**しかしaddEventListenerは適切なタイミングで削除しないと永遠に登録されたままです。**

今回の場合だと、Heraderコンポーネントが表示されてない時もスクロールの度にhandleShowを呼び続けてしまいます。

そこでuseEffetcのクリーンアップ関数(return部分)にwindow.removeEventListenerを登録して、Headerコンポーネントがアンマウント(非表示になる)タイミングでイベントを削除しています。

https://developer.mozilla.org/ja/docs/Web/API/EventTarget/addEventListener

https://developer.mozilla.org/ja/docs/Web/API/EventTarget/removeEventListener

## 5-4 Layoutで見た目を作る
さてLayoutコンポーネントに入っていきましょう。
先ほどusePropsで扱ったshowをpropsとして受け取ります。

### layout.tsx

```tsx
type Props = {
  show: boolean;
};
export const Layout = ({ show }: Props) => {
  return (
    <div
      className={`fixed top-0 w-full h-16 p-5 z-10 flex justify-between transition-all ease-in duration-500 ${show ? "bg-black" : ""}`}
    >
      <img
        className="fixed left-5 w-20 object-contain"
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/1920px-Netflix_2015_logo.svg.png"
        alt="Netflix Logo"
      />
      <img
        className="fixed right-5 w-8 object-contain"
        src="https://i.pinimg.com/originals/0d/dc/ca/0ddccae723d85a703b798a5e682c23c1.png"
        alt="Avatar"
      />
    </div>
  );
};
```

特筆すべき点はありません。
Netflixとアバターのロゴは適当に取って来ています。

さて、Headerコンポーネントが以下の様な動きをしたら、この章は完成です！！

![](https://storage.googleapis.com/zenn-user-upload/9c998b4c72b1-20240507.png)
