今回Netlifx-cloneとして表示するデータはTMDBから拝借します。
TMDBはエンタメ系の情報を多く抱えるデータベースです。

https://www.themoviedb.org/?language=ja

この章ではTMDBからAPIが取得できる事が確認出来たらOKです！
またAPIやHTTPメソッド、HTTPステータスコードについても余談的に解説を入れています。

## 1-1 TMDBのAPIKEYを取得する
TMDBのAPIを利用する為には、ユーザー登録をして個別に割り当てられるAPI_KEYを入手する必要があります。

https://www.themoviedb.org/?language=ja

### TMDBにユーザー登録する
TMDBを開いてユーザー登録して下さい。
トップページから右上の赤枠の「TMDBに参加する」をクリックします。

![](https://storage.googleapis.com/zenn-user-upload/ae04dd192cf1-20240507.png)

その後、ユーザー名、パスワード、メールアドレスの入力をしてユーザー登録を行います。

ユーザー登録完了後に、ログインして以下の画面が表示されればOKです！

![](https://storage.googleapis.com/zenn-user-upload/06da84172efc-20240507.png)

### API_KEYを取得する
TMDBのユーザー登録が完了したら、API_KEYを取得していきます。

ユーザー画面から以下の「設定」を開きます。

![](https://storage.googleapis.com/zenn-user-upload/f92e5ff27779-20240507.png)

設定画面で「API」を開いて、APIキーに書いてある文字列をコピーしておきます。

この値は環境変数として実装時の.envファイルやデプロイ時にVercelの設定で使います。

![](https://storage.googleapis.com/zenn-user-upload/a07b419cf189-20240507.png)

API_KEYの値が確認出来たらOKです！

## 余談：APIとは
API_KEYが取得出来た所でAPIについての理解を深めていきましょう！

APIとはApplication Programming Interfaceの略で、その名の通り **「ソフトウェアやプログラム同士を繋ぐインターフェース」** です！

プログラム同士の連携は基本的にAPIを介して行います。

実際の世の中で動いているプロダクトは多くのプログラム同士が連携する事で成り立っています。

### APIの活用例
APIを使って何が出来るのかを簡単に解説していきます。

**データ連携**

異なるサービス間でデータを連携させることができます。
例えば、ECサイトが配送業者のAPIを利用して配送ステータスを確認することができます。

今回のNetflix-cloneもこれにあたり、APIを利用してTMDBから映像データを取得しています。

**機能の拡張**

自社のアプリケーションに他社の機能やデータを組み込むことで、製品の機能を拡張することが可能です。

例えば、ログイン機能にGoogle、Facebook、TwitterなどのAPIを使ったり、決済機能でStripe、Paypalなど連携したりで使われます。

**オートメーション**

定期的なデータ取得や更新など、繰り返し行う作業を自動化するためにAPIを活用することができます。

### APIの基礎概念
APIの仕様について解説すると長くなるので、チュートリアルに支障が出ない範囲で簡単に基礎概念をまとめました。

1. エンドポイント (Endpoint)
   - APIの具体的なURLのこと
2. リクエスト (Request)
   - APIを使用してデータやサービスを要求する行為
   - HTTPメソッド（GET、POST、PUT、DELETEなど）を用いて指定されます
3. レスポンス (Response)
   - リクエストに対するAPIの応答
   - データはJSONやXML形式で返されることが多いです
4. 認証 (Authentication)
   - APIを安全に使用するためのプロセス
   - APIキーやOAuthトークンなどを使って認証を行います

ここではそれぞれの単語のイメージが掴めればOKです！
Postmanで実際にAPIを触る時に具体例の解説をしていきます。

## 1-2 PostmanでデータがGET出来る事をテストする
APIに関する理解を深める為に、Postmanを使ってAPIのテストをしてみましょう。

### Postmanとは？
Postmanはローカルでのテスト用のAPIのリクエストを手軽に生成できるサービスです。

https://www.postman.com/


Postmanを使う事で、アプリケーションが無い状態でもAPIの挙動を確認出来る為、設計・テストなどのフェイズで使う事が多いです。

### Postmanを使ってTMDBのjsonを取得する
まずはPostmanでアカウントを作って下さい。

https://www.postman.com/

WebでもデスクトップでもどちらでもOKです。
個人的には毎日使うアプリ以外はWebにしてブックマークしています。

ログインしたら設定を日本語に変えておくと使いやすくなります。

右上の歯車アイコンをクリック→「setting」で設定メニューが開けます。

![](https://storage.googleapis.com/zenn-user-upload/bff6cea9cfa0-20240507.png)

「General」を選択しスクロールした先にある「Language」を日本語に変えればOKです。

![](https://storage.googleapis.com/zenn-user-upload/2f4c29f5b3ce-20240507.png)

さて、Postmanを使う準備が整ったら、workspaceを作っていきます。
Home画面から右上の「Workspaces」→「Create Workspace」をクリック。

![](https://storage.googleapis.com/zenn-user-upload/e2842d878404-20240507.png)

適当な名前で作って大丈夫です！
Workspaceを作ったら、実際にAPIのリクエストを作っていきます。

「新規」をクリックして、「HTTP」を選択します。

![](https://storage.googleapis.com/zenn-user-upload/16de9b40f399-20240507.png)

作成された画面を見ていきましょう。

![](https://storage.googleapis.com/zenn-user-upload/ba50cce3be6b-20240507.png)
このリクエストではTMDBからNetflixのトレンドを取得出来るかをテストしてみます。

今回はGETリクエストを使うので、「GET」と書いてある部分は変えなくてOKです。
GETリクストは指定したエンドポイントからデータを取得する際に使います。

以下のエンドポイントをフォームに入力し、「送信」をクリックして下さい。

```
https://api.themoviedb.org/3/trending/all/week?api_key={あなたのAPI_KEY}
&watch_region=JP&language=ja-JP
```

上手く行ったら、以下の画像のようにボディ部分にjsonデータが返ってきます。

![](https://storage.googleapis.com/zenn-user-upload/f610e3e168f9-20240507.png)

データが来ている事が確認出来たら、PostmanでのテストはOKです！！
より具体的なPostmanの使い方を知りたい場合、こちらの記事がオススメです！

https://zenn.dev/nameless_sn/articles/postman_tutorial

## 余談：HTTPステータスコードについて
HTTPステータスコードとはレスポンスのステータスコードで、リクエストが正常に完了したかを示すものです。

https://developer.mozilla.org/ja/docs/Web/HTTP/Status

といきなり言われても、ピンとこないと思うので、Postmanでよく見かけるステータスコードの具体例を見ていきましょう。

### 200 OK
これは先ほどデータがうまく取得できたケースです！
赤枠を見ると「200 OK」と書かれていると思います。

![](https://storage.googleapis.com/zenn-user-upload/f20c5e129b19-20240507.png)

これがHTTPステータスコードです。
200番台は成功のレスポンスで正常にデータが取れた事を表しています。

最もよく見かけるステータスコードだと思います。

### 404 Not Found
ここからは上手く取得できなかったパターンも見ていきましょう！
先ほどのPostmanのエンドポイントを以下に書き換えて下さい。
(存在しないURLにしてます)

```
https://api.themoviedb.org/trending/all/week?api_key={あなたのAPI_KEY}
&watch_region=JP&language=ja-JP
```

そうすると「404 Not Found」を返します！

![](https://storage.googleapis.com/zenn-user-upload/3e58c5948000-20240507.png)

これはTMDBに存在しないエンドポイントを指定した場合に返されるステータスコードです。

ネットサーフィンしているとたまに見かけると思います。

![](https://storage.googleapis.com/zenn-user-upload/64179c0ea7ad-20240507.png)

### 401 Unauthorized
次に認証エラーを見ていきましょう。
API_KEYの部分を空白にしたリクエストを叩きます。

```
https://api.themoviedb.org/3/trending/all/week?api_key=
&watch_region=JP&language=ja-JP
```

そうすると「401 Unauthorized」が返ってきます。

![](https://storage.googleapis.com/zenn-user-upload/4e9b72c1ecea-20240507.png)

エラーメッセージに「Invalid API key: You must be granted a valid key.」と書いてあるので、API_KEYが間違ってる為、認証エラーになった事が分かりますね。

### HTTPステータスコード一覧
ここまでHTTPステータスコードの中で最低限知っていて欲しい

 - 200 OK
 - 404 Not Found
 - 401 Unauthorized

について見ていきました。

より詳細にHTTPやその周辺の概念について理解を深めたい方はこちらをご覧ください。

**HTTPステータスコード一覧**

https://qiita.com/unsoluble_sugar/items/b080a16701946fcfce70#404-not-found

**HTTPの概念**

https://qiita.com/sauna1137/items/e93a3e96b994b80dbce6

[Webを支える技術](https://amzn.to/3JOZcu7)




