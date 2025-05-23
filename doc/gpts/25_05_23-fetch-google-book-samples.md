# Google Books APIを使った検索サンプル

Expoでタイトル入力からGoogle Books APIを使って検索し、`@tanstack/react-query`でデータ取得を行う最小構成のサンプル

---

## ✅ 使用ライブラリ

* Expo (React Nativeベース)
* @tanstack/react-query
* axios

---

## 📦 インストール（ターミナル）

```sh
npx create-expo-app google-books-search
cd google-books-search

npm install @tanstack/react-query axios
```

---

## 🧠 最低限のUIとロジック実装

### 📁 `App.js`

```jsx
import React, { useState } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet } from 'react-native';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import axios from 'axios';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BookSearch />
    </QueryClientProvider>
  );
}

function BookSearch() {
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['books', search],
    queryFn: () =>
      axios
        .get(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(search)}`)
        .then(res => res.data.items || []),
    enabled: !!search,
  });

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="本のタイトルを入力"
        value={query}
        onChangeText={setQuery}
      />
      <Button title="検索" onPress={() => setSearch(query)} />

      {isLoading && <Text>読み込み中...</Text>}
      {error && <Text>エラーが発生しました。</Text>}

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={styles.item}>
            {item.volumeInfo.title}
          </Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 50 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10 },
  item: { paddingVertical: 8, borderBottomWidth: 0.5 },
});
```

---

## 💡 ポイント解説

* `TextInput`で入力 → `Button`で検索キーワードを`search`にセット。
* `useQuery`は`enabled`で実行を制御。検索時だけAPI呼び出し。
* `axios`でGoogle Books APIへGETリクエスト。
* 結果は`FlatList`で表示。

---

必要に応じて、画像・著者名なども表示できます。
要望があれば次のステップへ進めますよ！
