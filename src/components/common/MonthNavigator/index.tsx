/** 홈/통계의 월 이동. 날짜 계산은 호출자가 담당한다. */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/components/common/Text';
import { IconButton } from '@/components/common/IconButton';
import { spacing } from '@/constants/layout';
interface MonthNavigatorProps {
  year: number;
  month: number;
  onPrevious: () => void;
  onNext: () => void;
  previousDisabled?: boolean;
  nextDisabled?: boolean;
}
export function MonthNavigator({
  year,
  month,
  onPrevious,
  onNext,
  previousDisabled,
  nextDisabled,
}: MonthNavigatorProps) {
  return (
    <View style={styles.row}>
      <IconButton
        name="chevron-back"
        label="이전 달"
        disabled={previousDisabled}
        onPress={onPrevious}
      />
      <Text variant="section" accessibilityLiveRegion="polite" style={styles.title}>
        {year}년 {month}월
      </Text>
      <IconButton name="chevron-forward" label="다음 달" disabled={nextDisabled} onPress={onNext} />
    </View>
  );
}
const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  title: { flex: 1, textAlign: 'center' },
});
