# TanStack Query 新実装計画

## 🎯 優先度別タスクリスト

### **高優先度 (即座に対応が必要)**

1. SQLiteサービス関数をTanStack Queryのクエリ関数として使用できるよう非同期処理を適切に実装
2. useBooks()フック作成 - 全書籍取得用のカスタムフック
3. useBook(id)フック作成 - 特定書籍取得用のカスタムフック

### **中優先度 (順次対応)**

4. useSeriesBooks()フック作成 - シリーズ別書籍取得用のカスタムフック
5. 既存のBooksProviderとTanStack Queryの併用方法を検討・統合
6. ホーム画面でuseBooks()フックを使用してローディング・エラ ーハンドリングを実装
7. 書籍詳細画面でuseBook(id)フックを使用する実装に変更

### **低優先度 (後回し可能)**

8. シリーズ画面でuseSeriesBooks()フックを使用する実装に変更
9. **useRefreshBooks()フック作成** - 手動データ再取得機能（SWRのtrigger相当）
10. **各画面にrefetch/invalidateボタン追加** - プルリフレッシュ以外の手動更新手段の提供

## 📋 実装の方向性

現在のプロジェクトは既存のBooksProviderでContext APIを使用していますが、TanStack Queryを導入してサーバー状態管理を改善する方針です。既存のサービス層（bookService、seriesService）を活用しながら、段階的にTanStack Queryベースの実装に移行していきます。

## 🔧 技術的な考慮事項

### 既存アーキテクチャとの統合

- BooksProviderの状態管理とTanStack Queryのキャッシュ機能の併用方法
- SQLiteサービス層の非同期処理対応
- エラーハンドリングの統一化

### 実装順序の理由

1. **基盤整備**: サービス関数の非同期対応が全ての基礎となる
2. **コアフック**: useBooks/useBookが最も使用頻度が高い
3. **画面統合**: 既存画面への段階的適用で安全な移行を実現

## 📚 参考実装例（todos.mdより）

```tsx
// 目標とする実装形式
export const useBooks = () => {
  return useQuery({
    queryKey: ['books'],
    queryFn: bookService.getAllBooks,
  })
}

export const useBook = (id: string) => {
  return useQuery({
    queryKey: ['books', id],
    queryFn: () => bookService.getBookById(id),
    enabled: !!id,
  })
}

// データ再取得機能
export const useRefreshBooks = () => {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: ['books'] })
}
