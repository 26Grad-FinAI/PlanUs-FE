/** 홈은 조회 상태를 유지한 채 루트 스택의 상세 화면으로 이동한다. */
import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Text } from '@/components/common/Text';
import { Button } from '@/components/common/Button';
import { RootStackParamList } from '@/app/navigation/types';
import { colors } from '@/constants/colors';
import { fontFamily } from '@/constants/typography';
import { useHomeCalendar } from '@/hooks/useHomeCalendar';
import { useMotionEnabled } from '@/hooks/useMotionEnabled';
import { SummaryCard } from '@/components/domain/home/SummaryCard';
import { MonthlyCalendar } from '@/components/domain/home/MonthlyCalendar';
import { RecentRecordList } from '@/components/domain/home/RecentRecordList';

export function HomeCalendarScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const motionEnabled = useMotionEnabled();
  const {
    today,
    todayISO,
    monthCursor,
    weeks,
    totalsByDate,
    summary,
    monthError,
    selectedDate,
    visibleGroups,
    listLoading,
    listError,
    nextPageLoading,
    nextPageError,
    loadNextPage,
    retryMonth,
    retryRecords,
    handlePrevMonth,
    handleNextMonth,
    handleDayPress,
  } = useHomeCalendar();
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <RecentRecordList
        key={`${monthCursor.getFullYear()}-${monthCursor.getMonth()}`}
        contentContainerStyle={styles.content}
        groups={visibleGroups}
        selectedDate={selectedDate}
        todayISO={todayISO}
        loading={listLoading}
        error={listError}
        nextPageLoading={nextPageLoading}
        nextPageError={nextPageError}
        onRetry={retryRecords}
        onLoadNextPage={loadNextPage}
        onPressRecord={(record) => navigation.navigate('RecordDetail', { record })}
        header={
          <>
            <View style={styles.header}>
              <Text style={styles.logo}>planus</Text>
            </View>
            {summary ? (
              <SummaryCard
                summary={summary}
                motionEnabled={motionEnabled}
                isCurrentMonth={
                  monthCursor.getFullYear() === today.getFullYear() &&
                  monthCursor.getMonth() === today.getMonth()
                }
              />
            ) : (
              <View style={styles.status}>
                {monthError ? (
                  <>
                    <Text accessibilityRole="alert">{monthError}</Text>
                    <Button label="다시 시도" onPress={retryMonth} />
                  </>
                ) : (
                  <ActivityIndicator
                    accessibilityLabel="홈 정보 불러오는 중"
                    color={colors.primary}
                  />
                )}
              </View>
            )}
            <View style={styles.calendarSection}>
              <MonthlyCalendar
                monthCursor={monthCursor}
                weeks={weeks}
                todayISO={todayISO}
                totalsByDate={totalsByDate}
                selectedDate={selectedDate}
                onPrevMonth={handlePrevMonth}
                onNextMonth={handleNextMonth}
                onSelectDate={handleDayPress}
              />
            </View>
          </>
        }
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surfaceMuted },
  content: {
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
    paddingHorizontal: 12,
  },
  header: { height: 62, justifyContent: 'center' },
  logo: {
    color: colors.primary,
    fontSize: 22,
    lineHeight: 30,
    letterSpacing: -0.8,
    fontFamily: fontFamily.extrabold,
  },
  calendarSection: { marginTop: 12, marginBottom: 8 },
  status: { alignItems: 'center', gap: 12, paddingVertical: 20 },
});
