## Cloudflare Durable Objectの設定方法

参考: https://developers.cloudflare.com/durable-objects/get-started/

---

### ✅ 全体の流れ（Durable Objects + Hono + Expo）

---

#### **1. Cloudflare でプロジェクトを作成する**

* `wrangler` CLI を使ってプロジェクトを初期化（テンプレート選択：TypeScript）
* `Durable Object` を使う設定を `wrangler.toml` に記述する

📝 補足：

* Cloudflare Workers 上で Hono を使うには、**Hono を `npm install`** しておく必要があります

---

#### **2. Durable Object クラスを作成する**

* 買い物リストを保持するためのクラスを `DurableObject` として定義
* `GET`/`POST` 等のリクエストでリストを読み書きできるようにする

📝 補足：

* リストの単位（ユーザーごと？リストIDごと？）に応じて `idFromName(...)` の使い方を調整します

---

#### **3. Hono の API を作成する**

* DO にアクセスするエンドポイントを Hono 経由で公開
* `POST /list/:id/items` → DO にデータを保存
* `GET /list/:id/items` → DO からデータを取得

📝 補足：

* Worker → DO 間の通信は `stub.fetch(...)` を使います
* 必ず `DurableObjectNamespace` を Hono の `env` に定義して使います

---

#### **4. Expo から Hono API にリクエストを送る**

* SQLite から取得した買い物リストを `POST` で送信
* クラウドのリストを `GET` で取得して同期

📝 補足：

* オフライン対応を考慮するなら「最後の同期時刻」なども送ると良いです
* Firebase Auth などを併用して「誰のリストか」を認識できるとさらに実用的です

---

### 🔁 まとめると

| ステップ | 内容                  | 目的               |
| ---- | ------------------- | ---------------- |
| ①    | Cloudflare プロジェクト作成 | Hono + DO の環境を用意 |
| ②    | Durable Object 定義   | データをクラウドに保存      |
| ③    | Hono で API 定義       | クライアントと DO の橋渡し  |
| ④    | Expo から通信実装         | 実際にデータを送受信       |

---

他に気になる部分（たとえば認証、同期タイミング、複数ユーザー対応）もあれば、そこで深掘りできます！
