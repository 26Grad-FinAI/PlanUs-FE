/** 가입 폼과 중복 계정 모달을 Mock 인증 흐름에 연결한다. */
import React, { useEffect, useRef, useState } from 'react';
import { Keyboard, Pressable, StyleSheet, TextInputInstance, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@/app/navigation/types';
import { Button } from '@/components/common/Button';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { Input } from '@/components/common/Input';
import { Text } from '@/components/common/Text';
import { AuthLayout } from '@/components/domain/auth/AuthLayout';
import { authCopy } from '@/constants/auth';
import { colors } from '@/constants/colors';
import { metrics, spacing } from '@/constants/layout';
import { fontSize } from '@/constants/typography';
import { signup } from '@/services/api/authApi';
import { useAuthStore } from '@/store/useAuthStore';
import { AuthError, SignupParams } from '@/types/auth';
import {
  validateNickname,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from '@/utils/validation';

type SignupScreenProps = NativeStackScreenProps<AuthStackParamList, 'Signup'>;
type SignupField = keyof SignupParams;

export function SignupScreen({ navigation }: SignupScreenProps) {
  const signIn = useAuthStore((state) => state.signIn);
  const [values, setValues] = useState<SignupParams>({
    nickname: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [touched, setTouched] = useState<Partial<Record<SignupField, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [requestError, setRequestError] = useState('');
  const [duplicateEmail, setDuplicateEmail] = useState('');
  const [duplicateVisible, setDuplicateVisible] = useState(false);
  const pending = useRef(false);
  const active = useRef(true);
  const nicknameRef = useRef<TextInputInstance>(null);
  const emailRef = useRef<TextInputInstance>(null);
  const passwordRef = useRef<TextInputInstance>(null);
  const confirmRef = useRef<TextInputInstance>(null);
  const validation = {
    nickname: validateNickname(values.nickname),
    email: validateEmail(values.email),
    password: validatePassword(values.password, { maxLength: 16 }),
    confirmPassword: validateConfirmPassword(values.password, values.confirmPassword),
  };

  useEffect(() => {
    active.current = true;
    return () => {
      active.current = false;
    };
  }, []);

  function change(field: SignupField, text: string) {
    setValues((previous) => ({ ...previous, [field]: text }));
    setRequestError('');
  }

  function touch(field: SignupField) {
    setTouched((previous) => ({ ...previous, [field]: true }));
  }

  function errorFor(field: SignupField) {
    return submitted || touched[field] ? validation[field].message : '';
  }

  async function handleSignup() {
    if (pending.current) return;
    setSubmitted(true);
    const fields = [
      { name: 'nickname', ref: nicknameRef },
      { name: 'email', ref: emailRef },
      { name: 'password', ref: passwordRef },
      { name: 'confirmPassword', ref: confirmRef },
    ] as const;
    const invalid = fields.find((field) => !validation[field.name].isValid);
    if (invalid) {
      invalid.ref.current?.focus();
      return;
    }
    pending.current = true;
    setLoading(true);
    setRequestError('');
    try {
      const response = await signup({
        ...values,
        email: values.email.trim(),
        nickname: values.nickname.trim(),
      });
      if (active.current) signIn(response.profileCompleted);
    } catch (error: unknown) {
      if (!active.current) return;
      if (error instanceof AuthError && error.code === 'EMAIL_ALREADY_REGISTERED') {
        Keyboard.dismiss();
        setDuplicateEmail(values.email.trim());
        setDuplicateVisible(true);
      } else {
        setRequestError(error instanceof Error ? error.message : '잠시 후 다시 시도해주세요.');
      }
    } finally {
      pending.current = false;
      if (active.current) setLoading(false);
    }
  }

  return (
    <>
      <AuthLayout>
        <View style={styles.heading}>
          <Text weight="bold" accessibilityRole="header" style={styles.title}>
            회원가입
          </Text>
          <Text style={styles.introduction}>{authCopy.signupIntroduction}</Text>
        </View>
        <View style={styles.form}>
          <Input
            ref={nicknameRef}
            label="닉네임"
            value={values.nickname}
            onChangeText={(text) => change('nickname', text)}
            onBlur={() => touch('nickname')}
            placeholder="사용할 닉네임을 입력해주세요"
            error={errorFor('nickname')}
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="nickname"
            textContentType="nickname"
            maxLength={10}
            returnKeyType="next"
            submitBehavior="submit"
            onSubmitEditing={() => emailRef.current?.focus()}
            editable={!loading}
          />
          <Input
            ref={emailRef}
            label="이메일"
            value={values.email}
            onChangeText={(text) => change('email', text)}
            onBlur={() => touch('email')}
            placeholder="example@email.com"
            error={errorFor('email')}
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
            label="비밀번호"
            value={values.password}
            onChangeText={(text) => change('password', text)}
            onBlur={() => touch('password')}
            placeholder="8~16자로 입력해주세요"
            error={errorFor('password')}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="new-password"
            textContentType="newPassword"
            maxLength={16}
            returnKeyType="next"
            submitBehavior="submit"
            onSubmitEditing={() => confirmRef.current?.focus()}
            editable={!loading}
          />
          <Input
            ref={confirmRef}
            label="비밀번호 확인"
            value={values.confirmPassword}
            onChangeText={(text) => change('confirmPassword', text)}
            onBlur={() => touch('confirmPassword')}
            placeholder="비밀번호를 다시 입력해주세요"
            error={errorFor('confirmPassword')}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="new-password"
            textContentType="newPassword"
            maxLength={16}
            returnKeyType="done"
            onSubmitEditing={handleSignup}
            editable={!loading}
          />
          {!!requestError && (
            <Text variant="label" accessibilityRole="alert" style={styles.error}>
              {requestError}
            </Text>
          )}
          <Button
            label="가입하기"
            onPress={handleSignup}
            loading={loading}
            fullWidth
            style={styles.submit}
          />
        </View>
        <View style={styles.footer}>
          <Text variant="label" style={styles.footerText}>
            이미 계정이 있으신가요?
          </Text>
          <Pressable
            accessibilityRole="link"
            disabled={loading}
            onPress={() => navigation.popTo('Login')}
            style={styles.loginLink}
          >
            <Text variant="label" style={styles.linkText}>
              로그인
            </Text>
          </Pressable>
        </View>
      </AuthLayout>
      <ConfirmModal
        visible={duplicateVisible}
        title="이미 가입된 계정이에요"
        emphasis={duplicateEmail}
        description="로그인 화면으로 이동할까요?"
        cancelLabel="다른 이메일로 가입"
        confirmLabel="로그인하기"
        onCancel={() => setDuplicateVisible(false)}
        onConfirm={() => {
          setDuplicateVisible(false);
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login', params: { email: duplicateEmail } }],
          });
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  heading: { gap: spacing.sm, marginBottom: spacing.section },
  title: { fontSize: fontSize['3xl'], lineHeight: 40 },
  introduction: { color: colors.textTertiary },
  form: { gap: spacing.xl },
  submit: { marginTop: spacing.sm },
  error: { color: colors.error },
  footer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xxl,
  },
  footerText: { color: colors.textTertiary },
  loginLink: { minHeight: metrics.touch, paddingHorizontal: spacing.xs, justifyContent: 'center' },
  linkText: { color: colors.primaryDark, textDecorationLine: 'underline' },
});
