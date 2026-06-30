/**
 * 홈 화면 — 최근 내역 (날짜별 그룹)
 *
 * 날짜별로 그룹화된 기록을 최근 날짜가 위로 오도록 렌더링한다.
 * 캘린더에서 날짜를 선택하면 groups가 해당 날짜 하나로 필터링되어 전달된다.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '@/constants/colors';
import { fontSize, fontWeight } from '@/constants/typography';
import { CATEGORY_META } from '@/constants/categories';
import { DateGroup } from '@/hooks/useHomeCalendar';
import { formatFullAmount } from '@/utils/formatCurrency';

const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

interface RecentRecordListProps {
  groups: DateGroup[];
  selectedDate: string | null;
  todayISO: string;
}

export function RecentRecordList({ groups, selectedDate, todayISO }: RecentRecordListProps) {
  function renderDateGroup(group: DateGroup, isLast: boolean) {
    const groupDate = new Date(`${group.date}T00:00:00`);
    const isPlannedGroup = group.date > todayISO;
    const isTodayGroup = group.date === todayISO;

    return (
      <View key={group.date} style={[styles.dateGroup, !isLast && styles.dateGroupDivider]}>
        {/* 날짜 헤더 — 해당 날짜의 항목들이 그 아래에 리스트로 나온다 */}
        <View style={styles.dateGroupHeader}>
          {isTodayGroup && <Text style={styles.dateGroupToday}>오늘 · </Text>}
          <Text style={styles.dateGroupTitle}>
            {groupDate.getMonth() + 1}월 {groupDate.getDate()}일 (
            {WEEKDAY_LABELS[groupDate.getDay()]})
          </Text>
          {isPlannedGroup && (
            <View style={styles.plannedTag}>
              <Text style={styles.plannedTagText}>예정</Text>
            </View>
          )}
        </View>

        {/* 날짜에 속한 항목 리스트 */}
        {group.items.map((item) => {
          const meta = CATEGORY_META[item.category];
          const isIncome = item.type === 'income';
          const amountColor = isPlannedGroup
            ? colors.planned
            : isIncome
              ? colors.income
              : colors.expense;

          return (
            <View key={item.id} style={styles.recordRow}>
              <View style={[styles.recordIconWrap, isIncome && styles.recordIconWrapIncome]}>
                <Ionicons
                  name={meta.icon}
                  size={18}
                  color={isIncome ? colors.income : colors.textSecondary}
                />
              </View>
              <View style={styles.recordTextWrap}>
                <Text style={styles.recordDescription}>{item.description}</Text>
                <Text style={styles.recordCategory}>{meta.label}</Text>
              </View>
              <Text style={[styles.recordAmount, { color: amountColor }]}>
                {isIncome ? '+' : '-'}
                {formatFullAmount(item.amount)}
              </Text>
            </View>
          );
        })}
      </View>
    );
  }

  return (
    <View style={styles.recentSection}>
      <Text style={styles.recentSectionTitle}>
        {selectedDate
          ? `${Number(selectedDate.split('-')[1])}월 ${Number(selectedDate.split('-')[2])}일 내역`
          : '최근 내역'}
      </Text>
      {groups.length > 0 ? (
        groups.map((group, index) => renderDateGroup(group, index === groups.length - 1))
      ) : (
        <Text style={styles.emptyText}>소비 기록이 없습니다.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  recentSection: { gap: 18 },
  recentSectionTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  emptyText: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
    textAlign: 'center',
    paddingVertical: 24,
  },

  dateGroup: { gap: 12 },
  // 날짜 그룹끼리 살짝 더 분명하게 구분되도록 여백 + 옅은 구분선 추가
  dateGroupDivider: {
    paddingBottom: 14,
    marginBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dateGroupHeader: { flexDirection: 'row', alignItems: 'center' },
  dateGroupToday: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.primary,
  },
  dateGroupTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.textSecondary,
  },
  plannedTag: {
    marginLeft: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: colors.plannedBg,
  },
  plannedTagText: {
    fontSize: fontSize.xxs,
    fontWeight: fontWeight.semibold,
    color: colors.planned,
  },

  recordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  recordIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundAlt,
  },
  recordIconWrapIncome: { backgroundColor: colors.incomeBg },
  recordTextWrap: { flex: 1, gap: 4 },
  // lineHeight를 명시해야 텍스트 내용에 따라 행간이 미묘하게 달라 보이는 문제(브라우저/폰트별 기본 leading 차이)가 사라진다
  recordDescription: {
    fontSize: fontSize.sm,
    lineHeight: 18,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },
  recordCategory: {
    fontSize: fontSize.xs,
    lineHeight: 16,
    color: colors.textTertiary,
  },
  recordAmount: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
});
