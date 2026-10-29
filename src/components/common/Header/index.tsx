/** 중앙 제목과 좌우 액션. 안전 영역은 화면 레이아웃이 담당한다. */
import React, { ReactNode } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Text } from '@/components/common/Text';
import { IconButton } from '@/components/common/IconButton';
import { colors } from '@/constants/colors';
import { metrics, spacing } from '@/constants/layout';
interface HeaderProps {
  title?: string;
  onBack?: () => void;
  onClose?: () => void;
  backLabel?: string;
  right?: ReactNode;
  divider?: boolean;
}
export function Header({ title, onBack, onClose, backLabel, right, divider = true }: HeaderProps) {
  return (
    <View style={[styles.header, divider && styles.divider]}>
      <View style={[styles.side, backLabel && styles.wide]}>
        {onClose ? (
          <IconButton name="close" label="닫기" onPress={onClose} />
        ) : onBack ? (
          backLabel ? (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="뒤로 가기"
              style={styles.back}
              onPress={onBack}
            >
              <Ionicons
                accessible={false}
                aria-hidden={true}
                name="arrow-back"
                size={metrics.icon}
                color={colors.textSecondary}
              />
              <Text style={styles.backLabel}>{backLabel}</Text>
            </TouchableOpacity>
          ) : (
            <IconButton name="arrow-back" label="뒤로 가기" onPress={onBack} />
          )
        ) : null}
      </View>
      {title ? (
        <Text variant="section" accessibilityRole="header" style={styles.title}>
          {title}
        </Text>
      ) : (
        <View style={styles.title} />
      )}
      <View style={[styles.side, backLabel && styles.wide]}>{right}</View>
    </View>
  );
}
const styles = StyleSheet.create({
  header: {
    minHeight: metrics.header,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.background,
  },
  divider: { borderBottomWidth: 1, borderBottomColor: colors.border },
  side: { width: metrics.touch, alignItems: 'center' },
  wide: { width: 80 },
  title: { flex: 1, textAlign: 'center', paddingVertical: spacing.md },
  back: { minHeight: metrics.touch, flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  backLabel: { color: colors.textSecondary },
});
