import { RegisterScreen } from '@/features/register/RegisterScreen';
import { RegisterTab } from '@/features/register/_types';
import { useBookRegistration } from '@/hooks/screens/useBookRegistration';
import { COLORS } from '@/utils/colors';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

export default function RegisterPage() {
  const [registerTab, setRegisterTab] = useState<RegisterTab>('api');

  const { formData, searchResults, isSearching, searchBooks } = useBookRegistration();

  return (
    <View style={styles.container}>
      <RegisterScreen
        registerTab={registerTab}
        setRegisterTab={setRegisterTab}
        searchQuery={formData.searchQuery}
        setSearchQuery={searchBooks}
        searchResults={searchResults}
        isSearching={isSearching}
        onSearch={searchBooks}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
