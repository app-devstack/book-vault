import { COLORS, SHADOWS } from '@/utils/colors';
import { BORDER_RADIUS, FONT_SIZES } from '@/utils/constants';
import * as Clipboard from 'expo-clipboard';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

// デフォルトのフォールバックコンポーネント
const DefaultFallbackComponent: React.FC<{ error: Error; retry: () => void }> = ({
  error,
  retry,
}) => (
  <View style={styles.container}>
    <View style={styles.errorCard}>
      <Text style={styles.title}>予期しないエラーが発生しました</Text>
      <Text style={styles.message}>
        アプリの実行中に問題が発生しました。 以下のボタンを押して再試行してください。
      </Text>

      <TouchableOpacity style={styles.retryButton} onPress={retry}>
        <Text style={styles.retryButtonText}>再試行</Text>
      </TouchableOpacity>

      {__DEV__ && (
        <View style={styles.debugInfo}>
          <Text style={styles.debugTitle}>開発者情報:</Text>
          <Text style={styles.debugText}>{error.message}</Text>
          <Text style={styles.debugText}>{error.stack}</Text>
        </View>
      )}
    </View>
  </View>
);

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private retryTimeoutId: ReturnType<typeof setTimeout> | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // カスタムエラーハンドラがある場合は呼び出し
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // エラーログ
    console.error('ErrorBoundary caught an error:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  handleRetry = () => {
    // エラー状態をリセット
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });

    // 少し遅延を入れてからリセット（UIの反応性向上）
    this.retryTimeoutId = setTimeout(() => {
      // フォースアップデートでコンポーネントを再レンダリング
      this.forceUpdate();
    }, 100);
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback || DefaultFallbackComponent;

      return <FallbackComponent error={this.state.error} retry={this.handleRetry} />;
    }

    return this.props.children;
  }
}

// Provider専用のエラーバウンダリ
export const ProviderErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    // Provider固有のエラーログ
    console.error('Provider Error:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });

    // プロダクション環境では外部ログサービスに送信
    if (!__DEV__) {
      // TODO: 外部ログサービス（Sentry, LogRocket等）に送信
      // logError(error, errorInfo);
    }
  };

  const ProviderFallback: React.FC<{ error: Error; retry: () => void }> = ({ error, retry }) => {
    const [showDetails, setShowDetails] = useState(false);
    const [copyFeedback, setCopyFeedback] = useState('');

    const errorDetails = {
      name: error.name,
      message: error.message,
      stack: error.stack || 'スタックトレースが利用できません',
      timestamp: new Date().toISOString(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A',
    };

    const handleCopyError = async () => {
      const errorText = `
        エラー詳細 - ${errorDetails.timestamp}
        =====================================

        エラー名: ${errorDetails.name}
        メッセージ: ${errorDetails.message}

        スタックトレース:
        ${errorDetails.stack}

        User Agent: ${errorDetails.userAgent}
        =====================================
`.trim();

      try {
        await Clipboard.setString(errorText);
        setCopyFeedback('コピーしました！');
        setTimeout(() => setCopyFeedback(''), 2000);
      } catch {
        setCopyFeedback('コピーに失敗しました');
        setTimeout(() => setCopyFeedback(''), 2000);
      }
    };

    return (
      <View style={styles.providerErrorContainer}>
        <View style={styles.providerErrorCard}>
          <Text style={styles.providerErrorTitle}>💥 アプリエラー</Text>
          <Text style={styles.providerErrorMessage}>
            書籍データの取得中にエラーが発生しました。
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.providerRetryButton} onPress={retry}>
              <Text style={styles.providerRetryButtonText}>🔄 再読み込み</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.detailsButton}
              onPress={() => setShowDetails(!showDetails)}
            >
              <Text style={styles.detailsButtonText}>
                {showDetails ? '📄 詳細を隠す' : '🔍 詳細を表示'}
              </Text>
            </TouchableOpacity>
          </View>

          {showDetails && (
            <View style={styles.errorDetailsContainer}>
              <View style={styles.errorDetailsHeader}>
                <Text style={styles.errorDetailsTitle}>エラー詳細</Text>
                <TouchableOpacity style={styles.copyButton} onPress={handleCopyError}>
                  <Text style={styles.copyButtonText}>📋 コピー</Text>
                </TouchableOpacity>
              </View>

              {copyFeedback ? <Text style={styles.copyFeedback}>{copyFeedback}</Text> : null}

              <ScrollView style={styles.errorLogContainer} showsVerticalScrollIndicator={true}>
                <View style={styles.errorSection}>
                  <Text style={styles.errorSectionTitle}>🏷️ エラー名</Text>
                  <Text style={styles.errorSectionContent} selectable>
                    {errorDetails.name}
                  </Text>
                </View>

                <View style={styles.errorSection}>
                  <Text style={styles.errorSectionTitle}>💬 メッセージ</Text>
                  <Text style={styles.errorSectionContent} selectable>
                    {errorDetails.message}
                  </Text>
                </View>

                <View style={styles.errorSection}>
                  <Text style={styles.errorSectionTitle}>📍 スタックトレース</Text>
                  <ScrollView
                    style={styles.stackTraceContainer}
                    horizontal
                    showsHorizontalScrollIndicator={true}
                  >
                    <Text style={styles.stackTraceText} selectable>
                      {errorDetails.stack}
                    </Text>
                  </ScrollView>
                </View>

                <View style={styles.errorSection}>
                  <Text style={styles.errorSectionTitle}>⏰ 発生時刻</Text>
                  <Text style={styles.errorSectionContent} selectable>
                    {errorDetails.timestamp}
                  </Text>
                </View>

                <View style={styles.errorSection}>
                  <Text style={styles.errorSectionTitle}>🖥️ 環境情報</Text>
                  <Text style={styles.errorSectionContent} selectable>
                    {errorDetails.userAgent}
                  </Text>
                </View>
              </ScrollView>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <ErrorBoundary fallback={ProviderFallback} onError={handleError}>
      {children}
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: 20,
  },
  errorCard: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.xlarge,
    padding: 24,
    maxWidth: 400,
    width: '100%',
    ...SHADOWS.large,
  },
  title: {
    fontSize: FONT_SIZES.xlarge,
    fontWeight: 'bold',
    color: COLORS.error,
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.textLight,
    lineHeight: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.medium,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  retryButtonText: {
    color: 'white',
    fontSize: FONT_SIZES.medium,
    fontWeight: '600',
  },
  debugInfo: {
    marginTop: 20,
    padding: 12,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.medium,
  },
  debugTitle: {
    fontSize: FONT_SIZES.small,
    fontWeight: 'bold',
    color: COLORS.textLight,
    marginBottom: 8,
  },
  debugText: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textLight,
    fontFamily: 'monospace',
    marginBottom: 4,
  },

  // Provider専用スタイル - 詳細エラー表示
  providerErrorContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  providerErrorCard: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.xlarge,
    padding: 20,
    flex: 1,
    maxHeight: '90%',
    borderWidth: 2,
    borderColor: COLORS.error + '20',
    ...SHADOWS.large,
  },
  providerErrorTitle: {
    fontSize: FONT_SIZES.xxlarge,
    fontWeight: 'bold',
    color: COLORS.error,
    marginBottom: 12,
    textAlign: 'center',
  },
  providerErrorMessage: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.text,
    lineHeight: 22,
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  providerRetryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.large,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    flex: 1,
    ...SHADOWS.medium,
  },
  providerRetryButtonText: {
    color: 'white',
    fontSize: FONT_SIZES.medium,
    fontWeight: 'bold',
  },
  detailsButton: {
    backgroundColor: COLORS.warning + '20',
    borderRadius: BORDER_RADIUS.large,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.warning + '40',
  },
  detailsButtonText: {
    color: COLORS.warning,
    fontSize: FONT_SIZES.medium,
    fontWeight: 'bold',
  },
  errorDetailsContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.large,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  errorDetailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  errorDetailsTitle: {
    fontSize: FONT_SIZES.large,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  copyButton: {
    backgroundColor: COLORS.accent,
    borderRadius: BORDER_RADIUS.medium,
    paddingVertical: 6,
    paddingHorizontal: 12,
    ...SHADOWS.small,
  },
  copyButtonText: {
    color: 'white',
    fontSize: FONT_SIZES.small,
    fontWeight: 'bold',
  },
  copyFeedback: {
    color: COLORS.success,
    fontSize: FONT_SIZES.small,
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  errorLogContainer: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.medium,
    padding: 12,
    maxHeight: 400,
  },
  errorSection: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.medium,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  errorSectionTitle: {
    fontSize: FONT_SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  errorSectionContent: {
    fontSize: FONT_SIZES.small,
    color: COLORS.text,
    lineHeight: 18,
    fontFamily: 'monospace',
  },
  stackTraceContainer: {
    maxHeight: 120,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.small,
    padding: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  stackTraceText: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textLight,
    fontFamily: 'monospace',
    lineHeight: 16,
  },
});
