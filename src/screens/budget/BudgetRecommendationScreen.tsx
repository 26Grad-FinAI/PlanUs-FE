/**
 * AI 예산 추천 화면 (온보딩 2단계)
 *
 * 구성:
 * - AI 인사이트 카드: 예산 산정 근거
 * - 예산 비교 카드: AI 제안 총액 vs 사용자 설정 총액
 * - 카테고리별 예산: 항목별 편집 + 전체 초기화
 * - 확정 버튼: 초과 시 경고 모달 → 그래도 확정 or 취소
 */

import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Button } from '@/components/common/Button';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { colors } from '@/constants/colors';
import { fontSize, fontWeight } from '@/constants/typography';
import { OnboardingStackParamList } from '@/app/navigation/types';
import { useAuthStore } from '@/store/useAuthStore';
import { mockAIBudget } from '@/services/mock/budget.mock';
import { BudgetCategory, CategoryBudget } from '@/types/budget';

// 카테고리별 아이콘 (소비 등록 화면과 동일한 아이콘 사용)
const CATEGORY_ICON: Record<BudgetCategory, keyof typeof Ionicons.glyphMap> = {
  grocery: 'cart-outline',
  dining: 'restaurant-outline',
  alcohol: 'beer-outline',
  clothing: 'shirt-outline',
  leisure: 'film-outline',
  medical: 'medkit-outline',
  education: 'book-outline',
  travel: 'airplane-outline',
  telecom: 'phone-portrait-outline',
  other: 'ellipsis-horizontal-circle-outline',
};

function formatCurrency(amount: number): string {
  return amount.toLocaleString('ko-KR');
}

type BudgetRecommendationNavigationProp = NativeStackNavigationProp<
  OnboardingStackParamList,
  'BudgetRecommendation'
>;

interface BudgetRecommendationScreenProps {
  navigation: BudgetRecommendationNavigationProp;
}

export function BudgetRecommendationScreen({ navigation }: BudgetRecommendationScreenProps) {
  const { top: topInset, bottom: bottomInset } = useSafeAreaInsets();
  const completeOnboarding = useAuthStore((s) => s.completeOnboarding);

  const [budgets, setBudgets] = useState<CategoryBudget[]>(
    mockAIBudget.categories.map((c) => ({ ...c })),
  );
  const [editingCategoryId, setEditingCategoryId] = useState<BudgetCategory | null>(null);
  const [editingText, setEditingText] = useState('');
  const [showOverBudgetModal, setShowOverBudgetModal] = useState(false);

  const inputRef = useRef<TextInput>(null);

  const aiTotal = mockAIBudget.aiTotalAmount;
  const userTotal = budgets.reduce((sum, b) => sum + b.userAmount, 0);
  const isExceeded = userTotal > aiTotal;
  const exceededAmount = userTotal - aiTotal;

  // ── 편집 핸들러 ──────────────────────────────────────────────────────────

  function handleEditStart(categoryId: BudgetCategory, currentAmount: number) {
    if (editingCategoryId && editingCategoryId !== categoryId) {
      commitEdit();
    }
    setEditingCategoryId(categoryId);
    setEditingText(String(currentAmount));
  }

  function commitEdit() {
    if (!editingCategoryId) return;
    const parsed = parseInt(editingText.replace(/[^0-9]/g, ''), 10);
    const newAmount = isNaN(parsed) ? 0 : parsed;
    setBudgets((prev) =>
      prev.map((b) => (b.category === editingCategoryId ? { ...b, userAmount: newAmount } : b)),
    );
    setEditingCategoryId(null);
    setEditingText('');
  }

  // 전체 카테고리를 AI 제안값으로 초기화
  function handleResetAll() {
    setEditingCategoryId(null);
    setEditingText('');
    setBudgets(mockAIBudget.categories.map((c) => ({ ...c })));
  }

  function handleConfirm() {
    commitEdit();
    if (isExceeded) {
      setShowOverBudgetModal(true);
    } else {
      finalize();
    }
  }

  function finalize() {
    // TODO: API 연결 시 예산 저장
    // await saveBudget({ categories: budgets, totalAmount: userTotal });
    console.log('[mock] 예산 확정:', { userTotal, budgets });
    completeOnboarding();
  }

  // ── 카테고리 아이템 ────────────────────────────────────────────────────

  function renderCategoryItem(budget: CategoryBudget) {
    const isEditing = editingCategoryId === budget.category;
    const isCategoryOver = budget.userAmount > budget.aiAmount;
    const excess = budget.userAmount - budget.aiAmount;

    // 사용자 총액 대비 이 카테고리의 비중 (0~100%)
    const barPct = userTotal > 0 ? Math.min((budget.userAmount / userTotal) * 100, 100) : 0;
    const barPctRounded = Math.round(barPct);

    return (
      <View key={budget.category} style={styles.categoryCard}>
        {/* 상단 행: 아이콘 + 카테고리명 + 금액 편집 */}
        <View style={styles.categoryRow}>
          <Ionicons name={CATEGORY_ICON[budget.category]} size={19} color={colors.textTertiary} />
          <Text style={styles.categoryLabel}>{budget.label}</Text>

          {/* 금액 영역 — 탭 시 인라인 편집 모드 전환 */}
          {isEditing ? (
            <TextInput
              ref={inputRef}
              style={styles.amountInput}
              value={editingText}
              onChangeText={(t) => setEditingText(t.replace(/[^0-9]/g, ''))}
              onBlur={commitEdit}
              keyboardType="numeric"
              autoFocus
              returnKeyType="done"
              onSubmitEditing={commitEdit}
              selectTextOnFocus
            />
          ) : (
            <TouchableOpacity
              style={styles.amountTouchable}
              onPress={() => handleEditStart(budget.category, budget.userAmount)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={`${budget.label} 예산 수정`}
            >
              <Text style={[styles.amountText, isCategoryOver && styles.amountTextOver]}>
                {formatCurrency(budget.userAmount)}원
              </Text>
              <Ionicons name="create-outline" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {/* 비중 막대 */}
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${barPct}%`,
                backgroundColor: isCategoryOver ? colors.expense : colors.primary,
              },
            ]}
          />
        </View>

        {/* 하단 메타: AI 제안 / 초과 | 비중 % */}
        <View style={styles.categoryMeta}>
          <View style={styles.categoryMetaLeft}>
            <Text style={styles.aiHintText}>AI 제안 {formatCurrency(budget.aiAmount)}원</Text>
            {isCategoryOver && (
              <Text style={styles.categoryOverText}> +{formatCurrency(excess)}원 초과</Text>
            )}
          </View>
          <Text style={[styles.pctText, isCategoryOver && styles.pctTextOver]}>
            {barPctRounded}%
          </Text>
        </View>
      </View>
    );
  }

  return (
    <>
      <View style={[styles.screen, { paddingTop: topInset }]}>
        {/* ── 헤더 ── */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="뒤로"
          >
            <Ionicons name="arrow-back" size={22} color={colors.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>AI 예산 추천</Text>
          <View style={styles.backButton} />
        </View>

        {/* ── 스크롤 영역 ── */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomInset + 100 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          {/* 페이지 제목 */}
          <View style={styles.titleSection}>
            <Text style={styles.titleMain}>AI가 제안하는</Text>
            <Text style={styles.titleSub}>이번 달 예산이에요</Text>
          </View>

          {/* AI 인사이트 카드 */}
          <View style={styles.insightCard}>
            <View style={styles.insightHeader}>
              <Ionicons name="sparkles" size={15} color={colors.primary} />
              <Text style={styles.insightLabel}>AI 분석</Text>
            </View>
            <Text style={styles.insightText}>{mockAIBudget.insight}</Text>
          </View>

          {/* 예산 비교 카드 */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryRowLabel}>AI 제안 예산</Text>
              <Text style={styles.summaryAiAmount}>{formatCurrency(aiTotal)}원</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryRowLabel}>현재 설정</Text>
              <View style={styles.summaryUserRight}>
                <Text
                  style={[styles.summaryUserAmount, isExceeded && styles.summaryUserAmountOver]}
                >
                  {formatCurrency(userTotal)}원
                </Text>
                {isExceeded && (
                  <Text style={styles.summaryExcessLabel}>
                    +{formatCurrency(exceededAmount)} 초과
                  </Text>
                )}
                {!isExceeded && userTotal < aiTotal && (
                  <Text style={styles.summarySavingLabel}>
                    -{formatCurrency(aiTotal - userTotal)} 절약
                  </Text>
                )}
              </View>
            </View>
          </View>

          {/* 카테고리별 예산 섹션 */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>카테고리별 예산</Text>
            <TouchableOpacity
              onPress={handleResetAll}
              activeOpacity={0.7}
              style={styles.resetAllButton}
            >
              <Ionicons name="refresh-outline" size={13} color={colors.textTertiary} />
              <Text style={styles.resetAllText}>전체 초기화</Text>
            </TouchableOpacity>
          </View>

          {budgets.map(renderCategoryItem)}
        </ScrollView>

        {/* 하단 확정 버튼 */}
        <View style={[styles.bottomBar, { paddingBottom: bottomInset + 12 }]}>
          <Button
            label="예산 확정하기"
            variant="primary"
            size="lg"
            fullWidth
            onPress={handleConfirm}
          />
        </View>
      </View>

      {/* 초과 예산 확정 모달 */}
      <ConfirmModal
        visible={showOverBudgetModal}
        iconName="trending-up-outline"
        iconColor={colors.planned}
        iconBg={colors.plannedBg}
        title="예산이 AI 제안을 초과했어요"
        description={`AI 제안보다 ${formatCurrency(exceededAmount)}원 더 많아요.\n이대로 확정하시겠어요?`}
        cancelLabel="다시 조정할게요"
        confirmLabel="이대로 확정하기"
        confirmVariant="primary"
        onCancel={() => setShowOverBudgetModal(false)}
        onConfirm={() => {
          setShowOverBudgetModal(false);
          finalize();
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  screen: { flex: 1, backgroundColor: colors.background },

  // ── 헤더 ──
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    height: 52,
  },
  backButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },

  // ── 스크롤 ──
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 8, gap: 16 },

  // ── 페이지 제목 ──
  titleSection: { gap: 2 },
  titleMain: {
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    lineHeight: 34,
  },
  titleSub: {
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.bold,
    color: colors.primary,
    lineHeight: 34,
  },

  // ── AI 인사이트 카드 ──
  insightCard: {
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  insightHeader: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  insightLabel: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.primary,
  },
  insightText: { fontSize: fontSize.sm, color: colors.textSecondary, lineHeight: 20 },

  // ── 예산 비교 카드 ──
  summaryCard: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 16,
    padding: 20,
    gap: 14,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryRowLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.textTertiary,
  },
  summaryAiAmount: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.textSecondary,
  },
  summaryDivider: { height: 1, backgroundColor: colors.border },
  summaryUserRight: { alignItems: 'flex-end', gap: 2 },
  summaryUserAmount: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
  summaryUserAmountOver: { color: colors.expense },
  summaryExcessLabel: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    color: colors.expense,
  },
  summarySavingLabel: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    color: colors.income,
  },

  // ── 섹션 헤더 ──
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },
  resetAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  resetAllText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    color: colors.textTertiary,
  },

  // ── 카테고리 카드 ──
  categoryCard: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  categoryLabel: {
    flex: 1,
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },

  // 금액 터치 영역 (뷰 모드)
  amountTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  amountText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },
  amountTextOver: { color: colors.expense },

  // 금액 TextInput (편집 모드)
  amountInput: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.primary,
    textAlign: 'right',
    minWidth: 100,
    padding: 0,
    borderBottomWidth: 1.5,
    borderBottomColor: colors.primary,
  },

  // ── 비중 막대 ──
  progressTrack: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 2 },

  // ── 카테고리 하단 메타 ──
  categoryMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryMetaLeft: { flexDirection: 'row', alignItems: 'center' },
  aiHintText: { fontSize: fontSize.xs, color: colors.textDisabled },
  categoryOverText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    color: colors.expense,
  },
  pctText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.textTertiary,
  },
  pctTextOver: { color: colors.expense },

  // ── 하단 버튼바 ──
  bottomBar: {
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
