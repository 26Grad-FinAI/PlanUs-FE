/** 수입/지출의 상세 정보. ID로 스토어를 구독해 목록과 같은 기록을 표시한다. */
import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/app/navigation/types';
import { Header } from '@/components/common/Header';
import { Text } from '@/components/common/Text';
import { Button } from '@/components/common/Button';
import { colors } from '@/constants/colors';
import { fontFamily } from '@/constants/typography';
import { CATEGORY_META } from '@/constants/categories';
import { useRecordStore } from '@/store/useRecordStore';
import { SpendingNature } from '@/types/record';
import { formatFullAmount } from '@/utils/formatCurrency';

const NATURE_LABELS: Record<SpendingNature, string> = {
  needed: '필요한 소비였어요',
  happy: '만족스러웠어요',
  impulse: '충동적이었어요',
};
const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];
type Props = NativeStackScreenProps<RootStackParamList, 'RecordDetail'>;

export function RecordDetailScreen({ navigation, route }: Props) {
  const record = useRecordStore((state) =>
    state.records.find((item) => item.id === route.params.recordId),
  );
  function goBack() {
    if (navigation.canGoBack()) navigation.goBack();
    else navigation.navigate('Main');
  }
  if (!record) {
    return (
      <SafeAreaView style={styles.screen}>
        <Header title="내역 상세" onBack={goBack} />
        <View style={styles.empty}>
          <Text>내역을 찾을 수 없어요</Text>
          <Button label="돌아가기" onPress={goBack} />
        </View>
      </SafeAreaView>
    );
  }
  const isIncome = record.type === 'income';
  const category = CATEGORY_META[record.category];
  // 날짜만 있는 문자열을 UTC로 파싱하면 지역에 따라 전날이 되어 로컬 자정으로 해석한다.
  const date = new Date(record.date + 'T00:00:00');
  const dateLabel = `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 (${WEEKDAYS[date.getDay()]})`;
  function row(label: string, value: string, badge = false) {
    return (
      <View style={styles.row}>
        <Text style={styles.label}>{label}</Text>
        <View style={[styles.valueWrap, badge && styles.badge]}>
          <Text style={[styles.value, badge && styles.badgeText]}>{value}</Text>
        </View>
      </View>
    );
  }
  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <Header title="내역 상세" onBack={goBack} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.icon}>
            <Ionicons name={category.icon} size={28} color={colors.textSecondary} />
          </View>
          <Text style={styles.name}>{record.description}</Text>
          <Text style={styles.amount} adjustsFontSizeToFit minimumFontScale={0.6} numberOfLines={1}>
            {isIncome ? '+' : '-'}
            {formatFullAmount(record.amount)}
          </Text>
        </View>
        <View style={styles.details}>
          {row('구분', isIncome ? '수입' : '지출')}
          {row('카테고리', category.label)}
          {row('날짜', dateLabel)}
          {!isIncome && (
            <>
              {row('소비 성격', NATURE_LABELS[record.spendingNature], true)}
              {row('반복 지출', record.isRecurring ? '예' : '아니요')}
            </>
          )}
          {row('메모', record.memo?.trim() || '메모 없음')}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: {
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  hero: { alignItems: 'center', paddingTop: 32, paddingBottom: 20 },
  icon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.backgroundAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    lineHeight: 26,
    color: colors.textSecondary,
    marginTop: 12,
    textAlign: 'center',
  },
  amount: {
    maxWidth: '100%',
    fontSize: 32,
    lineHeight: 44,
    fontFamily: fontFamily.bold,
    marginTop: 12,
    letterSpacing: -0.5,
  },
  details: { borderTopWidth: 1, borderTopColor: colors.border },
  row: {
    minHeight: 51,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceMuted,
  },
  label: { width: 80, fontSize: 16, lineHeight: 22, color: colors.textTertiary },
  valueWrap: { flexShrink: 1, marginLeft: 'auto', maxWidth: '74%' },
  value: { fontSize: 16, lineHeight: 22, textAlign: 'right' },
  badge: {
    backgroundColor: colors.primaryLight,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginVertical: -2,
  },
  badgeText: { color: colors.primaryDark, fontFamily: fontFamily.semibold },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 20 },
});
