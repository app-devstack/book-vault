import DBProvider from "@/components/providers/db-provider";
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
      <SafeAreaView style={{ flex: 1 }} edges={["left", "right"]}>
        <QueryClientProvider client={queryClient}>
          <DBProvider>{children}</DBProvider>
          <Toast />
        </QueryClientProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
