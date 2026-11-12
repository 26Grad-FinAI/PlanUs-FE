/** 시안처럼 날짜를 왼쪽에 한 번만 표시하는 기록 목록. 행 전체가 상세 진입 영역이다. */
import React from 'react';
import { View, FlatList, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { Text } from '@/components/common/Text';
import { Button } from '@/components/common/Button';
import { colors } from '@/constants/colors';
import { fontFamily } from '@/constants/typography';
import { CATEGORY_META } from '@/constants/categories';
import type { DateGroup } from '@/types/home';
import type { RecordListItem } from '@/types/record';
import { formatFullAmount } from '@/utils/formatCurrency';

interface RecentRecordListProps {
  header: React.ReactNode;
  scrollRef?: React.Ref<FlatList<DateGroup>>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  groups: DateGroup[];
  selectedDate: string | null;
  todayISO: string;
  loading: boolean;
  error?: string;
  nextPageLoading: boolean;
  nextPageError?: string;
  onRetry: () => void;
  onLoadNextPage: () => void;
  onPressRecord: (record: RecordListItem) => void;
}
export function RecentRecordList({
  header,
  scrollRef,
  contentContainerStyle,
  groups,
  selectedDate,
  todayISO,
  loading,
  error,
  nextPageLoading,
  nextPageError,
  onRetry,
  onLoadNextPage,
  onPressRecord,
}: RecentRecordListProps) {
  return (
    <FlatList
      ref={scrollRef}
      data={groups}
      keyExtractor={(group) => group.date}
      style={styles.scroll}
      contentContainerStyle={contentContainerStyle}
      showsVerticalScrollIndicator={false}
      onEndReached={selectedDate || nextPageError ? undefined : onLoadNextPage}
      onEndReachedThreshold={0.4}
      ListHeaderComponent={
        <View>
          {header}
          <View style={styles.heading}>
            <Text style={styles.title} accessibilityRole="header" accessibilityLiveRegion="polite">
              {selectedDate
                ? `${Number(selectedDate.slice(5, 7))}월 ${Number(selectedDate.slice(8, 10))}일 내역`
                : '최근 내역'}
            </Text>
          </View>
        </View>
      }
      ListEmptyComponent={
        <View style={styles.emptySection}>
          {loading ? (
            <ActivityIndicator accessibilityLabel="거래 내역 불러오는 중" color={colors.primary} />
          ) : error ? (
            <View>
              <Text style={styles.empty} accessibilityRole="alert">
                {error}
              </Text>
              <Button label="다시 시도" onPress={onRetry} />
            </View>
          ) : (
            <Text style={styles.empty}>
              {selectedDate ? '이 날짜에 기록된 내역이 없어요' : '이 달에 기록된 내역이 없어요'}
            </Text>
          )}
        </View>
      }
      ListFooterComponent={
        <View style={styles.footer}>
          {nextPageLoading && (
            <ActivityIndicator
              accessibilityLabel="다음 거래 내역 불러오는 중"
              color={colors.primary}
            />
          )}
          {nextPageError && (
            <>
              <Text style={styles.empty} accessibilityRole="alert">
                {nextPageError}
              </Text>
              <Button label="다시 시도" onPress={onLoadNextPage} />
            </>
          )}
        </View>
      }
      renderItem={({ item: group, index }) => (
        <View style={styles.section}>
          <View style={[styles.group, index < groups.length - 1 && styles.groupDivider]}>
            <View style={styles.dateColumn}>
              <Text style={[styles.date, group.date === todayISO && styles.today]}>
                {Number(group.date.slice(5, 7))}.{Number(group.date.slice(8, 10))}
              </Text>
            </View>
            <View style={styles.records}>
              {group.items.map((item) => (
                <Pressable
                  key={item.type + ':' + item.id}
                  style={styles.row}
                  accessibilityRole="button"
                  accessibilityLabel={`${item.description}, ${item.type === 'income' ? '수입' : '지출'} ${formatFullAmount(item.amount)}, 상세 보기`}
                  onPress={() => onPressRecord(item)}
                >
                  <View style={styles.description}>
                    <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
                      {item.description}
                    </Text>
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
        </View>
      )}
    />
  );
}
const styles = StyleSheet.create({
  scroll: { flex: 1 },
  section: { backgroundColor: colors.background, paddingHorizontal: 20 },
  heading: {
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 14,
  },
  emptySection: { backgroundColor: colors.background, paddingHorizontal: 20, minHeight: 106 },
  footer: { backgroundColor: colors.background, paddingHorizontal: 20, paddingBottom: 80 },
  title: { fontSize: 16, lineHeight: 26, fontFamily: fontFamily.bold },
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
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, minHeight: 44 },
  description: { flex: 1, minWidth: 0, gap: 2 },
  name: { fontSize: 16, lineHeight: 20, fontFamily: fontFamily.regular },
  category: { fontSize: 12, lineHeight: 18, color: colors.textDisabled },
  amount: { maxWidth: '53%', fontSize: 16, lineHeight: 20, fontFamily: fontFamily.semibold },
  income: { color: colors.income },
  empty: { color: colors.textTertiary, fontSize: 14, textAlign: 'center', paddingVertical: 32 },
});
