# book-vault

各ストアで購入した本を管理するための､ネイティブアプリ｡

## todo

- serverにhonoでapiを設置
- expo sqliteでローカルDBを作成
- google books apiへの検索リクエスト処理を作成

## folder structure

```bash
tree -I node_modules

book-vault/
├── client/        # Expo + React Native
└── server/        # Hono + D1

```

## tools stack

| application    | stack                |
|-----------|---------------------|
| client | React Native, Expo, Drizzle |
| server  | Hono, Cloudflare D1 |
