import RootLayoutProvider from "@/components/providers/root-layout-provider";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";

export default function RootLayout() {
  return (
    <RootLayoutProvider>
      <StatusBar barStyle="light-content" backgroundColor={"black"} />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </RootLayoutProvider>
  );
}
