import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

interface ConfirmationDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  details?: string[];
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  visible,
  title,
  message,
  confirmText = '実行',
  cancelText = 'キャンセル',
  destructive = false,
  onConfirm,
  onCancel,
  details = [],
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={[styles.title, destructive && styles.destructiveTitle]}>{title}</Text>
          </View>

          <View style={styles.content}>
            <Text style={styles.message}>{message}</Text>

            {details.length > 0 && (
              <View style={styles.detailsContainer}>
                {details.map((detail, index) => (
                  <Text key={index} style={styles.detail}>
                    • {detail}
                  </Text>
                ))}
              </View>
            )}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onCancel}>
              <Text style={styles.cancelButtonText}>{cancelText}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.confirmButton, destructive && styles.destructiveButton]}
              onPress={onConfirm}
            >
              <Text style={[styles.confirmButtonText, destructive && styles.destructiveButtonText]}>
                {confirmText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// よく使用される削除確認ダイアログのショートカット
export const showDeleteConfirmation = (
  title: string,
  message: string,
  onConfirm: () => void,
  details?: string[]
) => {
  Alert.alert(title, [message, ...(details || [])].join('\n\n'), [
    {
      text: 'キャンセル',
      style: 'cancel',
    },
    {
      text: '削除',
      style: 'destructive',
      onPress: onConfirm,
    },
  ]);
};

// 書籍削除用の専用関数
export const showBookDeleteConfirmation = (
  bookTitle: string,
  seriesTitle: string | undefined,
  onConfirm: () => void
) => {
  const details = [];
  if (seriesTitle) {
    details.push(`シリーズ「${seriesTitle}」から削除されます`);
  }
  details.push('この操作は取り消せません');

  showDeleteConfirmation(
    '書籍を削除しますか？',
    `「${bookTitle}」を削除しようとしています。`,
    onConfirm,
    details
  );
};

// シリーズ削除用の専用関数
export const showSeriesDeleteConfirmation = (
  seriesTitle: string,
  bookCount: number,
  onConfirm: () => void
) => {
  const details = [`含まれる${bookCount}冊の書籍も同時に削除されます`, 'この操作は取り消せません'];

  showDeleteConfirmation(
    'シリーズを削除しますか？',
    `「${seriesTitle}」とその中の全ての書籍を削除しようとしています。`,
    onConfirm,
    details
  );
};

// 一括削除用の専用関数
export const showBulkDeleteConfirmation = (
  itemCount: number,
  itemType: '書籍' | 'シリーズ',
  onConfirm: () => void
) => {
  const details = [`選択した${itemCount}件の${itemType}が削除されます`, 'この操作は取り消せません'];

  showDeleteConfirmation(
    '一括削除の実行',
    `${itemCount}件の${itemType}を削除しようとしています。`,
    onConfirm,
    details
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    minWidth: 280,
    maxWidth: 400,
    width: '100%',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
  },
  destructiveTitle: {
    color: '#dc2626',
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  message: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 12,
  },
  detailsContainer: {
    backgroundColor: '#f9fafb',
    borderRadius: 6,
    padding: 12,
    marginTop: 8,
  },
  detail: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 16,
    marginBottom: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    borderRightWidth: 1,
    borderRightColor: '#e5e7eb',
  },
  confirmButton: {
    backgroundColor: '#2563eb',
  },
  destructiveButton: {
    backgroundColor: '#dc2626',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  confirmButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
  destructiveButtonText: {
    color: 'white',
  },
});
