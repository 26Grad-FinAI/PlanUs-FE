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
import { fetchAIBudgetRecommendation } from '@/services/mock/budget.mock';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/layout';
type Props = NativeStackScreenProps<OnboardingStackParamList, 'BudgetLoading'>;
export function BudgetLoadingScreen({ navigation, route }: Props) {
  const { profile, year, month } = route.params;
  const [attempt, setAttempt] = useState(0);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;
    fetchAIBudgetRecommendation(profile, controller.signal)
      .then((recommendation) => {
        if (!cancelled)
          navigation.replace('BudgetRecommendation', { profile, year, month, recommendation });
      })
      .catch(() => {
        if (!cancelled) setError('예산을 산출하지 못했어요. 잠시 후 다시 시도해주세요.');
      });
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [attempt, navigation, profile, year, month]);
  return (
    <ScreenLayout
      scroll={false}
      header={<Header onBack={() => navigation.goBack()} backLabel="뒤로" divider={false} />}
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
          {error ?? '(최대 5분 소요)'}
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
