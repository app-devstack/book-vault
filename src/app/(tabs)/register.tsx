import RegisterScreen from '@/features/register/RegisterScreen';
import { COLORS } from '@/utils/colors';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function RegisterPage() {
  return (
    <View style={styles.container}>
      <RegisterScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
