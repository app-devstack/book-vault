import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ActiveTab } from "../../types/store";
import { COLORS, SHADOWS } from "../../utils/colors";
import { FONT_SIZES } from "../../utils/constants";
import { Icon, IconName } from "../icons/Icons";

interface TabItem {
  key: ActiveTab;
  label: string;
  icon: IconName;
  iconOutline: IconName;
}

interface TabBarProps {
  activeTab: ActiveTab;
  onTabPress: (tab: ActiveTab) => void;
}

const TAB_ITEMS: TabItem[] = [
  {
    key: "home",
    label: "ホーム",
    icon: "home",
    iconOutline: "home-outline",
  },
  {
    key: "register",
    label: "登録",
    icon: "add",
    iconOutline: "add-outline",
  },
  {
    key: "settings",
    label: "設定",
    icon: "settings",
    iconOutline: "settings-outline",
  },
];

export const TabBar: React.FC<TabBarProps> = ({ activeTab, onTabPress }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tabBar}>
        {TAB_ITEMS.map((item) => {
          const isActive = activeTab === item.key;
          return (
            <TouchableOpacity
              key={item.key}
              style={styles.tabItem}
              onPress={() => onTabPress(item.key)}
              activeOpacity={0.7}
            >
              <Icon
                name={isActive ? item.icon : item.iconOutline}
                size="large"
                color={isActive ? COLORS.primary : COLORS.textLight}
              />
              <Text
                style={[
                  styles.tabLabel,
                  { color: isActive ? COLORS.primary : COLORS.textLight },
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.card,
    ...SHADOWS.medium,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 4,
  },
  tabLabel: {
    fontSize: FONT_SIZES.small,
    fontWeight: "bold",
  },
});
