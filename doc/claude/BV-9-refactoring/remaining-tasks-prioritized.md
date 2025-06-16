# 状態管理リファクタリング 残りタスク詳細計画

**作成日**: 2025年6月15日  
**現在の進行状況**: Phase 3完了、Phase 4開始

## 📊 現在の完了状況

- ✅ **Phase 1: 設計・準備** (100%)
- ✅ **Phase 2: 画面固有フックの実装** (100%)
- ✅ **Phase 3: 画面の段階的移行** (100%)
  - ✅ ホーム画面 → `useHomeScreen`
  - ✅ 登録画面 → `useBookRegistration`
  - ✅ シリーズ詳細画面 → `useSeriesDetail`
  - ✅ 書籍詳細モーダル → `useDeleteBook`
- 🔄 **Phase 4: クリーンアップ・整理** (進行中)

---

## 🎯 残りタスク優先順位別詳細

### 🔴 **最高優先度タスク** (完了必須)

#### Task 4.1: RegisterDetailModalの移行
**ファイル**: `src/features/register/RegisterDetailModal.tsx:37`

**現状問題**:
```typescript
const { addBook, createSeries } = useBooksContext(); // 古いProvider使用
```

**必要な作業**:
1. `useBooksContext`を削除
2. `useAddBook`と`useCreateSeries`フックに置き換え
3. エラーハンドリングとローディング状態の更新
4. Toast通知の確認（フック内で処理済みかチェック）

**影響範囲**: 書籍登録機能全体  
**推定時間**: 30分

---

#### Task 4.2: SearchResultsコンポーネントの移行  
**ファイル**: `src/components/manga/SearchResults.tsx:64`

**現状問題**:
```typescript
const { addBook } = useBooksContext(); // 古いProvider使用
```

**必要な作業**:
1. `useBooksContext`を削除
2. `useAddBook`フックに置き換え
3. 楽観的更新とエラーハンドリングの確認
4. コンポーネントのprops interfaceの更新（必要に応じて）

**影響範囲**: 検索結果からの書籍登録機能  
**推定時間**: 20分

---

### 🟡 **高優先度タスク** (安全性確保)

#### Task 4.3: 全画面動作確認とテスト
**対象画面**:
- ホーム画面 (`/`)
- 登録画面 (`/register`) 
- シリーズ詳細画面 (`/series/[seriesId]`)
- 書籍詳細モーダル

**確認項目**:
1. データ取得・表示の正常動作
2. 書籍登録・削除機能の動作
3. エラーハンドリングの確認
4. ローディング状態の表示
5. Toast通知の正常表示

**推定時間**: 45分

---

#### Task 4.4: BooksProviderの段階的削除
**対象ファイル**: `src/components/providers/books-provider.tsx`

**作業手順**:
1. 全コンポーネントの移行完了確認
2. `useBooksContext`の使用箇所ゼロを確認
3. BooksProviderファイルの削除
4. root-layout-providerからの削除

**推定時間**: 15分

---

### 🟢 **中優先度タスク** (保守性向上)

#### Task 4.5: 未使用フックファイルの整理
**対象ディレクトリ**: `src/hooks/`

**削除対象ファイル**:
- `useBookData.ts` (非推奨)
- `useBookMutations.ts` (useAddBook等に統合済み)
- `useBookDeletion.ts` (useDeleteBookに統合済み)
- `useBulkOperations.ts` (現在未使用)
- `useDataTransform.ts` (画面固有フックに統合済み)
- `useLoadingStates.ts` (React Query内で管理)

**確認が必要なファイル**:
- `useErrorHandler.ts` (共通エラーハンドリングで使用の可能性)
- `useUndo.ts` (将来的な機能で使用の可能性)

**推定時間**: 30分

---

#### Task 4.6: SeriesSelectorコンポーネントの確認
**ファイル**: `src/components/series/SeriesSelector.tsx` (推測)

**確認内容**:
1. 現在のデータ取得方法の確認
2. `useSeriesOptions`フックとの統合
3. パフォーマンス最適化の確認

**推定時間**: 20分

---

### 🔵 **低優先度タスク** (品質向上)

#### Task 4.7: テストカバレッジの拡充
**対象コンポーネント**:
- `RegisterDetailModal`
- `SearchResults`
- migrated screens (統合テスト)

**テスト項目**:
1. フック統合後の機能テスト
2. エラーケースのテスト
3. ユーザーインタラクションテスト

**推定時間**: 60分

---

#### Task 4.8: 型定義とドキュメントの更新
**対象ファイル**:
- `CLAUDE.md` - アーキテクチャ説明の更新
- `src/types/hooks.ts` - 不要型定義の削除
- JSDocコメントの最終確認

**推定時間**: 30分

---

## 📋 実行計画

### 即座に実行 (1時間以内)
1. **Task 4.1** RegisterDetailModal移行 (30分)
2. **Task 4.2** SearchResults移行 (20分)
3. **Task 4.4** BooksProvider削除 (15分)

### 当日中に実行 (残り1時間)
4. **Task 4.3** 全画面動作確認 (45分) 
5. **Task 4.5** 未使用ファイル整理 (30分)

### 翌日以降 (品質向上)
6. **Task 4.6** SeriesSelector確認 (20分)
7. **Task 4.7** テスト追加 (60分)
8. **Task 4.8** ドキュメント更新 (30分)

---

## 🎯 成功基準

### 機能要件
- [ ] 全ての書籍関連操作が正常動作する
- [ ] エラーハンドリングが適切に機能する
- [ ] パフォーマンスが改善される（再レンダリング削減）

### 技術要件  
- [ ] `useBooksContext`の使用箇所がゼロになる
- [ ] BooksProviderが完全に削除される
- [ ] TypeScriptエラーがゼロになる
- [ ] ESLintエラーがゼロになる

### 品質要件
- [ ] テストカバレッジが維持される
- [ ] ドキュメントが最新状態になる
- [ ] 未使用コードが削除される

---

## ⚠️ リスク要因と対策

### リスク 1: 隠れた依存関係
**対策**: 各タスク完了後に全機能テストを実行

### リスク 2: 未発見のuseBooksContext使用箇所
**対策**: グローバル検索で`useBooksContext`の使用箇所を再確認

### リスク 3: パフォーマンス回帰
**対策**: 各画面の動作速度を移行前後で比較

---

## 📈 期待される最終効果

### パフォーマンス向上
- 不要な再レンダリング削減: **推定70%削減**
- メモリ使用量最適化: **推定30%削減**
- アプリ起動速度向上: **推定15%向上**

### 開発体験向上
- デバッグの容易性: 画面固有の状態管理
- 機能追加の簡単さ: 明確な責務分離
- テストの書きやすさ: 単一責任フック

### 保守性向上
- コードの可読性向上
- バグの発生率減少
- 新機能開発速度向上

---

**総推定作業時間**: 約4.5時間  
**必須タスク完了予定**: 1時間以内  
**全タスク完了予定**: 2日以内