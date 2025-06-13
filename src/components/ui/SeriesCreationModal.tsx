import { Icon } from "@/components/icons/Icons";
import { NewSeries } from "@/db/types";
import { COLORS, GRADIENTS, SHADOWS } from "@/utils/colors";
import { BORDER_RADIUS, FONT_SIZES, SCREEN_PADDING } from "@/utils/constants";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface SeriesCreationModalProps {
  visible: boolean;
  onClose: () => void;
  onCreateSeries: (seriesData: Omit<NewSeries, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  initialTitle?: string;
  initialAuthor?: string;
}

export const SeriesCreationModal: React.FC<SeriesCreationModalProps> = ({
  visible,
  onClose,
  onCreateSeries,
  initialTitle = "",
  initialAuthor = "",
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [author, setAuthor] = useState(initialAuthor);
  const [description, setDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    if (!title.trim()) {
      Alert.alert("エラー", "シリーズタイトルを入力してください");
      return;
    }

    setIsCreating(true);
    try {
      await onCreateSeries({
        title: title.trim(),
        author: author.trim() || null,
        description: description.trim() || null,
        thumbnail: null,
        googleBooksSeriesId: null,
      });
      
      setTitle("");
      setAuthor("");
      setDescription("");
      onClose();
    } catch (error) {
      console.error("Error creating series:", error);
      Alert.alert("エラー", "シリーズの作成に失敗しました");
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    setTitle(initialTitle);
    setAuthor(initialAuthor);
    setDescription("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        {/* ヘッダー */}
        <LinearGradient
          colors={GRADIENTS.primary}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Icon name="close" size="medium" color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>📚 新しいシリーズを作成</Text>
          <View style={styles.placeholder} />
        </LinearGradient>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* シリーズタイトル */}
          <View style={styles.inputCard}>
            <View style={styles.sectionHeader}>
              <Icon name="library" size="medium" color={COLORS.primary} />
              <Text style={styles.sectionTitle}>シリーズタイトル *</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={title}
              onChangeText={setTitle}
              placeholder="シリーズのタイトルを入力"
              placeholderTextColor={COLORS.textLight}
              autoFocus
            />
          </View>

          {/* 著者名 */}
          <View style={styles.inputCard}>
            <View style={styles.sectionHeader}>
              <Icon name="person" size="medium" color={COLORS.primary} />
              <Text style={styles.sectionTitle}>著者名</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={author}
              onChangeText={setAuthor}
              placeholder="著者名を入力（任意）"
              placeholderTextColor={COLORS.textLight}
            />
          </View>

          {/* 概要・説明 */}
          <View style={styles.inputCard}>
            <View style={styles.sectionHeader}>
              <Icon name="document-text" size="medium" color={COLORS.primary} />
              <Text style={styles.sectionTitle}>概要・説明</Text>
            </View>
            <TextInput
              style={[styles.textInput, styles.multilineInput]}
              value={description}
              onChangeText={setDescription}
              placeholder="シリーズの概要や説明を入力（任意）"
              placeholderTextColor={COLORS.textLight}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* 注意事項 */}
          <View style={styles.noteCard}>
            <Icon name="information-circle" size="medium" color={COLORS.warning} />
            <Text style={styles.noteText}>
              シリーズを作成すると、このシリーズに本を追加できるようになります。
            </Text>
          </View>
        </ScrollView>

        {/* フッター */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.footerButton, styles.cancelButton]}
            onPress={handleClose}
            activeOpacity={0.8}
          >
            <Text style={styles.cancelButtonText}>キャンセル</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.footerButton, styles.createButton]}
            onPress={handleCreate}
            disabled={isCreating || !title.trim()}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={GRADIENTS.primary}
              style={[
                styles.createButtonGradient,
                (!title.trim() || isCreating) && styles.createButtonDisabled,
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              {isCreating ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Icon name="add" size="medium" color="white" />
              )}
              <Text style={styles.createButtonText}>
                {isCreating ? "作成中..." : "作成"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 12,
    paddingBottom: 12,
    paddingHorizontal: SCREEN_PADDING,
    ...SHADOWS.large,
  },
  closeButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: BORDER_RADIUS.medium,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: FONT_SIZES.title,
    fontWeight: "bold",
    color: "white",
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: SCREEN_PADDING,
  },
  inputCard: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.xlarge,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.medium,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.large,
    fontWeight: "bold",
    color: COLORS.text,
  },
  textInput: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.large,
    padding: 16,
    fontSize: FONT_SIZES.medium,
    color: COLORS.text,
    backgroundColor: COLORS.background,
  },
  multilineInput: {
    minHeight: 100,
  },
  noteCard: {
    backgroundColor: COLORS.warning + "10",
    borderRadius: BORDER_RADIUS.large,
    padding: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    borderWidth: 1,
    borderColor: COLORS.warning + "30",
    marginBottom: 20,
  },
  noteText: {
    fontSize: FONT_SIZES.small,
    color: COLORS.warning,
    flex: 1,
    lineHeight: 18,
  },
  footer: {
    flexDirection: "row",
    padding: SCREEN_PADDING,
    paddingTop: 8,
    paddingBottom: 12,
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.card,
    ...SHADOWS.medium,
  },
  footerButton: {
    flex: 1,
    borderRadius: BORDER_RADIUS.xlarge,
    overflow: "hidden",
  },
  cancelButton: {
    backgroundColor: COLORS.card,
    borderWidth: 2,
    borderColor: COLORS.border,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    fontSize: FONT_SIZES.large,
    fontWeight: "bold",
    color: COLORS.textLight,
  },
  createButton: {
    ...SHADOWS.medium,
  },
  createButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 8,
  },
  createButtonDisabled: {
    opacity: 0.6,
  },
  createButtonText: {
    fontSize: FONT_SIZES.large,
    fontWeight: "bold",
    color: "white",
  },
});