import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RegisterManualContents from '@/features/register/components/registerManualContents';
import RegisterSearchContents from '@/features/register/components/registerSearchContents';
import { COLORS } from '@/utils/colors';
import { SCREEN_PADDING } from '@/utils/constants';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

export default function RegisterScreen() {
  const MANUAL_TAB = 'manual';
  const SEARCH_TAB = 'search';

  const defaultValue = SEARCH_TAB;

  return (
    <View style={styles.container}>
      {/* タブセレクター */}
      <View style={styles.tabSelector}>
        <Tabs defaultValue={defaultValue}>
          <TabsList>
            <TabsTrigger value={MANUAL_TAB}>🐛 手動登録</TabsTrigger>
            <TabsTrigger value={SEARCH_TAB}>🔍 タイトル検索</TabsTrigger>
          </TabsList>

          <ScrollView
            // style={styles.content}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            <TabsContent value={MANUAL_TAB}>
              <RegisterManualContents />
            </TabsContent>

            {/* google本検索 */}
            <TabsContent value={SEARCH_TAB}>
              <RegisterSearchContents />
            </TabsContent>
          </ScrollView>
        </Tabs>
      </View>
    </View>
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
    // backgroundColor: COLORS.card,
    // borderRadius: BORDER_RADIUS.large,
    // padding: 6,
    // borderWidth: 1,
    // borderColor: COLORS.border,
    // ...SHADOWS.small,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    // padding: SCREEN_PADDING,
    paddingTop: 0,
    paddingBottom: 40,
  },
});
