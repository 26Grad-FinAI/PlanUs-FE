import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '@/components/common/Text';
import { colors } from '@/constants/colors';
import { metrics, radius, spacing } from '@/constants/layout';
import { fontSize } from '@/constants/typography';
import type { WeeklyFeedbackState } from '@/types/ai';

const confidenceLabels = new Map([
  ['HIGH', { label: '높음', level: 3 }],
  ['MEDIUM', { label: '보통', level: 2 }],
  ['LOW', { label: '낮음', level: 1 }],
]);
const confidenceBarHeights = [8, 11, 14];

function formatWeekDate(date: string) {
  const [, month, day] = date.split('-').map(Number);
  return `${month}월 ${day}일`;
}

export function WeeklyFeedbackCard({ weeklyFeedback }: { weeklyFeedback: WeeklyFeedbackState }) {
  const confidence = weeklyFeedback.status === 'success' ? weeklyFeedback.confidence : undefined;
  const confidenceDisplay = confidence ? confidenceLabels.get(confidence) : undefined;
  return (
    <View style={styles.overview}>
      <View style={styles.heading}>
        <Text variant="title" style={styles.headingText}>
          주간{' '}
        </Text>
        <View style={styles.highlightedTitle}>
          <View style={styles.highlight} />
          <Text variant="title" style={styles.headingText}>
            AI 종합 의견
          </Text>
        </View>
      </View>
      {weeklyFeedback.status === 'success' && (
        <Text variant="label" style={styles.period}>
          {formatWeekDate(weeklyFeedback.weekStart)} – {formatWeekDate(weeklyFeedback.weekEnd)}
        </Text>
      )}
      <View style={styles.insightCard}>
        <Text variant="label" weight="regular" style={styles.insight}>
          {weeklyFeedback.status === 'success'
            ? weeklyFeedback.feedback
            : weeklyFeedback.status === 'loading'
              ? 'AI 종합 의견을 불러오는 중이에요.'
              : weeklyFeedback.status === 'empty'
                ? '아직 주간 AI 종합 의견이 없어요.'
                : 'AI 종합 의견을 불러오지 못했어요.'}
        </Text>
        {confidenceDisplay && (
          <View
            style={styles.confidenceRow}
            accessible
            accessibilityLabel={`분석 신뢰도 ${confidenceDisplay.label}`}
          >
            <Text variant="label" weight="semibold" style={styles.confidenceTitle}>
              분석 신뢰도
            </Text>
            <View style={styles.confidenceValue}>
              <View style={styles.confidenceBars} aria-hidden>
                {confidenceBarHeights.map((height, index) => (
                  <View
                    key={height}
                    style={[
                      styles.confidenceBar,
                      { height },
                      index >= confidenceDisplay.level && styles.inactiveBar,
                    ]}
                  />
                ))}
              </View>
              <Text variant="label" weight="bold" style={styles.confidenceLabel}>
                {confidenceDisplay.label}
              </Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overview: { gap: spacing.xs },
  heading: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' },
  headingText: { fontSize: fontSize.xl, lineHeight: 26 },
  highlightedTitle: { alignSelf: 'flex-start' },
  highlight: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 1,
    height: 10,
    backgroundColor: colors.primaryHighlight,
  },
  period: { color: colors.textDisabled, fontSize: fontSize.xs, lineHeight: 16 },
  insightCard: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.card,
    padding: spacing.lg + 2,
    marginTop: spacing.sm,
    gap: spacing.lg,
  },
  insight: { color: colors.textSecondary, lineHeight: 22 },
  confidenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
    borderTopColor: colors.primaryDivider,
    borderTopWidth: metrics.hairline,
    paddingTop: spacing.sm + spacing.xxs,
  },
  confidenceTitle: { color: colors.textSecondary, fontSize: fontSize.xs, lineHeight: 18 },
  confidenceValue: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  confidenceBars: { flexDirection: 'row', alignItems: 'flex-end', gap: 3 },
  confidenceBar: {
    width: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },
  inactiveBar: { backgroundColor: colors.primaryDivider },
  confidenceLabel: { color: colors.primaryDark, fontSize: fontSize.xs, lineHeight: 18 },
});
