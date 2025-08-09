import DBProvider from '@/components/providers/db-provider';
import { ProviderErrorBoundary } from '@/components/providers/ErrorBoundary';
import { ShareIntentProvider } from 'expo-share-intent';
// import ResetButton from "@/db/utils/resetButton";
import { config } from '@/packages/tamagui/tamagui.config';
import { QUERY_CACHE_TIME } from '@/utils/constants/query';
import { TamaguiProvider } from '@tamagui/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: QUERY_CACHE_TIME.STALE_TIME,
      gcTime: QUERY_CACHE_TIME.GC_TIME,
      retry: 1, // リトライ回数
      retryDelay: 1000, // リトライ間隔（ミリ秒）
      // ネットワークエラー時の処理
      networkMode: 'online',

      // タブ切り替え時の自動更新を無効化
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
    },
    mutations: {
      retry: 1,
      retryDelay: 1000,
      networkMode: 'online',
    },
  },
});

export default function RootLayoutProvider({ children }: { children: ReactNode }) {
  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{ flex: 1 }}
        // edges={["top", "left", "right"]}
      >
        <TamaguiProvider config={config}>
          {/* <ResetButton /> */}
          <QueryClientProvider client={queryClient}>
            <DBProvider>
              <ProviderErrorBoundary>
                <ShareIntentProvider>
                  {children}
                  <Toast />
                </ShareIntentProvider>
              </ProviderErrorBoundary>
            </DBProvider>
          </QueryClientProvider>
        </TamaguiProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
