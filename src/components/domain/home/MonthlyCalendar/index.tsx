/** 날짜 선택과 오늘 표시를 분리하고, 수입과 지출을 상쇄하지 않고 표시한다. */
import React from 'react';
import { View, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import { MonthNavigator } from '@/components/common/MonthNavigator';
import { Text } from '@/components/common/Text';
import { colors } from '@/constants/colors';
import { fontFamily } from '@/constants/typography';
import { SpendingRecord } from '@/types/record';
import { formatComma } from '@/utils/formatCurrency';
import { toISODate } from '@/utils/formatDate';

const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];
interface MonthlyCalendarProps {
  monthCursor: Date;
  weeks: (Date | null)[][];
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
  todayISO,
  recordsByDate,
  selectedDate,
  onPrevMonth,
  onNextMonth,
  onSelectDate,
}: MonthlyCalendarProps) {
  const { width } = useWindowDimensions();
  // Web의 말줄임을 막기 위해 큰 금액도 날짜 셀 폭에 맞는 글자 크기로 표시한다.
  const cellWidth = (Math.min(width, 640) - 64) / 7;
  function amountSize(amount: number) {
    return Math.min(10, Math.max(6, cellWidth / ((formatComma(amount).length + 1) * 0.6)));
  }
  function renderDayCell(date: Date | null, key: string) {
    if (!date) return <View key={key} style={styles.dayCell} />;
    const dateKey = toISODate(date);
    const dayRecords = recordsByDate[dateKey] ?? [];
    const isToday = dateKey === todayISO;
    const isSelected = selectedDate === dateKey;
    const income = dayRecords
      .filter((r) => r.type === 'income')
      .reduce((sum, r) => sum + r.amount, 0);
    const expense = dayRecords
      .filter((r) => r.type === 'expense')
      .reduce((sum, r) => sum + r.amount, 0);
    return (
      <TouchableOpacity
        key={key}
        style={styles.dayCell}
        onPress={() => onSelectDate(dateKey)}
        activeOpacity={0.65}
        accessibilityRole="button"
        accessibilityState={{ selected: isSelected }}
        accessibilityLabel={`${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일${isToday ? ', 오늘' : ''}, 수입 ${formatComma(income)}원, 지출 ${formatComma(expense)}원 내역 보기`}
      >
        <View style={[styles.dayNumberWrap, isSelected && styles.selected]}>
          <Text
            style={[
              styles.dayNumber,
              date.getDay() === 0 && styles.sunday,
              isToday && styles.today,
              isSelected && styles.selectedText,
            ]}
          >
            {date.getDate()}
          </Text>
        </View>
        <View style={styles.amounts}>
          {income > 0 && (
            <Text
              style={[styles.dayAmount, styles.income, { fontSize: amountSize(income) }]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.6}
            >
              +{formatComma(income)}
            </Text>
          )}
          {expense > 0 && (
            <Text
              style={[styles.dayAmount, styles.expense, { fontSize: amountSize(expense) }]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.6}
            >
              -{formatComma(expense)}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  }
  return (
    <View style={styles.card}>
      <MonthNavigator
        year={monthCursor.getFullYear()}
        month={monthCursor.getMonth() + 1}
        onPrevious={onPrevMonth}
        onNext={onNextMonth}
      />
      <View style={styles.weekdays}>
        {WEEKDAY_LABELS.map((label, index) => (
          <Text key={label} style={[styles.weekday, index === 0 && styles.sunday]}>
            {label}
          </Text>
        ))}
      </View>
      {weeks.map((week, index) => (
        <View key={index} style={styles.week}>
          {week.map((date, day) => renderDayCell(date, `${index}-${day}`))}
        </View>
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 28,
  },
  weekdays: { flexDirection: 'row', marginTop: 10, marginBottom: 12 },
  weekday: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 18,
    color: colors.textTertiary,
    fontFamily: fontFamily.medium,
  },
  week: { flexDirection: 'row' },
  dayCell: { flex: 1, minWidth: 0, minHeight: 50, alignItems: 'center', paddingTop: 4 },
  dayNumberWrap: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
  dayNumber: { fontSize: 14, lineHeight: 22, fontFamily: fontFamily.medium },
  sunday: { color: colors.expense },
  today: { color: colors.primary, fontFamily: fontFamily.bold },
  selected: { backgroundColor: colors.primary },
  selectedText: { color: colors.background, fontFamily: fontFamily.bold },
  amounts: { alignSelf: 'stretch', alignItems: 'center', marginTop: 3 },
  dayAmount: { fontSize: 10, lineHeight: 13, fontFamily: fontFamily.medium, maxWidth: '100%' },
  income: { color: colors.income },
  expense: { color: colors.expense },
});
