import { COLORS, GRADIENTS, SHADOWS } from '@/utils/colors';
import { BORDER_RADIUS, FONT_SIZES } from '@/utils/constants';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import { LinearGradient } from 'expo-linear-gradient';
import * as MediaLibrary from 'expo-media-library';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

interface ImageDownloadButtonProps {
  imageSource: any; // require()で読み込まれた画像アセット
  buttonText?: string;
  downloadFileName?: string;
  style?: any;
}

export const ImageDownloadButton: React.FC<ImageDownloadButtonProps> = ({
  imageSource,
  buttonText = 'アセット画像をダウンロード',
  downloadFileName = 'book_vault_image',
  style,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const showPreview = () => {
    setShowPreviewModal(true);
  };

  const hidePreview = () => {
    setShowPreviewModal(false);
  };

  const downloadImage = async () => {
    try {
      setIsDownloading(true);

      // 権限の確認・要求
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('権限が必要です', 'フォトライブラリに保存するには権限が必要です。');
        return;
      }

      // アセット画像を取得
      const asset = Asset.fromModule(imageSource);
      await asset.downloadAsync();

      if (!asset.localUri) {
        throw new Error('画像の読み込みに失敗しました');
      }

      // 一時的なファイルパスを作成
      const filename = `${downloadFileName}_${Date.now()}.png`;
      const localUri = `${FileSystem.documentDirectory}${filename}`;

      // ファイルをコピー
      await FileSystem.copyAsync({
        from: asset.localUri,
        to: localUri,
      });

      // フォトライブラリに保存
      await MediaLibrary.saveToLibraryAsync(localUri);

      // モーダルを閉じる
      setShowPreviewModal(false);

      // 成功メッセージ
      Alert.alert('ダウンロード完了', '画像をフォトライブラリに保存しました。');

      // 一時ファイルを削除
      await FileSystem.deleteAsync(localUri, { idempotent: true });
    } catch (error) {
      console.error('Download error:', error);
      setShowPreviewModal(false);
      Alert.alert('エラー', '画像のダウンロードに失敗しました。再度お試しください。');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      {/* ダウンロードボタン */}
      <TouchableOpacity
        style={[styles.downloadButton, style]}
        onPress={showPreview}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={GRADIENTS.primary}
          style={styles.emptyButtonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.downloadIcon}>📱</Text>
          <Text style={styles.downloadButtonText}>{buttonText}</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* プレビューモーダル */}
      <Modal
        visible={showPreviewModal}
        transparent={true}
        animationType="fade"
        onRequestClose={hidePreview}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* プレビュー画像 */}
            <View style={styles.previewContainer}>
              <Image source={imageSource} style={styles.previewImage} resizeMode="contain" />
            </View>

            {/* タイトル */}
            <Text style={styles.modalTitle}>この画像をダウンロードしますか？</Text>

            {/* 説明 */}
            <Text style={styles.modalDescription}>画像をフォトライブラリに保存します。</Text>

            {/* ボタン群 */}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={hidePreview}
                disabled={isDownloading}
              >
                <Text style={styles.cancelButtonText}>キャンセル</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.confirmButton, isDownloading && styles.confirmButtonDisabled]}
                onPress={downloadImage}
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <>
                    <ActivityIndicator
                      size="small"
                      color={COLORS.background}
                      style={styles.loadingIcon}
                    />
                    <Text style={styles.confirmButtonText}>保存中...</Text>
                  </>
                ) : (
                  <Text style={styles.confirmButtonText}>ダウンロード</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  emptyButtonGradient: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadButton: {
    borderRadius: BORDER_RADIUS.xlarge,
    overflow: 'hidden',
    ...SHADOWS.medium,
    minWidth: 240,
  },
  downloadIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  downloadButtonText: {
    color: COLORS.background,
    fontSize: FONT_SIZES.medium,
    fontWeight: '600',
  },

  // モーダルスタイル
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderRadius: 20,
    padding: 24,
    width: screenWidth * 0.85,
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  previewContainer: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
  },
  previewImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: FONT_SIZES.large,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.textLight,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: COLORS.textLight,
    fontSize: FONT_SIZES.medium,
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  confirmButtonDisabled: {
    backgroundColor: COLORS.textLight,
    opacity: 0.7,
  },
  confirmButtonText: {
    color: COLORS.background,
    fontSize: FONT_SIZES.medium,
    fontWeight: '600',
  },
  loadingIcon: {
    marginRight: 8,
  },
});
