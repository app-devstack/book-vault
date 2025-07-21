import { COLORS, GRADIENTS, SHADOWS } from '@/utils/colors';
import { BORDER_RADIUS, FONT_SIZES } from '@/utils/constants';
import { backupService } from '@/utils/service/backup-service';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';

const { width: screenWidth } = Dimensions.get('window');

type BuckupButtonProps = {
  buttonText?: string;
  style?: any;
};

export const BuckupButton = ({
  buttonText = 'データのバックアップを実行する',
  style,
}: BuckupButtonProps) => {
  const [isBackup, setIsBackup] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const [backupData, setBackupData] = useState('');

  const showPreview = () => {
    setShowPreviewModal(true);
  };

  const hidePreview = () => {
    setShowPreviewModal(false);
  };

  const onPress = async () => {
    try {
      setIsBackup(true);

      // モーダルを閉じる
      setShowPreviewModal(false);

      const { success, message, data } = await backupService.backup();
      if (!success) {
        Toast.show({
          type: 'error',
          text1: message,
        });

        setBackupData(JSON.stringify(data, null, 2));
        return;
      }

      setBackupData(JSON.stringify(data, null, 2));

      Toast.show({
        type: 'success',
        text1: 'バックアップ完了',
      });

      // 成功メッセージ
      Alert.alert('保存完了', 'データをクラウドに保存しました。');
    } catch (error) {
      console.error('Backup error:', error);
      setShowPreviewModal(false);
      Alert.alert('エラー', 'バックアップに失敗しました。再度お試しください。');
    } finally {
      setIsBackup(false);
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
          <Text style={styles.downloadIcon}>🗂️</Text>
          <Text style={styles.downloadButtonText}>{buttonText}</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* 仮データ */}
      <ScrollView>
        <Text>{backupData}</Text>
      </ScrollView>

      {/* プレビューモーダル */}
      <Modal
        visible={showPreviewModal}
        transparent={true}
        animationType="fade"
        onRequestClose={hidePreview}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* タイトル */}
            <Text style={styles.modalTitle}>バックアップを開始しますか？</Text>

            {/* 説明 */}
            <Text style={styles.modalDescription}>データをクラウド環境に保存します。</Text>

            {/* ボタン群 */}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={hidePreview}
                disabled={isBackup}
              >
                <Text style={styles.cancelButtonText}>キャンセル</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.confirmButton, isBackup && styles.confirmButtonDisabled]}
                onPress={onPress}
                disabled={isBackup}
              >
                {isBackup ? (
                  <>
                    <ActivityIndicator
                      size="small"
                      color={COLORS.background}
                      style={styles.loadingIcon}
                    />
                    <Text style={styles.confirmButtonText}>保存中...</Text>
                  </>
                ) : (
                  <Text style={styles.confirmButtonText}>バックアップ</Text>
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
