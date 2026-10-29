/** 추천 예산을 편집하고 최신 입력 스냅샷을 확정한다. */
import React, { useRef, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '@/app/navigation/types';
import { ScreenLayout, BottomActionBar } from '@/components/common/Layout';
import { Header } from '@/components/common/Header';
import { Text } from '@/components/common/Text';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { BudgetCategoryCard } from '@/components/domain/budget/BudgetCategoryCard';
import { BudgetCategory, CategoryBudget } from '@/types/budget';
import { useAuthStore } from '@/store/useAuthStore';
import { useBudgetStore } from '@/store/useBudgetStore';
import { formatFullAmount } from '@/utils/formatCurrency';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/layout';
type Props = NativeStackScreenProps<OnboardingStackParamList, 'BudgetRecommendation'>;
const sumBudgets = (budgets: CategoryBudget[]) =>
  budgets.reduce((sum, item) => sum + item.userAmount, 0);
export function BudgetRecommendationScreen({ navigation, route }: Props) {
  const { profile, year, month, recommendation } = route.params;
  const [budgets, setBudgets] = useState(() =>
    recommendation.categories.map((item) => ({ ...item })),
  );
  const [editing, setEditing] = useState<{ category: BudgetCategory; text: string } | null>(null);
  const [editError, setEditError] = useState('');
  const [showOverBudgetModal, setShowOverBudgetModal] = useState(false);
  const [pendingBudget, setPendingBudget] = useState<CategoryBudget[] | null>(null);
  const finished = useRef(false);
  const confirmBudget = useBudgetStore((state) => state.confirmBudget);
  const completeOnboarding = useAuthStore((state) => state.completeOnboarding);
  const validEdit =
    editing !== null && /^\d+$/.test(editing.text) && Number.isSafeInteger(Number(editing.text));
  const preview = validEdit
    ? budgets.map((item) =>
        item.category === editing.category ? { ...item, userAmount: Number(editing.text) } : item,
      )
    : budgets;
  const visibleBudgets = Number.isSafeInteger(sumBudgets(preview)) ? preview : budgets;
  const total = sumBudgets(visibleBudgets);
  const exceeded = total > recommendation.aiTotalAmount;
  function commitEdit(expectedCategory?: BudgetCategory): CategoryBudget[] | null {
    if (expectedCategory && editing?.category !== expectedCategory) return budgets;
    if (!editing) return budgets;
    if (!validEdit || !Number.isSafeInteger(sumBudgets(preview))) {
      setEditError(
        validEdit
          ? '총예산이 너무 커요. 금액을 줄여주세요.'
          : '금액을 입력해주세요. 0원도 입력할 수 있어요.',
      );
      return null;
    }
    setBudgets(preview);
    setEditing((current) => (current?.category === editing.category ? null : current));
    setEditError('');
    return preview;
  }
  function beginEdit(budget: CategoryBudget) {
    if (editing && !commitEdit()) return;
    setEditing({ category: budget.category, text: String(budget.userAmount) });
    setEditError('');
  }
  function reset() {
    setEditing(null);
    setEditError('');
    setBudgets(recommendation.categories.map((item) => ({ ...item })));
  }
  function finalize(snapshot: CategoryBudget[]) {
    if (finished.current) return;
    finished.current = true;
    confirmBudget({
      profile,
      year,
      month,
      recommendation: { ...recommendation, categories: snapshot },
    });
    completeOnboarding();
  }
  function confirm() {
    const snapshot = commitEdit();
    if (!snapshot) return;
    // 편집 직후에도 계산과 저장에 같은 스냅샷을 사용해 마지막 입력을 놓치지 않는다.
    if (sumBudgets(snapshot) > recommendation.aiTotalAmount) {
      setPendingBudget(snapshot);
      setShowOverBudgetModal(true);
    } else finalize(snapshot);
  }
  const pendingExcess = pendingBudget
    ? sumBudgets(pendingBudget) - recommendation.aiTotalAmount
    : 0;
  return (
    <>
      <ScreenLayout
        header={<Header onBack={() => navigation.goBack()} backLabel="뒤로" divider={false} />}
        footer={
          <BottomActionBar>
            <Button label="예산 확정하기" onPress={confirm} />
          </BottomActionBar>
        }
      >
        <View style={styles.heading}>
          <Text variant="title" accessibilityRole="header" style={styles.title}>
            AI가 제안하는{'\n'}
            <Text variant="inherit" style={styles.emphasis}>
              이번 달 예산
            </Text>
            이에요
          </Text>
          <Image
            source={require('../../../assets/images/illustrations/budget-calendar-3d.png')}
            resizeMode="contain"
            style={styles.image}
            accessibilityLabel="예산 달력"
          />
        </View>
        <Card tone="info" style={styles.insightCard}>
          <View style={styles.insightHeading}>
            <Ionicons
              name="sparkles"
              size={18}
              color={colors.primaryDark}
              accessible={false}
              aria-hidden
            />
            <Text variant="label" weight="semibold" style={styles.emphasis}>
              AI 분석
            </Text>
          </View>
          <Text style={styles.insight}>{recommendation.insight}</Text>
        </Card>
        <Card>
          <View style={styles.summaryRow}>
            <Text variant="label" style={styles.muted}>
              AI 제안 예산
            </Text>
            <Text weight="semibold" style={styles.summaryAmount}>
              {formatFullAmount(recommendation.aiTotalAmount)}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text variant="label" style={styles.muted}>
              현재 설정
            </Text>
            <View style={styles.current}>
              <Text
                variant="section"
                style={[styles.emphasis, styles.summaryAmount, exceeded && styles.exceeded]}
              >
                {formatFullAmount(total)}
              </Text>
              {exceeded && (
                <Text variant="caption" style={styles.exceeded}>
                  +{formatFullAmount(total - recommendation.aiTotalAmount)} 초과
                </Text>
              )}
            </View>
          </View>
        </Card>
        <View style={styles.sectionHeading}>
          <Text variant="section">카테고리별 예산</Text>
          <Button
            label="↻ 전체 초기화"
            variant="ghost"
            size="sm"
            onPress={reset}
            style={styles.reset}
          />
        </View>
        <View style={styles.categories}>
          {visibleBudgets.map((budget) => (
            <BudgetCategoryCard
              key={budget.category}
              budget={budget}
              total={total}
              editingValue={editing?.category === budget.category ? editing.text : null}
              error={editing?.category === budget.category ? editError : undefined}
              onEdit={() => beginEdit(budget)}
              onChange={(text) => {
                setEditing({
                  category: budget.category,
                  text: text
                    .replace(/[^0-9]/g, '')
                    .replace(/^0+(?=\d)/, '')
                    .slice(0, 15),
                });
                setEditError('');
              }}
              onCommit={() => commitEdit(budget.category)}
              onCancel={() => {
                setEditing(null);
                setEditError('');
              }}
            />
          ))}
        </View>
      </ScreenLayout>
      <ConfirmModal
        visible={showOverBudgetModal}
        title="예산이 AI 제안을 초과했어요"
        description={`AI 제안보다 ${formatFullAmount(Math.max(0, pendingExcess))} 더 많아요.\n이대로 확정하시겠어요?`}
        cancelLabel="다시 조정할게요"
        confirmLabel="이대로 확정하기"
        onCancel={() => setShowOverBudgetModal(false)}
        onConfirm={() => {
          if (pendingBudget) finalize(pendingBudget);
        }}
      />
    </>
  );
}
const styles = StyleSheet.create({
  categories: { gap: spacing.lg },
  insightCard: { padding: spacing.lg, gap: spacing.sm },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  title: { flex: 1, fontSize: 22, lineHeight: 34 },
  image: { width: 80, height: 80 },
  emphasis: { color: colors.primaryDark },
  insightHeading: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  insight: { color: colors.textSecondary, fontSize: 14, lineHeight: 22 },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  summaryAmount: { flexShrink: 1, textAlign: 'right' },
  current: { flexShrink: 1, alignItems: 'flex-end', gap: spacing.xs },
  divider: { height: 1, backgroundColor: colors.border },
  sectionHeading: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  muted: { color: colors.textTertiary },
  exceeded: { color: colors.error },
  reset: { paddingHorizontal: 0 },
});
