/** 플로팅 입력과 테스트 계정의 Mock 로그인을 연결한다. */
import React, { useEffect, useRef, useState } from 'react';
import { Image, Pressable, StyleSheet, TextInputInstance, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@/app/navigation/types';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Text } from '@/components/common/Text';
import { AuthLayout } from '@/components/domain/auth/AuthLayout';
import { SocialLoginButtons } from '@/components/domain/auth/SocialLoginButtons';
import { authCopy, authLayout, brandImages } from '@/constants/auth';
import { colors } from '@/constants/colors';
import { metrics, spacing } from '@/constants/layout';
import { login } from '@/services/api/authApi';
import { useAuthStore } from '@/store/useAuthStore';
import { validateEmail } from '@/utils/validation';

type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function LoginScreen({ navigation, route }: LoginScreenProps) {
  const signIn = useAuthStore((state) => state.signIn);
  const [email, setEmail] = useState(route.params?.email ?? '');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [requestError, setRequestError] = useState('');
  const pending = useRef(false);
  const active = useRef(true);
  const emailRef = useRef<TextInputInstance>(null);
  const passwordRef = useRef<TextInputInstance>(null);
  const emailValidation = validateEmail(email);
  const emailError = submitted ? emailValidation.message : '';
  const passwordError = submitted && !password ? '비밀번호를 입력해주세요.' : '';

  useEffect(() => {
    active.current = true;
    return () => {
      active.current = false;
    };
  }, []);

  async function handleLogin() {
    if (pending.current) return;
    setSubmitted(true);
    if (!emailValidation.isValid || !password) {
      (!emailValidation.isValid ? emailRef : passwordRef).current?.focus();
      return;
    }
    pending.current = true;
    setLoading(true);
    setRequestError('');
    try {
      const response = await login({ email: email.trim(), password });
      if (active.current) signIn(response.profileCompleted);
    } catch (error: unknown) {
      if (active.current)
        setRequestError(error instanceof Error ? error.message : '잠시 후 다시 시도해주세요.');
    } finally {
      pending.current = false;
      if (active.current) setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <View style={styles.brand}>
        <Image
          source={brandImages.logo}
          accessible={false}
          resizeMode="contain"
          style={styles.logo}
        />
        <Text weight="bold" accessibilityRole="header" style={styles.wordmark}>
          planus
        </Text>
        <Text style={styles.introduction}>{authCopy.introduction}</Text>
      </View>
      <View style={styles.form}>
        <Input
          ref={emailRef}
          variant="floating"
          label="이메일"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setRequestError('');
          }}
          error={emailError}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
          textContentType="emailAddress"
          returnKeyType="next"
          submitBehavior="submit"
          onSubmitEditing={() => passwordRef.current?.focus()}
          editable={!loading}
        />
        <Input
          ref={passwordRef}
          variant="floating"
          label="비밀번호"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setRequestError('');
          }}
          error={passwordError}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="current-password"
          textContentType="password"
          returnKeyType="go"
          onSubmitEditing={handleLogin}
          editable={!loading}
        />
        {!!requestError && (
          <Text variant="label" accessibilityRole="alert" style={styles.error}>
            {requestError}
          </Text>
        )}
        <Button
          label="로그인"
          onPress={handleLogin}
          loading={loading}
          fullWidth
          style={styles.submit}
        />
      </View>
      <View style={styles.links}>
        <Pressable accessibilityRole="button" style={styles.link}>
          <Text variant="label" style={styles.linkText}>
            비밀번호 찾기
          </Text>
        </Pressable>
        <View style={styles.separator} />
        <Pressable
          accessibilityRole="button"
          style={styles.link}
          disabled={loading}
          onPress={() => navigation.navigate('Signup')}
        >
          <Text variant="label" style={styles.linkText}>
            회원가입
          </Text>
        </Pressable>
      </View>
      <SocialLoginButtons />
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  brand: { alignItems: 'center' },
  logo: { width: authLayout.logoSize, height: authLayout.logoSize, marginBottom: spacing.md },
  wordmark: { fontSize: authLayout.wordmarkSize, lineHeight: 44, letterSpacing: -1.5 },
  introduction: { color: colors.textTertiary, marginTop: spacing.sm, textAlign: 'center' },
  form: { marginTop: spacing.huge + spacing.sm, gap: spacing.lg },
  submit: { marginTop: spacing.sm },
  error: { color: colors.error },
  links: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  link: { minHeight: metrics.touch, justifyContent: 'center', paddingHorizontal: spacing.xs },
  linkText: { color: colors.textTertiary },
  separator: { width: metrics.hairline, height: spacing.md, backgroundColor: colors.border },
});
