/** 산출 중 이탈한 요청은 취소하고, 완료 결과만 다음 화면으로 전달한다. */
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '@/app/navigation/types';
import { ScreenLayout } from '@/components/common/Layout';
import { Header } from '@/components/common/Header';
import { Text } from '@/components/common/Text';
import { Button } from '@/components/common/Button';
import { IndeterminateProgressBar } from '@/components/common/ProgressBar/IndeterminateProgressBar';
import {
  budgetWaitMs,
  currentBudgetMonth,
  loadBudgetRecommendation,
} from '@/services/api/budgetApi';
import { useAuthStore } from '@/store/useAuthStore';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/layout';
type Props = NativeStackScreenProps<OnboardingStackParamList, 'BudgetLoading'>;
export function BudgetLoadingScreen({ navigation, route }: Props) {
  const { profile } = route.params;
  const [attempt, setAttempt] = useState(0);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    const session = useAuthStore.getState().session;
    if (!session) return;
    const budgetMonth = currentBudgetMonth();
    const isActive = () => !signal.aborted && useAuthStore.getState().session?.id === session.id;
    const timeout = setTimeout(() => {
      if (isActive()) setError('응답이 늦어지고 있어요. 다시 시도하면 진행 상태를 확인해요.');
      controller.abort();
    }, budgetWaitMs);

    async function load() {
      const recommendation = await loadBudgetRecommendation(budgetMonth, attempt > 0, signal);
      if (isActive()) {
        navigation.replace('BudgetRecommendation', { profile, ...budgetMonth, recommendation });
      }
    }

    void load()
      .catch((reason: unknown) => {
        if (isActive()) {
          setError(reason instanceof Error ? reason.message : '예산을 불러오지 못했어요.');
        }
      })
      .finally(() => clearTimeout(timeout));
    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [attempt, navigation, profile]);

  function goBack() {
    if (navigation.canGoBack()) navigation.goBack();
    else useAuthStore.getState().signOut();
  }
  return (
    <ScreenLayout
      scroll={false}
      header={<Header onBack={goBack} backLabel="뒤로" divider={false} />}
      contentStyle={styles.screen}
    >
      <Image
        source={require('../../../assets/images/illustrations/budget-analysis-3d.png')}
        style={styles.image}
        resizeMode="contain"
        accessibilityLabel="예산 분석 보고서"
      />
      <View style={styles.copy}>
        <Text variant="title" accessibilityRole="header" style={styles.center}>
          {error ? (
            '예산 산출을 다시 시도해주세요'
          ) : (
            <>
              AI가{' '}
              <Text variant="inherit" style={styles.emphasis}>
                이번 달 예산
              </Text>
              을{'\n'}계산하고 있어요
            </>
          )}
        </Text>
        <Text style={styles.description} accessibilityLiveRegion="polite">
          {error ?? '예산을 준비하는 데 몇 분이 걸릴 수 있어요.'}
        </Text>
      </View>
      {error ? (
        <Button
          label="다시 시도"
          onPress={() => {
            setError(null);
            setAttempt((value) => value + 1);
          }}
        />
      ) : (
        <View style={styles.progress}>
          <IndeterminateProgressBar label="이번 달 예산 산출 중" />
        </View>
      )}
    </ScreenLayout>
  );
}
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.section,
    paddingBottom: 80,
  },
  image: { width: 140, height: 140 },
  copy: { gap: spacing.md },
  center: { textAlign: 'center', lineHeight: 34 },
  emphasis: { color: colors.primaryDark },
  description: { textAlign: 'center', fontSize: 14, color: colors.textTertiary },
  progress: { width: 160, maxWidth: '100%' },
});
