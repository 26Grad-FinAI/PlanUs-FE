/** 수입/지출의 상세 정보. ID로 스토어를 구독해 목록과 같은 기록을 표시한다. */
import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/app/navigation/types';
import { Header } from '@/components/common/Header';
import { Text } from '@/components/common/Text';
import { Button } from '@/components/common/Button';
import { IconButton } from '@/components/common/IconButton';
import { ActionMenuContent } from '@/components/common/ActionMenu';
import { ConfirmModalContent } from '@/components/common/ConfirmModal';
import { ModalSurface } from '@/components/common/ModalSurface';
import { colors } from '@/constants/colors';
import { fontFamily } from '@/constants/typography';
import { CATEGORY_META } from '@/constants/categories';
import { useRecordStore } from '@/store/useRecordStore';
import { SpendingRecord } from '@/types/record';
import { SPENDING_NATURE_LABELS } from '@/constants/record';
import { metrics, spacing } from '@/constants/layout';
import { formatFullAmount } from '@/utils/formatCurrency';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];
type Props = NativeStackScreenProps<RootStackParamList, 'RecordDetail'>;

export function RecordDetailScreen({ navigation, route }: Props) {
  const currentRecord = useRecordStore((state) =>
    state.records.find((item) => item.id === route.params.recordId),
  );
  const deleteRecord = useRecordStore((state) => state.deleteRecord);
  const [dialog, setDialog] = useState<'menu' | 'delete'>('menu');
  const [dialogVisible, setDialogVisible] = useState(false);
  const [deletedRecord, setDeletedRecord] = useState<SpendingRecord | null>(null);
  // 삭제 직후 스택이 제거되기 전까지 상세를 유지해 '찾을 수 없음'이 깜빡이지 않게 한다.
  const record = currentRecord ?? deletedRecord;
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
      <Header
        title="내역 상세"
        onBack={goBack}
        right={
          <IconButton
            name="ellipsis-horizontal"
            label="내역 더보기"
            surface={dialogVisible && dialog === 'menu'}
            onPress={() => {
              setDialog('menu');
              setDialogVisible(true);
            }}
          />
        }
      />
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
              {row('소비 성격', SPENDING_NATURE_LABELS[record.spendingNature], true)}
              {row('반복 지출', record.isRecurring ? '예' : '아니요')}
            </>
          )}
          {row('메모', record.memo?.trim() || '메모 없음')}
        </View>
      </ScrollView>
      {/* 메뉴→삭제 확인은 같은 Modal 안에서 전환해 iOS의 모달 중첩을 피한다. */}
      <ModalSurface
        visible={dialogVisible}
        onClose={() => setDialogVisible(false)}
        placement={dialog === 'menu' ? 'topRight' : 'center'}
        dim={dialog === 'delete'}
        animationType="none"
        slideFromTop={dialog === 'menu'}
        overlayStyle={dialog === 'menu' ? styles.menuOverlay : undefined}
        contentStyle={dialog === 'menu' ? styles.menu : styles.confirm}
      >
        {dialog === 'menu' ? (
          <ActionMenuContent
            onClose={() => setDialogVisible(false)}
            items={[
              {
                id: 'edit',
                label: '수정',
                onPress: () => navigation.navigate('RecordEdit', { recordId: record.id }),
              },
              {
                id: 'delete',
                label: '삭제',
                destructive: true,
                onPress: () => {
                  setDialog('delete');
                  setDialogVisible(true);
                },
              },
            ]}
          />
        ) : (
          <ConfirmModalContent
            title="이 내역을 삭제할까요?"
            description="삭제한 내역은 되돌릴 수 없어요."
            confirmLabel="삭제"
            confirmVariant="destructive"
            onCancel={() => setDialogVisible(false)}
            onConfirm={() => {
              setDeletedRecord(record);
              setDialogVisible(false);
              deleteRecord(record.id);
              navigation.popTo('Main', { screen: 'HomeCalendar' });
            }}
          />
        )}
      </ModalSurface>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  menuOverlay: { paddingHorizontal: spacing.md },
  menu: { maxWidth: 148, paddingVertical: spacing.xxs },
  confirm: { maxWidth: metrics.dialogWidth },
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
