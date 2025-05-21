import DBProvider from "@/components/providers/db-provider";
import { ReactNode } from "react";

export default function RootLayoutProvider({
  children,
}: {
  children: ReactNode;
}) {
  return <DBProvider>{children}</DBProvider>;
}
