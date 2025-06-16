# SQLite Fetcher + TanStack Query 実装ガイド

## 1. Fetcher関数を作成

※今回のプロジェクトでは、サービスを使用するためスキップ

## 2. Custom Hookを作成

```tsx
 const fetchBooks = await bookService.getAllBooks();
 const fetchBookById = await bookService.getBookById();

export const useBooks = () => {
  return useQuery({
    queryKey: ['books'],
    queryFn: fetchBooks,
  })
}

export const useBook = (id: string) => {
  return useQuery({
    queryKey: ['books', id],
    queryFn: () => fetchBookById(id),
    enabled: !!id,
  })
}
```

一例としてコードのようにしているが、`await bookService.getAllBooks()`をそのままuseQueryに渡せるならそっちのほうがいい

## 3. 画面で使用する例

```tsx
export default function HomeScreen() {
  const { data: books, isLoading, error } = useBooks()

  if (isLoading) return <Text>Loading...</Text>
  if (error) return <Text>Error: {error.message}</Text>

  return (
    <FlatList
      data={books}
      renderItem={({ item }) => <Text>{item.title}</Text>}
    />
  )
}
```

## 4. _layout.tsxにProviderを追加(この操作は完了している)

```tsx
// app/_layout.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <Stack />
    </QueryClientProvider>
  )
}
```
