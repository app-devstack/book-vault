# Expo（React Native）と React Query を使った、Google Books API から書籍情報を検索手順

---

## 🔧 必要なパッケージのインストール

まず、Expo プロジェクトに React Query を導入します。

```bash
npm install @tanstack/react-query
npx expo install @react-native-community/netinfo
```



`@react-native-community/netinfo` は、ネットワーク状態の監視に使用します。([DEV Community][1])

---

## 🏗️ QueryClient の設定

React Query を使用するために、`QueryClient` を作成し、アプリ全体を `QueryClientProvider` でラップします。([Daily.dev][2])

```tsx
// App.tsx
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Text } from 'react-native';
import BookSearch from './BookSearch';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BookSearch />
    </QueryClientProvider>
  );
}
```



---

## 🔍 書籍検索コンポーネントの作成

`useQuery` を使用して、Google Books API からデータを取得します。

```tsx
// BookSearch.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, FlatList, Text, Image } from 'react-native';
import { useQuery } from '@tanstack/react-query';

const fetchBooks = async (query: string) => {
  const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`);
  if (!response.ok) {
    throw new Error('データの取得に失敗しました');
  }
  return response.json();
};

export default function BookSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [submittedTerm, setSubmittedTerm] = useState('');

  const { data, error, isLoading } = useQuery(
    ['books', submittedTerm],
    () => fetchBooks(submittedTerm),
    {
      enabled: !!submittedTerm,
    }
  );

  return (
    <View style={{ padding: 16 }}>
      <TextInput
        placeholder="書籍名を入力"
        value={searchTerm}
        onChangeText={setSearchTerm}
        style={{ borderWidth: 1, padding: 8, marginBottom: 8 }}
      />
      <Button title="検索" onPress={() => setSubmittedTerm(searchTerm)} />

      {isLoading && <Text>読み込み中...</Text>}
      {error && <Text>エラーが発生しました: {error.message}</Text>}

      {data && (
        <FlatList
          data={data.items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ flexDirection: 'row', marginVertical: 8 }}>
              {item.volumeInfo.imageLinks?.thumbnail && (
                <Image
                  source={{ uri: item.volumeInfo.imageLinks.thumbnail }}
                  style={{ width: 50, height: 75, marginRight: 8 }}
                />
              )}
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: 'bold' }}>{item.volumeInfo.title}</Text>
                <Text>{item.volumeInfo.authors?.join(', ')}</Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}
```



---

## 📌 補足

* Google Books API の使用には API キーは不要ですが、リクエスト数が多い場合は取得を検討してください。
* React Query の `useQuery` フックは、データのキャッシュや再取得の管理を自動で行ってくれます。
* ネットワーク状態の変化に応じて再取得を行いたい場合は、`@react-native-community/netinfo` を活用できます。([Daily.dev][2], [DEV Community][1])

---

この実装により、ユーザーが入力したキーワードに基づいて Google Books API から書籍情報を取得し、リスト表示するアプリが完成します。さらに、検索結果の詳細表示やお気に入り機能などを追加することで、より実用的なアプリに発展させることができます。

[1]: https://dev.to/hokagedemehin/how-to-set-up-an-expo-react-native-project-with-react-query-3oeb?utm_source=chatgpt.com "How to Set Up an Expo React Native Project with React Query"
[2]: https://daily.dev/blog/from-zero-to-hero-usequery-react-tutorial?utm_source=chatgpt.com "From Zero to Hero: UseQuery React Tutorial - Daily.dev"
