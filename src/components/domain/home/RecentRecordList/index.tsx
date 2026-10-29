/** 시안처럼 날짜를 왼쪽에 한 번만 표시하는 기록 목록. 행 전체가 상세 진입 영역이다. */
import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Text } from '@/components/common/Text';
import { colors } from '@/constants/colors';
import { fontFamily } from '@/constants/typography';
import { CATEGORY_META } from '@/constants/categories';
import { DateGroup } from '@/hooks/useHomeCalendar';
import { formatFullAmount } from '@/utils/formatCurrency';

interface RecentRecordListProps {
  groups: DateGroup[];
  selectedDate: string | null;
  todayISO: string;
  onPressRecord: (id: string) => void;
}
export function RecentRecordList({
  groups,
  selectedDate,
  todayISO,
  onPressRecord,
}: RecentRecordListProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.title} accessibilityRole="header" accessibilityLiveRegion="polite">
        {selectedDate
          ? `${Number(selectedDate.slice(5, 7))}월 ${Number(selectedDate.slice(8, 10))}일 내역`
          : '최근 내역'}
      </Text>
      {groups.length === 0 ? (
        <Text style={styles.empty}>
          {selectedDate ? '이 날짜에 기록된 내역이 없어요' : '이번 달에 기록된 내역이 없어요'}
        </Text>
      ) : (
        groups.map((group, index) => (
          <View
            key={group.date}
            style={[styles.group, index < groups.length - 1 && styles.groupDivider]}
          >
            <View style={styles.dateColumn}>
              <Text style={[styles.date, group.date === todayISO && styles.today]}>
                {Number(group.date.slice(5, 7))}.{Number(group.date.slice(8, 10))}
              </Text>
            </View>
            <View style={styles.records}>
              {group.items.map((item) => (
                <Pressable
                  key={item.id}
                  style={styles.row}
                  accessibilityRole="button"
                  accessibilityLabel={`${item.description}, ${item.type === 'income' ? '수입' : '지출'} ${formatFullAmount(item.amount)}, 상세 보기`}
                  onPress={() => onPressRecord(item.id)}
                >
                  <View style={styles.description}>
                    <Text style={styles.name}>{item.description}</Text>
                    <Text style={styles.category}>{CATEGORY_META[item.category].label}</Text>
                  </View>
                  <Text
                    style={[styles.amount, item.type === 'income' && styles.income]}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.7}
                  >
                    {item.type === 'income' ? '+' : '-'}
                    {formatFullAmount(item.amount)}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        ))
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  section: {
    backgroundColor: colors.background,
    padding: 20,
    paddingTop: 24,
    paddingBottom: 80,
    minHeight: 250,
  },
  title: { fontSize: 16, lineHeight: 26, fontFamily: fontFamily.bold, marginBottom: 14 },
  group: { flexDirection: 'row', gap: 12, paddingVertical: 16 },
  groupDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceMuted,
  },
  dateColumn: { width: 44, paddingTop: 4, gap: 2 },
  date: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
    fontFamily: fontFamily.semibold,
  },
  today: { color: colors.primaryDark },
  records: { flex: 1, gap: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 44 },
  description: { flex: 1, gap: 2 },
  name: { fontSize: 14, lineHeight: 20, fontFamily: fontFamily.medium },
  category: { fontSize: 12, lineHeight: 18, color: colors.textDisabled },
  amount: { maxWidth: '53%', fontSize: 14, lineHeight: 20, fontFamily: fontFamily.semibold },
  income: { color: colors.income },
  empty: { color: colors.textTertiary, fontSize: 14, textAlign: 'center', paddingVertical: 32 },
});
