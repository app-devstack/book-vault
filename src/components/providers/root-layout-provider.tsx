import DBProvider from "@/components/providers/db-provider";
import { ReactNode } from "react";
import Toast from "react-native-toast-message";

export default function RootLayoutProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <DBProvider>{children}</DBProvider>
      <Toast />
    </>
  );
}
