import { BooksProvider } from "@/components/providers/books-provider";
import DBProvider from "@/components/providers/db-provider";
import { ProviderErrorBoundary } from "@/components/providers/ErrorBoundary";
// import ResetButton from "@/db/utils/resetButton";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const queryClient = new QueryClient();

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
                <BooksProvider>{children}</BooksProvider>
              </ProviderErrorBoundary>
              <Toast />
            </DBProvider>
          </QueryClientProvider>
        </SafeAreaView>
    </SafeAreaProvider>
  );
}
