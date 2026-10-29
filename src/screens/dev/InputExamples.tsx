/** 실제 입력/비활성/오류/로딩과 중첩 타이포 확인용 예시. */
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/components/common/Text';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { AmountInput } from '@/components/common/AmountInput';
import { TextArea } from '@/components/common/TextArea';
import { IconButton } from '@/components/common/IconButton';
import { spacing } from '@/constants/layout';

export function InputExamples() {
  const [email, setEmail] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [amount, setAmount] = useState('150000');
  const [memo, setMemo] = useState('');
  const [showError, setShowError] = useState(false);
  const [hidden, setHidden] = useState(true);
  return (
    <View style={styles.section}>
      <Text variant="section">버튼 · 입력</Text>
      <Text variant="caption">
        작은 안내 안의{' '}
        <Text variant="inherit" weight="bold">
          굵은 강조
        </Text>
        도 크기를 유지해요.
      </Text>
      <Button label="오류 상태 전환" onPress={() => setShowError((value) => !value)} />
      <Button label="보조 버튼" variant="secondary" />
      <Button label="링크 버튼" variant="ghost" />
      <Button label="삭제" variant="destructive" />
      <Button label="사용할 수 없어요" disabled />
      <Button label="처리 중" loading />
      <IconButton name="close" label="아이콘 버튼 예시" surface />
      <Input
        label="이메일"
        required
        placeholder="example@email.com"
        value={email}
        onChangeText={setEmail}
        error={showError ? '이메일을 확인해주세요.' : undefined}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <Input
        label="비밀번호"
        placeholder="비밀번호를 입력해주세요"
        secureTextEntry={hidden}
        rightIcon={hidden ? 'eye-outline' : 'eye-off-outline'}
        rightLabel={hidden ? '비밀번호 보기' : '비밀번호 숨기기'}
        onRightPress={() => setHidden((value) => !value)}
      />
      <Input
        label="나이"
        variant="underline"
        suffix="세"
        keyboardType="number-pad"
        placeholder="만 나이를 입력하세요"
      />
      <AmountInput
        label="금액"
        required
        value={amount}
        onChangeText={setAmount}
        error={showError ? '금액을 확인해주세요.' : undefined}
      />
      <AmountInput
        label="밑줄형 금액"
        variant="underline"
        value={amount}
        onChangeText={setAmount}
      />
      <Input label="비활성 입력" value="수정할 수 없어요" editable={false} />
      <TextArea
        label="자기소개"
        required
        hint="소비 습관을 자유롭게 적어주세요."
        value={memo}
        onChangeText={setMemo}
        placeholder="메모를 입력하세요"
        error={showError ? '10자 이상 입력해주세요.' : undefined}
      />
      <Text variant="section">로그인 · 플로팅 라벨</Text>
      <Input
        variant="floating"
        label="이메일"
        accessibilityLabel="로그인 이메일"
        value={loginEmail}
        onChangeText={setLoginEmail}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        autoComplete="email"
        error={showError ? '이메일을 확인해주세요.' : undefined}
      />
      <Input
        variant="floating"
        label="비밀번호"
        accessibilityLabel="로그인 비밀번호"
        value={loginPassword}
        onChangeText={setLoginPassword}
        secureTextEntry
        autoComplete="current-password"
        error={showError ? '비밀번호를 확인해주세요.' : undefined}
      />
      <Input
        variant="floating"
        label="비활성 플로팅 입력"
        value="example@email.com"
        editable={false}
      />
      <Button
        label="로그인 입력값 초기화"
        variant="ghost"
        onPress={() => {
          setLoginEmail('');
          setLoginPassword('');
        }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  section: { gap: spacing.lg },
});
