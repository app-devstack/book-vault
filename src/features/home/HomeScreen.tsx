import { COLORS } from '@/utils/colors';
import { FONT_SIZES } from '@/utils/constants';
import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import EmptyBooksState from '@/features/home/components/EmptyBooksState';
import { SeriesEditMode } from '@/features/home/components/SeriesEditMode';
import { SeriesList } from '@/features/home/components/SeriesList';
import { useUpdateSeriesOrder } from '@/hooks/mutations/useUpdateSeriesOrder';
import { useHomeScreen } from '@/hooks/screens/useHomeScreen';
import { router } from 'expo-router';
import { SeriesWithBooks } from './types';

export const HomeScreen = () => {
  const { seriesedBooks, getSeriesStats, totalStats, isLoading, error } = useHomeScreen();
  const { mutate: updateOrder, isPending: isUpdating } = useUpdateSeriesOrder();

  const [isEditMode, setIsEditMode] = useState(false);
  // 編集中の一時的な順序のみを管理（ドラッグ中の状態）
  const [tempDragOrder, setTempDragOrder] = useState<SeriesWithBooks[]>([]);

  const onSeriesPress = (seriesId: string) => {
    if (!isEditMode) {
      router.push(`/series/${seriesId}`);
    }
  };

  // 編集モード開始：現在の順序をドラッグ用の一時状態にコピー
  const handleEditPress = () => {
    setTempDragOrder(seriesedBooks || []);
    setIsEditMode(true);
  };

  // ドラッグ終了：一時的な順序を更新（UIのみ）
  const onDragEnd = ({ data }: { data: SeriesWithBooks[] }) => {
    console.log(
      'Drag ended, new order:',
      data.map((item, index) => ({ title: item.title, index }))
    );
    setTempDragOrder(data);
  };

  // 保存：楽観的更新でUI即座に反映、エラー時は自動ロールバック
  const onSave = () => {
    const updatedOrder = tempDragOrder.map((item, index) => ({
      id: item.id,
      displayOrder: index,
    }));

    console.log('Saving series order:', updatedOrder);

    // エラー時の復帰用にコピーを保存
    const tempOrderBackup = [...tempDragOrder];

    // 編集モード終了（楽観的更新でUIは既に反映済み）
    setIsEditMode(false);
    setTempDragOrder([]); // 一時状態をクリア

    // 実際のデータベース更新を実行
    updateOrder(updatedOrder, {
      onSuccess: () => {
        console.log('Series order saved successfully');
        // 楽観的更新により既にUIは反映済み
      },
      onError: (error) => {
        console.error('Failed to save series order:', error);
        // エラー時は楽観的更新がロールバックを処理
        // 編集モードに戻す
        setIsEditMode(true);
        setTempDragOrder(tempOrderBackup);
      },
    });
  };

  // キャンセル：編集モード終了、一時状態破棄
  const onCancel = () => {
    setTempDragOrder([]);
    setIsEditMode(false);
  };

  // ローディング状態
  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContainer]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>データを読み込み中...</Text>
      </View>
    );
  }

  // エラー状態
  if (error) {
    return (
      <View style={[styles.container, styles.centerContainer]}>
        <Text style={styles.errorText}>データの読み込みに失敗しました</Text>
      </View>
    );
  }

  // 登録本がないときの見た目（実際の書籍数で判定）
  if (totalStats.bookCount === 0) return <EmptyBooksState />;

  return (
    <View style={styles.container}>
      {isEditMode ? (
        // 編集モード: 並び替え専用画面
        <SeriesEditMode
          data={tempDragOrder} // 一時的なドラッグ順序を使用
          onDragEnd={onDragEnd}
          getSeriesStats={getSeriesStats}
          onCancel={onCancel}
          onSave={onSave}
          isUpdating={isUpdating}
        />
      ) : (
        // 通常モード: 閲覧・情報豊富な画面
        <SeriesList
          data={seriesedBooks} // 楽観的更新でリアルタイム反映済み
          onSeriesPress={onSeriesPress}
          getSeriesStats={getSeriesStats}
          seriesCount={totalStats.seriesCount}
          bookCount={totalStats.bookCount}
          onEditPress={handleEditPress}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.textLight,
    marginTop: 16,
  },
  errorText: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.error,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});
