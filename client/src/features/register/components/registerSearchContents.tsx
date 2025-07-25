import { Icon } from '@/components/icons/Icons';
import { SearchResults } from '@/features/register/components/SearchResults';
import { useRegisterContext } from '@/features/register/providers/registerProvider';
import { COLORS, SHADOWS } from '@/utils/colors';
import { BORDER_RADIUS, FONT_SIZES } from '@/utils/constants';
import React from 'react';
import { ActivityIndicator, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function RegisterSearchContents() {
  const { formData, isSearching, searchBooks: setSearchQuery } = useRegisterContext();

  const searchQuery = formData.searchQuery;

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setSearchQuery(searchQuery);
    }
  };

  return (
    <View style={styles.searchContainer}>
      {/* 検索バー */}
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="本タイトルを検索..."
          placeholderTextColor={COLORS.textLight}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearch}
          disabled={isSearching}
          activeOpacity={0.8}
        >
          {isSearching ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Icon name="search" size="medium" color="white" />
          )}
        </TouchableOpacity>
      </View>

      {/* 検索結果 */}
      <SearchResults />
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flex: 1,
  },
  searchBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.large,
    borderWidth: 2,
    borderColor: COLORS.primary,
    overflow: 'hidden',
    marginBottom: 24,
    ...SHADOWS.medium,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: FONT_SIZES.large,
    color: COLORS.text,
  },
  searchButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
