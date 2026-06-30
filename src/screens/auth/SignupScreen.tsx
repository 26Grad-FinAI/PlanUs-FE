/**
 * 회원가입 화면
 *
 * 역할:
 * 1. 닉네임 / 이메일 / 비밀번호 / 비밀번호 확인 입력 받기
 * 2. 입력값 유효성 검사 (전송 전 한 번에 검사)
 * 3. 회원가입 API 호출
 * 4. 가입 성공 시 전역 인증 상태 변경 → Onboarding 스택 진입
 * 5. 가입 실패 시 Alert 표시
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { signup } from '@/services/api/authApi';
import {
  validateNickname,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from '@/utils/validation';
import { useAuthStore } from '@/store/useAuthStore';
import { colors } from '@/constants/colors';
import { fontSize, fontWeight } from '@/constants/typography';
import { AuthStackParamList } from '@/app/navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Signup'>;

export function SignupScreen({ navigation }: Props) {
  const { signIn } = useAuthStore();

  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [nicknameError, setNicknameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  /**
   * 폼 전체 유효성 검사
   * 모든 필드를 순서대로 검사해 에러 메시지를 세팅하고,
   * 하나라도 실패하면 false 반환
   */
  function validate(): boolean {
    let isValid = true;

    // 닉네임
    const nicknameResult = validateNickname(nickname);
    if (!nicknameResult.isValid) {
      setNicknameError(nicknameResult.message);
      isValid = false;
    } else setNicknameError('');

    // 이메일
    const emailResult = validateEmail(email);
    if (!emailResult.isValid) {
      setEmailError(emailResult.message);
      isValid = false;
    } else setEmailError('');

    // 비밀번호
    const passwordResult = validatePassword(password, { maxLength: 16 });
    if (!passwordResult.isValid) {
      setPasswordError(passwordResult.message);
      isValid = false;
    } else setPasswordError('');

    // 비밀번호 확인
    const confirmPasswordResult = validateConfirmPassword(password, confirmPassword);
    if (!confirmPasswordResult.isValid) {
      setConfirmPasswordError(confirmPasswordResult.message);
      isValid = false;
    } else setConfirmPasswordError('');

    return isValid;
  }

  async function handleSignup() {
    if (!validate()) return;

    setIsLoading(true);
    try {
      const response = await signup({ nickname, email, password, confirmPassword });
      // 회원가입 직후 profileCompleted === false → Onboarding 스택으로 이동
      signIn(response.profileCompleted);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : undefined;
      Alert.alert('회원가입 실패', message ?? '잠시 후 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* 상단 제목 영역 */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>회원가입</Text>
          <Text style={styles.subtitle}>플래너스와 함께 시작하세요</Text>
        </View>

        {/* 입력 폼 영역 */}
        <View style={styles.formSection}>
          <Input
            label="닉네임"
            value={nickname}
            onChangeText={(text) => {
              setNickname(text);
              // 입력 중 에러 메시지 즉시 제거
              if (nicknameError) setNicknameError('');
            }}
            placeholder="사용할 닉네임을 입력해주세요"
            error={nicknameError}
            autoCapitalize="none"
            autoCorrect={false}
            maxLength={10}
          />
          <Input
            label="이메일"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (emailError) setEmailError('');
            }}
            placeholder="example@email.com"
            error={emailError}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="emailAddress"
          />
          <Input
            label="비밀번호"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (passwordError) setPasswordError('');
              // 비밀번호가 바뀔 때 확인 필드의 불일치 에러도 갱신
              if (confirmPasswordError && text === confirmPassword) setConfirmPasswordError('');
            }}
            placeholder="8~16자로 입력해주세요"
            error={passwordError}
            secureTextEntry
            maxLength={16}
            textContentType="newPassword"
          />
          <Input
            label="비밀번호 확인"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              if (confirmPasswordError) setConfirmPasswordError('');
            }}
            placeholder="비밀번호를 다시 입력해주세요"
            error={confirmPasswordError}
            secureTextEntry
            maxLength={16}
            textContentType="newPassword"
          />

          <Button
            label="가입하기"
            onPress={handleSignup}
            loading={isLoading}
            fullWidth
            size="lg"
            style={styles.signupButton}
          />
        </View>

        {/* 하단 로그인 링크 */}
        <View style={styles.linkSection}>
          <View style={styles.loginRow}>
            <Text style={styles.linkText}>이미 계정이 있으신가요? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>로그인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  titleSection: {
    marginBottom: 40,
  },
  title: {
    fontSize: fontSize['3xl'],
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: fontSize.base,
    color: colors.textTertiary,
  },
  formSection: {
    gap: 20,
  },
  signupButton: {
    marginTop: 8,
  },
  linkSection: {
    marginTop: 32,
    alignItems: 'center',
  },
  loginRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkText: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
  },
  loginLink: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.primary,
  },
});
