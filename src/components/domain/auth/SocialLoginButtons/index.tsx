/** OAuth 연결 전에는 원형 PNG 버튼과 접근성 이름만 제공한다. */
import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Text } from '@/components/common/Text';
import { authLayout, brandImages } from '@/constants/auth';
import { colors } from '@/constants/colors';
import { spacing, radius } from '@/constants/layout';

export function SocialLoginButtons() {
  return (
    <View style={styles.section}>
      <View style={styles.divider}>
        <View style={styles.line} />
        <Text variant="label" style={styles.caption}>
          SNS 계정으로 로그인
        </Text>
        <View style={styles.line} />
      </View>
      <View style={styles.buttons}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="카카오로 로그인"
          style={styles.button}
        >
          <Image
            source={brandImages.kakaoLogin}
            accessible={false}
            resizeMode="contain"
            style={styles.image}
          />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Google로 로그인"
          style={styles.button}
        >
          <Image
            source={brandImages.googleLogin}
            accessible={false}
            resizeMode="contain"
            style={styles.image}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginTop: spacing.xxl, gap: spacing.xxl },
  divider: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  line: { flex: 1, height: 1, backgroundColor: colors.border },
  caption: { color: colors.textDisabled },
  buttons: { flexDirection: 'row', justifyContent: 'center', gap: spacing.lg },
  button: {
    width: authLayout.socialButtonSize,
    height: authLayout.socialButtonSize,
    borderRadius: radius.pill,
  },
  image: { width: '100%', height: '100%' },
});
