import DBProvider from "@/components/providers/db-provider";
import { ProviderErrorBoundary } from "@/components/providers/ErrorBoundary";
// import ResetButton from "@/db/utils/resetButton";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { QUERY_CACHE_TIME } from "@/utils/constants/query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: QUERY_CACHE_TIME.STALE_TIME,
      gcTime: QUERY_CACHE_TIME.GC_TIME,
      retry: 3,
      retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // ネットワークエラー時の処理
      networkMode: 'offlineFirst',
      // バックグラウンドでの自動更新
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 2,
      retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 10000),
      networkMode: 'offlineFirst',
    },
  },
});

export default function RootLayoutProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <SafeAreaProvider>
        <SafeAreaView
          style={{ flex: 1 }}
          // edges={["top", "left", "right"]}
      >
        {/* <ResetButton /> */}
          <QueryClientProvider client={queryClient}>
            <DBProvider>
              <ProviderErrorBoundary>
                {children}
              </ProviderErrorBoundary>
              <Toast />
            </DBProvider>
          </QueryClientProvider>
        </SafeAreaView>
    </SafeAreaProvider>
  );
}
