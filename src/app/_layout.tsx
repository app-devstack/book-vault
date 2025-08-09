import RootLayoutProvider from '@/components/providers/root-layout-provider';
import { Stack } from 'expo-router';
import { StatusBar } from 'react-native';

import React from 'react';
import { COLORS } from '../utils/colors';

export default function RootLayout() {
  return (
    <RootLayoutProvider>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: COLORS.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="series/[seriesId]"
          options={{
            headerShown: false,
            presentation: 'card',
          }}
        />
        <Stack.Screen
          name="book/edit/[bookId]"
          options={{
            headerShown: false,
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
      </Stack>
    </RootLayoutProvider>
  );
}
