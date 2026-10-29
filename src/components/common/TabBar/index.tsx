/** 내비게이션 라이브러리와 분리된 하단 탭 UI. 중앙 추가는 별도 액션이다. */
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/common/Text';
import { IconName } from '@/types/ui';
import { colors } from '@/constants/colors';
import { spacing, radius, metrics, shadows } from '@/constants/layout';
export interface TabBarItem {
  id: string;
  label: string;
  activeIcon: IconName;
  inactiveIcon: IconName;
}
interface TabBarProps {
  items: readonly TabBarItem[];
  value: string;
  onSelect: (id: string) => void;
  onAdd: () => void;
}
export function TabBar({ items, value, onSelect, onAdd }: TabBarProps) {
  const { bottom } = useSafeAreaInsets();
  function renderItem(item: TabBarItem) {
    const selected = item.id === value;
    const color = selected ? colors.primaryDark : colors.textDisabled;
    return (
      <TouchableOpacity
        key={item.id}
        accessibilityRole="tab"
        accessibilityLabel={item.label}
        accessibilityState={{ selected }}
        onPress={() => onSelect(item.id)}
        style={styles.item}
      >
        <Ionicons
          name={selected ? item.activeIcon : item.inactiveIcon}
          size={metrics.icon}
          color={color}
        />
        <Text variant="caption" style={{ color }}>
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  }
  return (
    <View style={[styles.bar, { paddingBottom: bottom }]}>
      <View style={styles.row}>
        {items.slice(0, 2).map(renderItem)}
        <View style={styles.addSlot}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="소비 기록 추가"
            onPress={onAdd}
            style={styles.add}
          >
            <Ionicons name="add" size={32} color={colors.background} />
          </TouchableOpacity>
        </View>
        {items.slice(2).map(renderItem)}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.large,
    borderTopRightRadius: radius.large,
    ...shadows.menu,
  },
  row: { flexDirection: 'row', minHeight: metrics.tabBar, alignItems: 'center' },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: metrics.tabBar,
    paddingVertical: spacing.sm,
    gap: spacing.xxs,
  },
  addSlot: { flex: 1, alignItems: 'center', alignSelf: 'stretch', justifyContent: 'center' },
  add: {
    width: 64,
    height: 64,
    borderRadius: radius.pill,
    marginTop: -32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    ...shadows.floating,
  },
});
