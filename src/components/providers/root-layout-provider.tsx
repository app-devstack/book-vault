import DBProvider from "@/components/providers/db-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import Toast from "react-native-toast-message";

const queryClient = new QueryClient();

export default function RootLayoutProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <DBProvider>{children}</DBProvider>
      <Toast />
    </QueryClientProvider>
  );
}
