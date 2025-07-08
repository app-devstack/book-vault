import { Icon } from '@/components/icons/Icons';
import { TabsTrigger } from '@/components/ui/tabs';
import { RegisterTab } from '@/features/register/_types';
import { SearchResults } from '@/features/register/components/SearchResults';
import { COLORS, SHADOWS } from '@/utils/colors';
import { BORDER_RADIUS, FONT_SIZES, SCREEN_PADDING } from '@/utils/constants';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import RegisterScreenProvider, { useRegisterContext } from './providers/registerProvider';

export default function RegisterScreen() {
  const {
    formData,
    searchResults,
    isSearching,
    searchBooks: setSearchQuery,
  } = useRegisterContext();

  const searchQuery = formData.searchQuery;

  const [registerTab, setRegisterTab] = useState<RegisterTab>('api');

  const isSearchValueEmpty = searchQuery.trim() === '';

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setSearchQuery(searchQuery);
    }
  };

  return (
    <RegisterScreenProvider>
      <View style={styles.container}>
        {/* タブセレクター */}
        <View style={styles.tabSelector}>
          <TabsTrigger
            text="📧 Gmail連携"
            onPress={() => setRegisterTab('gmail')}
            isActive={registerTab === 'gmail'}
          />
          <TabsTrigger
            text="🔍 タイトル検索"
            onPress={() => setRegisterTab('api')}
            isActive={registerTab === 'api'}
          />
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {registerTab === 'gmail' ? (
            /* Gmail連携タブ（準備中） */
            <View style={styles.comingSoonContainer}>
              <Text style={styles.comingSoonIcon}>🚧</Text>
              <Text style={styles.comingSoonTitle}>準備中です</Text>
              <Text style={styles.comingSoonDescription}>
                Gmail連携機能は現在開発中です。{'\n'}
                しばらくお待ちください。
              </Text>
            </View>
          ) : (
            /* タイトル検索タブ */
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
              <SearchResults
                results={searchResults}
                isSearching={isSearching}
                isSearchValueEmpty={isSearchValueEmpty}
              />
            </View>
          )}
        </ScrollView>
      </View>
    </RegisterScreenProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  tabSelector: {
    flexDirection: 'row',
    margin: SCREEN_PADDING,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.large,
    padding: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: SCREEN_PADDING,
    paddingTop: 0,
    paddingBottom: 40,
  },
  comingSoonContainer: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.xlarge,
    padding: 40,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    ...SHADOWS.medium,
  },
  comingSoonIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  comingSoonTitle: {
    fontSize: FONT_SIZES.xxlarge,
    fontWeight: 'bold',
    color: COLORS.warning,
    marginBottom: 12,
  },
  comingSoonDescription: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 20,
  },
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
