/** 시안의 흰색 예산 카드. 펼침 상태는 날짜 필터와 독립적으로 유지한다. */
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/components/common/Text';
import { ProgressBar } from '@/components/common/ProgressBar';
import { ExpandableSection } from '@/components/common/ExpandableSection';
import { colors } from '@/constants/colors';
import { fontFamily } from '@/constants/typography';
import { HomeSummary } from '@/types/home';
import { formatFullAmount } from '@/utils/formatCurrency';

interface SummaryCardProps {
  summary: HomeSummary;
  isCurrentMonth: boolean;
}
export function SummaryCard({ summary, isCurrentMonth }: SummaryCardProps) {
  const [expanded, setExpanded] = useState(false);
  function row(label: string, amount: number, sign = '', total = false) {
    return (
      <View style={styles.breakdownRow}>
        <Text style={[styles.breakdownLabel, !total && styles.indented]}>{label}</Text>
        <Text style={[styles.breakdownAmount, total && styles.totalAmount]}>
          {sign}
          {formatFullAmount(amount)}
        </Text>
      </View>
    );
  }
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{isCurrentMonth ? '이번 달 사용 금액' : '해당 월 사용 금액'}</Text>
      <View style={styles.amountRow}>
        <Text style={styles.amount} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.65}>
          {formatFullAmount(summary.totalExpense)}
        </Text>
        <Text style={styles.budget} numberOfLines={1} adjustsFontSizeToFit>
          / {formatFullAmount(summary.budgetTotal)}
        </Text>
      </View>
      <View style={styles.progress}>
        <ProgressBar label="예산 소진율" value={summary.usageRate} />
      </View>
      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.label}>예산 소진율</Text>
          <Text style={styles.statValue}>{summary.usageRate}%</Text>
        </View>
        <View style={[styles.stat, styles.remaining]}>
          <Text style={styles.label}>남은 예산</Text>
          <Text style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit>
            {formatFullAmount(summary.remaining)}
          </Text>
        </View>
      </View>
      <View style={styles.expansion}>
        <ExpandableSection
          label="전체 수입·지출 보기"
          expanded={expanded}
          onToggle={() => setExpanded(!expanded)}
        >
          <View style={styles.breakdown}>
            {row('수입', summary.totalIncome, '+', true)}
            {row('월 소득', summary.monthlyIncome)}
            {row('추가 수입', summary.additionalIncome)}
            <View style={styles.divider} />
            {row('지출', summary.totalOutflow, '-', true)}
            {row('고정 지출', summary.fixedExpense)}
            {row('생활비', summary.totalExpense)}
          </View>
        </ExpandableSection>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  card: { backgroundColor: colors.background, borderRadius: 24, padding: 20, paddingBottom: 14 },
  label: { fontSize: 14, lineHeight: 20, color: colors.textTertiary },
  amountRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8, marginTop: 6 },
  amount: { flex: 1, fontSize: 32, lineHeight: 42, fontFamily: fontFamily.bold, letterSpacing: -1 },
  budget: {
    maxWidth: '43%',
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fontFamily.medium,
    color: colors.textTertiary,
  },
  progress: { marginTop: 14 },
  stats: { flexDirection: 'row', marginTop: 16, marginBottom: 14 },
  stat: { flex: 1, gap: 2 },
  remaining: { borderLeftWidth: 1, borderColor: colors.surfaceMuted, paddingLeft: 20 },
  statValue: { fontSize: 20, lineHeight: 24, fontFamily: fontFamily.bold },
  expansion: { borderTopWidth: 1, borderColor: colors.surfaceMuted, paddingTop: 2 },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: 8,
  },
  breakdown: { gap: 2 },
  breakdownLabel: { fontSize: 14, lineHeight: 20, color: colors.textTertiary },
  indented: { paddingLeft: 10 },
  breakdownAmount: { fontSize: 14, lineHeight: 20, color: colors.textTertiary },
  totalAmount: {
    fontSize: 16,
    lineHeight: 22,
    color: colors.textPrimary,
    fontFamily: fontFamily.semibold,
  },
  divider: { height: 1, backgroundColor: colors.surfaceMuted, marginVertical: 8 },
});
