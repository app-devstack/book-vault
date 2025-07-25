import { createConstate } from '@/components/providers/utils/constate';
import { COLORS } from '@/utils/colors';
import { BORDER_RADIUS, FONT_SIZES } from '@/utils/constants';
import React, { PropsWithChildren, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface TabsContextType {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const useTabs = ({ defaultValue }: { defaultValue: string }) => {
  const [activeTab, setActiveTab] = useState<string>(defaultValue);

  return {
    activeTab,
    setActiveTab,
  };
};

const constate = createConstate<{ defaultValue: string }, TabsContextType>(useTabs);
const useTabsContext = constate.useContextValue;

const Tabs = ({ children, ...props }: PropsWithChildren<{ defaultValue: string }>) => {
  return (
    <constate.Provider {...props}>
      <View style={styles.tabsContainer}>{children}</View>
    </constate.Provider>
  );
};

const TabsList = ({ children }: { children: React.ReactNode }) => {
  return <View style={styles.tabsList}>{children}</View>;
};

const TabsTrigger = ({
  value,
  children,
  // onPress,
  // isActive,
  // text,
}: PropsWithChildren<{ value: string }>) => {
  const { activeTab, setActiveTab } = useTabsContext();
  const isActive = activeTab === value;

  return (
    <TouchableOpacity
      style={[styles.tabButton, isActive && styles.tabButtonActive]}
      onPress={() => setActiveTab(value)}
      activeOpacity={0.8}
    >
      <Text style={[styles.tabButtonText, isActive && styles.tabButtonTextActive]}>{children}</Text>
    </TouchableOpacity>
  );
};

const TabsContent = ({
  value,
  children,
}: PropsWithChildren<{ value: string; children: React.ReactNode }>) => {
  const { activeTab } = useTabsContext();

  if (activeTab !== value) {
    return null;
  }

  return <>{children}</>;
};

export { Tabs, TabsContent, TabsList, TabsTrigger };

const styles = StyleSheet.create({
  tabsContainer: {
    flex: 1,
  },
  tabsList: {
    flexDirection: 'row',
    // backgroundColor: COLORS.background,
    // borderRadius: BORDER_RADIUS.medium,
    // padding: 4,
    marginBottom: 16,

    // margin: SCREEN_PADDING,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.large,
    padding: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    // ...SHADOWS.small,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: BORDER_RADIUS.medium,
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: COLORS.primary,
  },
  tabButtonText: {
    fontSize: FONT_SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.textLight,
  },
  tabButtonTextActive: {
    color: COLORS.card,
  },
  tabContent: {
    flex: 1,
  },
});
