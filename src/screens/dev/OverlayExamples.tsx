/** 날짜 취소/확정과 확인/삭제/선택 메뉴의 실제 상태 전환 예시. */
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/components/common/Text';
import { Button } from '@/components/common/Button';
import { DateField } from '@/components/common/DateField';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { ActionMenu } from '@/components/common/ActionMenu';
import { spacing } from '@/constants/layout';
export function OverlayExamples() {
  const [date, setDate] = useState(new Date(2026, 7, 24));
  const [dialog, setDialog] = useState<'delete' | 'budget' | 'account' | null>(null);
  const [menu, setMenu] = useState(false);
  const [result, setResult] = useState('아직 실행한 작업이 없어요.');
  return (
    <View style={styles.section}>
      <Text variant="section">날짜 · 모달 · 메뉴</Text>
      <DateField label="거래 날짜" value={date} onChange={setDate} required />
      <DateField label="비활성 날짜" value={date} onChange={setDate} disabled />
      <Button label="삭제 모달 열기" variant="destructive" onPress={() => setDialog('delete')} />
      <Button label="예산 초과 모달 열기" variant="secondary" onPress={() => setDialog('budget')} />
      <Button
        label="이미 가입된 계정 모달 열기"
        variant="secondary"
        onPress={() => setDialog('account')}
      />
      <Button label="수정 · 삭제 메뉴 열기" variant="ghost" onPress={() => setMenu(true)} />
      <Text accessibilityLiveRegion="polite">{result}</Text>
      <ActionMenu
        visible={menu}
        onClose={() => setMenu(false)}
        items={[
          { id: 'edit', label: '수정', onPress: () => setResult('수정을 선택했어요.') },
          { id: 'delete', label: '삭제', destructive: true, onPress: () => setDialog('delete') },
        ]}
      />
      <ConfirmModal
        visible={dialog !== null}
        title={
          dialog === 'delete'
            ? '이 내역을 삭제할까요?'
            : dialog === 'budget'
              ? '예산이 AI 제안을 초과했어요'
              : '이미 가입된 계정이에요'
        }
        emphasis={dialog === 'account' ? 'example@email.com' : undefined}
        description={
          dialog === 'delete'
            ? '삭제한 내역은 되돌릴 수 없어요.'
            : dialog === 'budget'
              ? 'AI 제안보다 80,000원 더 많아요.\n이대로 확정하시겠어요?'
              : '로그인 화면으로 이동할까요?'
        }
        cancelLabel={
          dialog === 'account'
            ? '다른 이메일로 가입'
            : dialog === 'budget'
              ? '다시 조정할게요'
              : '취소'
        }
        confirmLabel={
          dialog === 'delete' ? '삭제' : dialog === 'budget' ? '이대로 확정하기' : '로그인하기'
        }
        confirmVariant={dialog === 'delete' ? 'destructive' : 'primary'}
        onCancel={() => setDialog(null)}
        onConfirm={() => {
          setResult(dialog === 'delete' ? '삭제를 확인했어요. (미리보기)' : '확인을 선택했어요.');
          setDialog(null);
        }}
      />
    </View>
  );
}
const styles = StyleSheet.create({ section: { gap: spacing.lg } });
