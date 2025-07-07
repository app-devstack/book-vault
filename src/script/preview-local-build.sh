#!/bin/bash

# bash src/script/preview-local-build.sh

set -e  # エラー時に停止

echo "🔍 TypeScript型チェックを実行中..."
bun run typecheck

echo "✨ コードフォーマットを実行中..."
# フォーマット前の状態を記録
git add -A
git_status_before=$(git status --porcelain)

bun run format > /dev/null

# フォーマット後の変更をチェック
git add -A
git_status_after=$(git status --porcelain)

if [ "$git_status_before" != "$git_status_after" ]; then
    echo "📝 コードフォーマットにより変更が発生しました。処理を終了します。"
    echo "変更されたファイル:"
    git diff --name-only HEAD
    exit 1
fi

echo "📦 Expo依存関係をチェック中..."
bun run expo:check
# expo:checkの出力をキャプチャ
# expo_output=$(bun run expo:check 2>&1)
# echo "$expo_output"

# インストールが推奨されているかチェック
# if echo "$expo_output" | grep -q "expo install"; then
#     echo "📥 依存関係のインストールが推奨されました。"
#     echo "✅ 'y' を自動実行して処理を停止します。"
#     echo "y" | bun run expo:check
#     echo "🛑 依存関係インストール後、処理を停止しました。"
#     echo "再度スクリプトを実行してください。"
#     exit 2
# fi

echo "🚀 全てのチェックが完了しました。ビルドを開始します..."

build_version=$(git log -1 --pretty=format:"%h %s")
echo "ビルドバージョン: '${build_version}'"
echo "${build_version}" >> .env.local

echo "📱 プリビルドを実行中..."
bun run prebuild

echo "🏗️ ローカルプレビュービルドを実行中..."
bun run preview:local

echo "📱 APKファイルを移動中..."
# distディレクトリを作成
mkdir -p dist

# 生成されたAPKファイルを検索（最新のもの）
apk_file=$(find . -name "*.apk" -type f -not -path "./dist/*" -printf '%T@ %p\n' | sort -n | tail -1 | cut -d' ' -f2-)

if [ -n "$apk_file" ] && [ -f "$apk_file" ]; then
    # タイムスタンプ付きファイル名を生成
    timestamp=$(date +"%Y%m%d_%H%M%S")
    new_apk_name="book-vault_${timestamp}.apk"

    # APKファイルを移動
    mv "$apk_file" "dist/${new_apk_name}"
    echo "✅ APKファイルを移動しました: dist/${new_apk_name}"
else
    echo "⚠️  APKファイルが見つかりませんでした。"
fi

echo "✅ ローカルビルドが完了しました！"