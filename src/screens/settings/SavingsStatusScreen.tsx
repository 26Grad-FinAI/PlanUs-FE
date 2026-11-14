import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/app/navigation/types';
import { Button } from '@/components/common/Button';
import { Header } from '@/components/common/Header';
import { Text } from '@/components/common/Text';
import { SavingsChart } from '@/components/domain/settings/SavingsChart';
import { colors } from '@/constants/colors';
import { metrics, spacing } from '@/constants/layout';
import { useSettingsQuery } from '@/hooks/useSettingsQuery';
import { useToday } from '@/hooks/useToday';
import { fetchSavingsStatus } from '@/services/api/savingsStatusApi';
import { formatFullAmount } from '@/utils/formatCurrency';
import { toISODate } from '@/utils/formatDate';

export function SavingsStatusScreen({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'SavingsStatus'>) {
  const { result, retry } = useSettingsQuery(fetchSavingsStatus);
  const currentMonth = toISODate(useToday()).slice(0, 7);
  const records =
    result.status === 'success'
      ? result.data.monthlyRecords
          .filter(({ yearMonth }) => yearMonth < currentMonth)
          .sort((first, second) => first.yearMonth.localeCompare(second.yearMonth))
      : [];
  const totalSavings = records.reduce((total, { savings }) => total + savings, 0);

  return (
    <SafeAreaView style={styles.root}>
      <Header title="저축 현황" onBack={navigation.goBack} />
      {result.status === 'loading' && (
        <View style={styles.status}>
          <ActivityIndicator color={colors.primary} accessibilityLabel="저축 현황 조회 중" />
        </View>
      )}
      {result.status === 'error' && (
        <View style={styles.status}>
          <Text accessibilityRole="alert">저축 현황을 불러오지 못했어요.</Text>
          <Button label="다시 시도" onPress={retry} variant="ghost" size="sm" />
        </View>
      )}
      {result.status === 'success' && records.length === 0 && (
        <View style={styles.status}>
          <Text style={styles.muted}>아직 데이터가 없어요.</Text>
        </View>
      )}
      {records.length > 0 && (
        <FlatList
          style={styles.list}
          data={[...records].reverse()}
          keyExtractor={({ yearMonth }) => yearMonth}
          ListHeaderComponent={
            <>
              <View style={styles.overview}>
                <Text variant="label" style={styles.muted}>
                  {Number(records[0].yearMonth.slice(5))}월부터 {records.length}개월 동안
                </Text>
                <Text variant="amount" weight="extrabold" style={styles.total}>
                  {formatFullAmount(totalSavings)}
                </Text>
                <Text variant="label" style={styles.description}>
                  {totalSavings < 0
                    ? '이 기간에는 수입보다 지출이 많았어요.'
                    : '매달 수입에서 지출을 빼고 남은 금액이에요.'}
                </Text>
                <View style={styles.chart}>
                  <SavingsChart records={records} />
                </View>
              </View>
              <View style={styles.historyHeading}>
                <Text variant="section" accessibilityRole="header">
                  월별 기록
                </Text>
              </View>
            </>
          }
          renderItem={({ item }) => {
            const [year, month] = item.yearMonth.split('-');
            const amount = formatFullAmount(item.savings);

            return (
              <View style={styles.record}>
                <Text>
                  {year}년 {Number(month)}월
                </Text>
                <Text weight="bold" style={item.savings < 0 && styles.shortfall}>
                  {item.savings > 0 ? `+${amount}` : amount}
                </Text>
              </View>
            );
          }}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  list: { width: '100%', maxWidth: metrics.contentMax, alignSelf: 'center' },
  status: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  overview: {
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.section,
    paddingBottom: spacing.section,
  },
  total: { marginTop: spacing.xs },
  muted: { color: colors.textTertiary },
  description: { color: colors.textSecondary, marginTop: spacing.sm },
  chart: { marginTop: spacing.section },
  historyHeading: {
    borderTopWidth: spacing.sm,
    borderTopColor: colors.surfaceMuted,
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.sm,
  },
  record: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 56,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.sm,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceMuted,
    marginHorizontal: spacing.xxl,
  },
  shortfall: { color: colors.error },
});
