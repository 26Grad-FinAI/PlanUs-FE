/**
 * 홈 화면 — 월별 캘린더
 *
 * 날짜별 박스 없이 숫자 + 순증감액(+/-)만 표시한다.
 * 예정(미래) 소비가 있는 날은 작은 점으로 구분하고, 날짜를 탭하면 onSelectDate가 호출된다.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '@/constants/colors';
import { fontSize, fontWeight } from '@/constants/typography';
import { SpendingRecord } from '@/types/record';
import { formatComma } from '@/utils/formatCurrency';
import { isSameDay, toISODate } from '@/utils/formatDate';

const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

interface MonthlyCalendarProps {
  monthCursor: Date;
  weeks: (Date | null)[][];
  today: Date;
  todayISO: string;
  recordsByDate: Record<string, SpendingRecord[]>;
  selectedDate: string | null;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onSelectDate: (dateKey: string) => void;
}

export function MonthlyCalendar({
  monthCursor,
  weeks,
  today,
  todayISO,
  recordsByDate,
  selectedDate,
  onPrevMonth,
  onNextMonth,
  onSelectDate,
}: MonthlyCalendarProps) {
  function renderDayCell(date: Date | null, key: string) {
    if (!date) return <View key={key} style={styles.dayCell} />;

    const dateKey = toISODate(date);
    const dayRecords = recordsByDate[dateKey] ?? [];
    const isToday = isSameDay(date, today);
    const isPlannedDay = dateKey > todayISO;
    const isSunday = date.getDay() === 0;

    let net = 0;
    dayRecords.forEach((record) => {
      net += record.type === 'income' ? record.amount : -record.amount;
    });

    const hasRecords = dayRecords.length > 0;
    const amountColor = isPlannedDay ? colors.planned : net >= 0 ? colors.income : colors.expense;
    const isSelected = selectedDate === dateKey;

    return (
      <TouchableOpacity
        key={key}
        style={styles.dayCell}
        onPress={() => onSelectDate(dateKey)}
        activeOpacity={0.6}
        accessibilityRole="button"
        accessibilityLabel={`${date.getMonth() + 1}월 ${date.getDate()}일 내역 보기`}
      >
        <View
          style={[
            styles.dayNumberWrap,
            isSelected && !isToday && styles.dayNumberWrapSelected,
            isToday && styles.dayNumberWrapToday,
          ]}
        >
          <Text
            style={[
              styles.dayNumberText,
              isSunday && !isToday && styles.dayNumberTextSunday,
              isToday && styles.dayNumberTextToday,
            ]}
          >
            {date.getDate()}
          </Text>
          {/* 예정(미래) 소비가 있는 날: 박스 대신 작은 점으로만 표시 */}
          {isPlannedDay && hasRecords && <View style={styles.plannedDot} />}
        </View>
        {hasRecords && (
          <Text
            style={[styles.dayAmountText, { color: amountColor }]}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.55}
          >
            {net >= 0 ? '+' : '-'}
            {formatComma(Math.abs(net))}
          </Text>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.calendarCard}>
      <View style={styles.monthNavRow}>
        <TouchableOpacity
          onPress={onPrevMonth}
          style={styles.monthNavButton}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="이전 달"
        >
          <Ionicons name="chevron-back" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
        <Text style={styles.monthNavTitle}>
          {monthCursor.getFullYear()}년 {monthCursor.getMonth() + 1}월
        </Text>
        <TouchableOpacity
          onPress={onNextMonth}
          style={styles.monthNavButton}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="다음 달"
        >
          <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.weekdayRow}>
        {WEEKDAY_LABELS.map((label, index) => (
          <Text key={label} style={[styles.weekdayText, index === 0 && styles.weekdayTextSunday]}>
            {label}
          </Text>
        ))}
      </View>

      {weeks.map((week, weekIndex) => (
        <View key={`week-${weekIndex}`} style={styles.weekRow}>
          {week.map((date, dayIndex) => renderDayCell(date, `${weekIndex}-${dayIndex}`))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  calendarCard: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 12,
    gap: 4,
  },
  monthNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  monthNavButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthNavTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },

  weekdayRow: { flexDirection: 'row' },
  weekdayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    color: colors.textTertiary,
    paddingBottom: 8,
  },
  weekdayTextSunday: { color: colors.expense },

  weekRow: { flexDirection: 'row' },
  dayCell: {
    flex: 1,
    minHeight: 46,
    alignItems: 'center',
    paddingTop: 4,
    gap: 3,
  },
  dayNumberWrap: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayNumberWrapToday: {
    backgroundColor: colors.primary,
    borderRadius: 13,
  },
  // 탭으로 선택한 날짜(오늘이 아닌 경우) — 채움 대신 테두리로만 가볍게 구분
  dayNumberWrapSelected: {
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: 13,
  },
  dayNumberText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.textPrimary,
  },
  dayNumberTextSunday: { color: colors.expense },
  dayNumberTextToday: {
    color: colors.background,
    fontWeight: fontWeight.bold,
  },
  // 예정(미래) 소비가 있는 날 표시용 작은 점 — 박스 대신 가볍게 구분
  plannedDot: {
    position: 'absolute',
    top: -1,
    right: -1,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: colors.planned,
    borderWidth: 1.5,
    borderColor: colors.backgroundAlt,
  },
  dayAmountText: {
    fontSize: 9,
    fontWeight: fontWeight.semibold,
  },
});
