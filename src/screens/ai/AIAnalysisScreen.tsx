import React, { useRef } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import type { ScrollViewInstance } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@/components/common/Header';
import { Button } from '@/components/common/Button';
import { Text } from '@/components/common/Text';
import { SavingsPlanCard } from '@/components/domain/ai/SavingsPlanCard';
import { SavingsSummary } from '@/components/domain/ai/SavingsSummary';
import { WeeklyFeedbackCard } from '@/components/domain/ai/WeeklyFeedbackCard';
import { useAIAnalysis } from '@/hooks/useAIAnalysis';
import { useScrollToTopOnFocus } from '@/hooks/useScrollToTopOnFocus';
import { useWeeklyFeedback } from '@/hooks/useWeeklyFeedback';
import { colors } from '@/constants/colors';
import { metrics, spacing } from '@/constants/layout';

/** 헤더와 탭바는 고정하고, 가변 개수의 플랜과 계산 결과를 함께 스크롤한다. */
export function AIAnalysisScreen() {
  const scrollRef = useRef<ScrollViewInstance>(null);
  useScrollToTopOnFocus(scrollRef);
  const weeklyFeedback = useWeeklyFeedback();
  const {
    query,
    selectedIds,
    monthly,
    annual,
    hasSelection,
    result,
    locked,
    togglePlan,
    apply,
    retry,
  } = useAIAnalysis();
  const applying = result?.status === 'applying';
  const errorMessage =
    result?.status === 'error' || result?.status === 'alreadyApplied' ? result.message : undefined;
  return (
    <SafeAreaView style={styles.root} edges={['top', 'left', 'right']}>
      <Header title="AI 분석" />
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <WeeklyFeedbackCard weeklyFeedback={weeklyFeedback} />
        <View style={styles.simulation}>
          <View style={styles.sectionHeading}>
            <Text
              variant="body"
              weight="bold"
              accessibilityRole="header"
              style={styles.simulationTitle}
            >
              절약 시뮬레이션
            </Text>
            <Text variant="label" weight="regular" style={styles.muted}>
              AI가 추천하는 절약 플랜을 확인해보세요
            </Text>
          </View>
          {query.status === 'loading' && (
            <ActivityIndicator color={colors.primary} accessibilityLabel="절약 플랜 조회 중" />
          )}
          {query.status === 'error' && (
            <View style={styles.sectionHeading}>
              <Text accessibilityRole="alert">절약 플랜을 불러오지 못했어요.</Text>
              <Button label="다시 시도" onPress={retry} variant="ghost" size="sm" />
            </View>
          )}
          {query.status === 'success' &&
            (query.plans.length === 0 ? (
              <Text style={styles.muted}>추천할 절약 플랜이 없어요. 다음 분석을 기다려주세요.</Text>
            ) : (
              <>
                <View style={styles.plans}>
                  {query.plans.map((plan) => (
                    <SavingsPlanCard
                      key={plan.categoryId}
                      plan={plan}
                      selected={selectedIds.includes(plan.categoryId)}
                      disabled={applying || locked}
                      onPress={() => togglePlan(plan.categoryId)}
                    />
                  ))}
                </View>
                <SavingsSummary
                  monthly={monthly}
                  annual={annual}
                  hasSelection={hasSelection}
                  applied={locked}
                  applying={applying}
                  onApply={apply}
                />
              </>
            ))}
          {errorMessage && (
            <Text
              accessibilityRole="alert"
              accessibilityLiveRegion="polite"
              variant="label"
              style={styles.error}
            >
              {errorMessage}
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
  simulation: { gap: spacing.lg },
  sectionHeading: { gap: spacing.xxs, marginBottom: -spacing.xs },
  simulationTitle: { lineHeight: 20 },
  plans: { gap: spacing.md },
  muted: { color: colors.textTertiary },
  error: { color: colors.error },
});
