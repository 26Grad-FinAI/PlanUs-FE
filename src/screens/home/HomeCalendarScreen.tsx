/**
 * 홈 캘린더 화면
 *
 * 구성:
 * - SummaryCard: 사용 금액 / 예산 진행바 / 소진율 / 남은 예산
 * - MonthlyCalendar: 날짜별 박스 없이 숫자 + 순증감액(+/-)만 표시, 예정 소비는 점으로 구분
 *   날짜를 탭하면 아래 최근 내역이 해당 날짜로 필터링되고, 같은 날짜를 다시 탭하면 전체로 복귀한다
 * - RecentRecordList: 날짜별로 그룹화해 최근 날짜가 위로 오도록 정렬
 *
 * 상태/파생 데이터는 useHomeCalendar 훅에 모아두고, 이 화면은 조합만 담당한다.
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/constants/colors';
import { fontSize, fontWeight } from '@/constants/typography';
import { useHomeCalendar } from '@/hooks/useHomeCalendar';
import { SummaryCard } from '@/components/domain/home/SummaryCard';
import { MonthlyCalendar } from '@/components/domain/home/MonthlyCalendar';
import { RecentRecordList } from '@/components/domain/home/RecentRecordList';

export function HomeCalendarScreen() {
  const {
    today,
    todayISO,
    monthCursor,
    weeks,
    recordsByDate,
    summary,
    selectedDate,
    visibleGroups,
    handlePrevMonth,
    handleNextMonth,
    handleDayPress,
  } = useHomeCalendar();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>플래너스</Text>
        </View>

        <SummaryCard summary={summary} />

        <MonthlyCalendar
          monthCursor={monthCursor}
          weeks={weeks}
          today={today}
          todayISO={todayISO}
          recordsByDate={recordsByDate}
          selectedDate={selectedDate}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onSelectDate={handleDayPress}
        />

        <RecentRecordList groups={visibleGroups} selectedDate={selectedDate} todayISO={todayISO} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 32, gap: 20 },

  header: { paddingTop: 4, paddingBottom: 4 },
  headerTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
});
