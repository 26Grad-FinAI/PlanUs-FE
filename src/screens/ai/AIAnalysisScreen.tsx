import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@/components/common/Header';
import { Text } from '@/components/common/Text';
import { SavingsPlanCard } from '@/components/domain/ai/SavingsPlanCard';
import { SavingsSummary } from '@/components/domain/ai/SavingsSummary';
import { useAIAnalysis } from '@/hooks/useAIAnalysis';
import { colors } from '@/constants/colors';
import { metrics, radius, spacing } from '@/constants/layout';

/** 헤더와 탭바는 고정하고, 가변 개수의 플랜과 계산 결과를 함께 스크롤한다. */
export function AIAnalysisScreen() {
  const { analysis, selectedIds, appliedIds, totals, allApplied, togglePlan, apply, notice } =
    useAIAnalysis();
  return (
    <SafeAreaView style={styles.root} edges={['top', 'left', 'right']}>
      <Header title="AI 분석" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.overview}>
          <View style={styles.heading}>
            <Text variant="title" style={styles.headingText}>
              이번 주{' '}
            </Text>
            <View style={styles.highlightedTitle}>
              <View style={styles.highlight} />
              <Text variant="title" style={styles.headingText}>
                AI 종합 의견
              </Text>
            </View>
          </View>
          <Text variant="label" style={styles.period}>
            {analysis.periodLabel}
          </Text>
          <View style={styles.insightCard}>
            <Text variant="label" style={styles.insight}>
              {analysis.insight}
            </Text>
          </View>
        </View>
        <View style={styles.simulation}>
          <View style={styles.sectionHeading}>
            <Text variant="section" accessibilityRole="header">
              절약 시뮬레이션
            </Text>
            <Text variant="label" style={styles.muted}>
              AI가 추천하는 절약 플랜을 확인해보세요
            </Text>
          </View>
          <View style={styles.plans}>
            {analysis.plans.map((plan) => (
              <SavingsPlanCard
                key={plan.id}
                plan={plan}
                selected={selectedIds.has(plan.id)}
                applied={appliedIds.has(plan.id)}
                onPress={() => togglePlan(plan.id)}
              />
            ))}
            {analysis.plans.length === 0 && (
              <Text style={styles.muted}>추천할 절약 플랜이 없어요. 다음 분석을 기다려주세요.</Text>
            )}
          </View>
          <SavingsSummary
            {...totals}
            allApplied={allApplied}
            hasPlans={analysis.plans.length > 0}
            onApply={apply}
          />
          {notice?.error && (
            <Text
              accessibilityRole={notice.error ? 'alert' : 'text'}
              accessibilityLiveRegion="polite"
              variant="label"
              style={notice.error ? styles.error : styles.success}
            >
              {notice.text}
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: {
    width: '100%',
    maxWidth: metrics.contentMax,
    alignSelf: 'center',
    paddingHorizontal: spacing.page,
    paddingTop: spacing.lg,
    paddingBottom: spacing.huge,
    gap: spacing.section,
  },
  overview: { gap: spacing.xs },
  heading: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' },
  headingText: { fontSize: 20, lineHeight: 30 },
  highlightedTitle: { alignSelf: 'flex-start' },
  highlight: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 3,
    height: 10,
    backgroundColor: '#ACDDF6',
  },
  period: { color: colors.textDisabled },
  insightCard: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.card,
    padding: spacing.lg + 2,
    marginTop: spacing.sm,
  },
  insight: { color: colors.textSecondary, lineHeight: 22 },
  simulation: { gap: spacing.lg },
  sectionHeading: { gap: spacing.xxs },
  plans: { gap: spacing.md },
  muted: { color: colors.textTertiary },
  error: { color: colors.error },
  success: { color: colors.primaryDark },
});
