/** 홈은 조회 상태를 유지한 채 루트 스택의 상세 화면으로 이동한다. */
import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Text } from '@/components/common/Text';
import { RootStackParamList } from '@/app/navigation/types';
import { colors } from '@/constants/colors';
import { fontFamily } from '@/constants/typography';
import { useHomeCalendar } from '@/hooks/useHomeCalendar';
import { SummaryCard } from '@/components/domain/home/SummaryCard';
import { MonthlyCalendar } from '@/components/domain/home/MonthlyCalendar';
import { RecentRecordList } from '@/components/domain/home/RecentRecordList';

export function HomeCalendarScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
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
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.logo}>planus</Text>
        </View>
        <SummaryCard
          summary={summary}
          isCurrentMonth={
            monthCursor.getFullYear() === today.getFullYear() &&
            monthCursor.getMonth() === today.getMonth()
          }
        />
        <View style={styles.calendarSection}>
          <MonthlyCalendar
            monthCursor={monthCursor}
            weeks={weeks}
            todayISO={todayISO}
            recordsByDate={recordsByDate}
            selectedDate={selectedDate}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            onSelectDate={handleDayPress}
          />
          <RecentRecordList
            groups={visibleGroups}
            selectedDate={selectedDate}
            todayISO={todayISO}
            onPressRecord={(recordId) => navigation.navigate('RecordDetail', { recordId })}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surfaceMuted },
  scroll: { flex: 1 },
  content: {
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
    paddingHorizontal: 12,
    paddingBottom: 0,
  },
  header: { height: 62, justifyContent: 'center' },
  logo: {
    color: colors.primary,
    fontSize: 22,
    lineHeight: 30,
    letterSpacing: -0.8,
    fontFamily: fontFamily.extrabold,
  },
  calendarSection: { marginTop: 12, gap: 8 },
});
