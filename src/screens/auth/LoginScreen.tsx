/**
 * 로그인 화면
 *
 * 역할:
 * 1. 이메일/비밀번호 입력 받기
 * 2. 입력값 유효성 검사
 * 3. 로그인 API 호출
 * 4. 로그인 성공 시 전역 인증 상태 변경
 * 5. 로그인 실패 시 Alert 표시
 *
 * 로그인 성공 시 signIn() 호출 → RootNavigator가 스택 자동 전환
 * - hasCompletedOnboarding === false → Onboarding 스택
 * - hasCompletedOnboarding === true  → Main 스택
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
import { FloatingInput } from '@/components/common/FloatingInput';
import { login } from '@/services/api/authApi';
import { validateEmail, validatePassword } from '@/utils/validation';
import { useAuthStore } from '@/store/useAuthStore';
import { colors } from '@/constants/colors';
import { fontSize, fontWeight } from '@/constants/typography';
import { AuthStackParamList } from '@/app/navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const { signIn } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 이메일, 비밀번호 유효성 검사
  function validate(): boolean {
    let isValid = true;

    const emailResult = validateEmail(email);
    if (!emailResult.isValid) {
      setEmailError(emailResult.message);
      isValid = false;
    } else setEmailError('');

    const passwordResult = validatePassword(password);
    if (!passwordResult.isValid) {
      setPasswordError(passwordResult.message);
      isValid = false;
    } else setPasswordError('');

    return isValid;
  }

  async function handleLogin() {
    if (!validate()) return;

    setIsLoading(true);
    try {
      const response = await login({ email, password });
      signIn(response.profileCompleted);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : undefined;
      Alert.alert('로그인 실패', message ?? '이메일 또는 비밀번호를 확인해주세요.');
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
        <View style={styles.titleSection}>
          <Text style={styles.appTitle}>플래너스</Text>
          <Text style={styles.appSubtitle}>공공데이터 기반 소비 플래너</Text>
        </View>

        <View style={styles.formSection}>
          <FloatingInput
            label="이메일"
            value={email}
            onChangeText={(text: string) => {
              setEmail(text);
              if (emailError) setEmailError('');
            }}
            error={emailError}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="emailAddress"
          />
          <FloatingInput
            label="비밀번호"
            value={password}
            onChangeText={(text: string) => {
              setPassword(text);
              if (passwordError) setPasswordError('');
            }}
            error={passwordError}
            secureTextEntry
            textContentType="password"
          />
          <Button
            label="로그인"
            onPress={handleLogin}
            loading={isLoading}
            fullWidth
            style={styles.loginButton}
          />
        </View>

        <View style={styles.linkSection}>
          <TouchableOpacity
            onPress={() => {
              /* TODO: 비밀번호 찾기 */
            }}
          >
            <Text style={styles.linkText}>비밀번호를 잊으셨나요?</Text>
          </TouchableOpacity>
          <View style={styles.signupRow}>
            <Text style={styles.linkText}>계정이 없으신가요? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.signupLink}>가입하기</Text>
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
    alignItems: 'center',
    marginBottom: 48,
  },
  appTitle: {
    fontSize: fontSize['3xl'],
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  appSubtitle: {
    fontSize: fontSize.base,
    color: colors.textTertiary,
  },
  formSection: {
    gap: 16,
  },
  loginButton: {
    marginTop: 8,
  },
  linkSection: {
    marginTop: 32,
    alignItems: 'center',
    gap: 12,
  },
  linkText: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
  },
  signupRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signupLink: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.primary,
  },
});
