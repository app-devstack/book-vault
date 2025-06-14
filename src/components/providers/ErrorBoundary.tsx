import React from 'react';
import { ErrorBoundaryProps, ErrorBoundaryState } from '@/types/provider.types';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// デフォルトのフォールバックコンポーネント
const DefaultFallbackComponent: React.FC<{ error: Error; retry: () => void }> = ({ error, retry }) => (
  <View style={styles.container}>
    <View style={styles.errorCard}>
      <Text style={styles.title}>予期しないエラーが発生しました</Text>
      <Text style={styles.message}>
        アプリの実行中に問題が発生しました。
        以下のボタンを押して再試行してください。
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
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // カスタムエラーハンドラがある場合は呼び出し
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // エラーログ
    console.error('ErrorBoundary caught an error:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack
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
      errorInfo: null
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
      
      return (
        <FallbackComponent 
          error={this.state.error} 
          retry={this.handleRetry}
        />
      );
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
      componentStack: errorInfo.componentStack
    });

    // プロダクション環境では外部ログサービスに送信
    if (!__DEV__) {
      // TODO: 外部ログサービス（Sentry, LogRocket等）に送信
      // logError(error, errorInfo);
    }
  };

  const ProviderFallback: React.FC<{ error: Error; retry: () => void }> = ({ error, retry }) => (
    <View style={styles.providerErrorContainer}>
      <View style={styles.providerErrorCard}>
        <Text style={styles.providerErrorTitle}>データの読み込みに失敗しました</Text>
        <Text style={styles.providerErrorMessage}>
          書籍データの取得中にエラーが発生しました。
          ネットワーク接続を確認して、再試行してください。
        </Text>
        
        <TouchableOpacity style={styles.providerRetryButton} onPress={retry}>
          <Text style={styles.providerRetryButtonText}>再読み込み</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

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
    backgroundColor: '#f5f5f5',
    padding: 20
  },
  errorCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    maxWidth: 400,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#dc2626',
    marginBottom: 12,
    textAlign: 'center'
  },
  message: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 20,
    textAlign: 'center'
  },
  retryButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center'
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  },
  debugInfo: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 6
  },
  debugTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4b5563',
    marginBottom: 8
  },
  debugText: {
    fontSize: 10,
    color: '#6b7280',
    fontFamily: 'monospace',
    marginBottom: 4
  },
  
  // Provider専用スタイル
  providerErrorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    padding: 20
  },
  providerErrorCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    maxWidth: 400,
    width: '100%',
    borderWidth: 1,
    borderColor: '#fecaca'
  },
  providerErrorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#dc2626',
    marginBottom: 12,
    textAlign: 'center'
  },
  providerErrorMessage: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 20,
    textAlign: 'center'
  },
  providerRetryButton: {
    backgroundColor: '#ef4444',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center'
  },
  providerRetryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600'
  }
});