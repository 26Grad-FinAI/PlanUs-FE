/** 업무 상태와 분리된 개발용 컴포넌트 전시. 실제 API는 호출하지 않는다. */
import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/common/Text';
import { colors } from '@/constants/colors';
import { spacing, metrics, radius } from '@/constants/layout';
import { typography } from '@/constants/typography';

export function DesignSystemScreen() {
  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text variant="title">planus 디자인 시스템</Text>
        <Text variant="body">#19 · Pretendard · 컴포넌트 미리보기</Text>
        <View style={styles.card}>
          <Text variant="section">타이포그래피</Text>
          {(Object.keys(typography) as (keyof typeof typography)[]).map((variant) => (
            <Text key={variant} variant={variant}>
              {variant} · 맞춤 예산 1,234,567원
            </Text>
          ))}
        </View>
        <View style={styles.card}>
          <Text variant="section">색상</Text>
          <View style={styles.swatches}>
            {(
              [
                'primary',
                'primaryDark',
                'primaryLight',
                'expense',
                'income',
                'textDisabled',
              ] as const
            ).map((name) => (
              <View key={name} style={styles.swatchItem}>
                <View style={[styles.swatch, { backgroundColor: colors[name] }]} />
                <Text variant="caption">{name}</Text>
                <Text variant="caption">{colors[name]}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surfaceMuted },
  content: {
    width: '100%',
    maxWidth: metrics.contentMax,
    alignSelf: 'center',
    padding: spacing.page,
    gap: spacing.xxl,
  },
  card: {
    backgroundColor: colors.background,
    borderRadius: radius.card,
    padding: spacing.xl,
    gap: spacing.lg,
  },
  swatches: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.lg },
  swatchItem: { gap: spacing.xs },
  swatch: { width: 80, height: 48, borderRadius: radius.input },
});
