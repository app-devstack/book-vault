import db from '@/db';
import { API_ACCESS_KEY, SERVER_URL } from '../constants';
// import { NewSeries } from '@/db/types';
// import { createDatabaseError } from '@/types/errors';

class BackupService {
  async backup() {
    try {
      const books = await db.query.books.findMany();
      const series = await db.query.series.findMany();
      const shops = await db.query.shops.findMany();

      const testUserId = '01981df7-4c24-73ca-bc54-2bf2f31fd99c';

      const data = {
        userId: testUserId,
        books,
        series,
        shops,
      };

      console.log('バックアップデータ:', JSON.stringify({ data: books }, null, 2));

      const res = await fetch(SERVER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_ACCESS_KEY}`,
        },
        body: JSON.stringify(data),
      });

      // 先にステータスをチェック
      if (!res.ok) {
        // エラー時のみテキストとして読み込み
        const errorText = await res.text();
        console.log('エラー詳細:', errorText);
        console.error('Backup failed:', res.status, res.statusText);

        return {
          success: false,
          message: `バックアップに失敗しました。ステータスコード: ${res.status}`,
        };
      }

      // 成功時のみJSONとして読み込み
      const resJson = await res.json();
      console.log('成功レスポンス:', resJson);

      return {
        success: true,
        data,
        resJson,
      };
    } catch (error) {
      console.error('Backup error:', error);
      throw new Error('バックアップに失敗しました。再度お試しください。');
    }
  }
}
export const backupService = new BackupService();
