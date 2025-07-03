import { ImageDownloadButton } from '@/components/ImageDownloadButton';
// import { ErrorLogScreen } from '@/components/ui/ErrorLogScreen';
import { COLORS } from '@/utils/colors';
import { FONT_SIZES, SCREEN_PADDING } from '@/utils/constants';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const SettingsScreen: React.FC = () => {
  const [showErrorLogs, setShowErrorLogs] = useState(false);

  if (showErrorLogs) {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => setShowErrorLogs(false)}>
          <Text style={styles.backButtonText}>← 戻る</Text>
        </TouchableOpacity>
        {/* <ErrorLogScreen /> */}
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.icon}>⚙️</Text>
      <Text style={styles.title}>設定画面</Text>
      <Text style={styles.description}>
        設定画面は現在開発中です。{'\n'}
        しばらくお待ちください。
      </Text>

      {/* エラーログ表示ボタン */}
      <TouchableOpacity style={styles.errorLogButton} onPress={() => setShowErrorLogs(true)}>
        <Text style={styles.errorLogButtonText}>エラーログを表示</Text>
      </TouchableOpacity>

      {/* アセットダウンロードボタン */}
      <ImageDownloadButton
        imageSource={require('@/assets/images/icon.png')}
        buttonText="アセット画像をダウンロード"
        downloadFileName="book_vault_asset"
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SCREEN_PADDING,
    paddingVertical: 60,
    paddingBottom: 100,
  },
  icon: {
    fontSize: 64,
    marginBottom: 20,
  },
  title: {
    fontSize: FONT_SIZES.xxlarge,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 40, // 後で親要素にgapにを指定
  },
  errorLogButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  errorLogButtonText: {
    color: 'white',
    fontSize: FONT_SIZES.medium,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  backButton: {
    padding: SCREEN_PADDING,
    paddingBottom: 8,
  },
  backButtonText: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});
