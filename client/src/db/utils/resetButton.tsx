// components/DevResetButton.tsx
import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';
import React from 'react';
import { Alert, Button, StyleSheet, View } from 'react-native';

export default function ResetButton() {
  // 開発環境でのみ表示
  if (!__DEV__) return null;

  const completeReset = async () => {
    try {
      const dbName = 'your-database.db'; // 実際のDB名

      console.log('🔄 データベースリセット開始...');

      // 既存接続を閉じる
      try {
        const existingDb = await SQLite.openDatabaseAsync(dbName);
        await existingDb.closeAsync();
        console.log('✓ 既存DB接続を閉じました');
      } catch (e) {
        console.log('既存DBなし、新規作成します', e);
      }

      // Expo Go環境でのファイル削除
      const dbUri = `${FileSystem.documentDirectory}SQLite/${dbName}`;

      try {
        const fileInfo = await FileSystem.getInfoAsync(dbUri);
        if (fileInfo.exists) {
          await FileSystem.deleteAsync(dbUri, { idempotent: true });
          console.log('✓ データベースファイル削除');
        }
      } catch (deleteError) {
        console.log('ファイル削除スキップ:', deleteError);

        // 削除できない場合は手動でテーブル削除
        const db = await SQLite.openDatabaseAsync(dbName);
        await db.execAsync(`
          PRAGMA foreign_keys = OFF;
          DROP TABLE IF EXISTS books;
          DROP TABLE IF EXISTS series;
          DROP TABLE IF EXISTS shops;
          DROP TABLE IF EXISTS __drizzle_migrations;
          PRAGMA foreign_keys = ON;
        `);
        await db.closeAsync();
        console.log('✓ テーブル手動削除完了');
      }
    } catch (error) {
      console.error('❌ リセット失敗:', error);
      Alert.alert('エラー', `リセット失敗: ${error}`);
    }
  };

  const handlePress = () => {
    Alert.alert('警告', 'データベースを完全にリセットしますか？\n全てのデータが削除されます。', [
      { text: 'キャンセル', style: 'cancel' },
      { text: 'リセット実行', style: 'destructive', onPress: completeReset },
    ]);
  };

  return (
    <View style={styles.container}>
      <Button title="🔥 DB完全リセット (開発用)" onPress={handlePress} color="#ff4444" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    right: 10,
    zIndex: 1000,
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 10,
    borderRadius: 5,
  },
});
