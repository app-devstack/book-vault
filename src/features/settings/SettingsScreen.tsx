import { BuckupButton } from '@/components/BuckupButton';
import { ImageDownloadButton } from '@/components/ImageDownloadButton';
import { useSharedUrl } from '@/hooks/useSharedUrl';
// import { ErrorLogScreen } from '@/components/ui/ErrorLogScreen';
import { COLORS } from '@/utils/colors';
import { FONT_SIZES, SCREEN_PADDING } from '@/utils/constants';
import { Activity, Airplay } from '@tamagui/lucide-icons';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button, XGroup, XStack, YStack } from 'tamagui';

export const SettingsScreen: React.FC = () => {
  const { sharedUrl } = useSharedUrl();
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
      <View style={{ alignItems: 'center', marginBottom: 40 }}>
        <Text style={styles.icon}>⚙️</Text>
        <Text style={styles.title}>設定画面</Text>
      </View>

      {/* エラーログ表示ボタン */}
      {/* <TouchableOpacity style={styles.errorLogButton} onPress={() => setShowErrorLogs(true)}>
        <Text style={styles.errorLogButtonText}>エラーログを表示</Text>
      </TouchableOpacity> */}

      {/* コンテンツ */}
      <View style={{ gap: 20 }}>
        {/* アセットダウンロード */}
        <ImageDownloadButton
          imageSource={require('@/assets/images/icon.png')}
          buttonText="アセット画像をダウンロード"
          downloadFileName="book_vault_asset"
        />

        {/* バックアップボタン仮 */}
        <BuckupButton />

        <YStack p="$2" gap="$3">
          <Button>Plain</Button>
          <Button icon={Airplay} size="$6">
            Large
          </Button>
          <XStack gap="$2">
            <Button size="$3" theme="accent">
              Active
            </Button>
            <Button size="$3" variant="outlined">
              Outlined
            </Button>
          </XStack>
          <XStack gap="$2">
            <Button themeInverse size="$3">
              Inverse
            </Button>
            <Button iconAfter={Activity} size="$3">
              iconAfter
            </Button>
          </XStack>
          <XGroup>
            <XGroup.Item>
              <Button w="50%" size="$2" disabled o={0.5}>
                disabled
              </Button>
            </XGroup.Item>

            <XGroup.Item>
              <Button w="50%" size="$2" chromeless>
                chromeless
              </Button>
            </XGroup.Item>
          </XGroup>
        </YStack>

        {/* バージョン表示 */}
        <Text>ver:{process.env.EXPO_PUBLIC_VERSION}</Text>
      </View>
      {sharedUrl && (
        <View style={{ marginTop: 20 }}>
          <Text style={styles.description}>{sharedUrl?.url}</Text>
        </View>
      )}
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
