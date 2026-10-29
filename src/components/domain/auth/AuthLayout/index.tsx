/** 인증 폼의 최대 너비·안전 영역·키보드 회피를 공통 레이아웃으로 구성한다. */
import React, { PropsWithChildren } from 'react';
import { StyleSheet } from 'react-native';
import { ScreenLayout } from '@/components/common/Layout';
import { authLayout } from '@/constants/auth';
import { spacing } from '@/constants/layout';

export function AuthLayout({ children }: PropsWithChildren) {
  return <ScreenLayout contentStyle={styles.content}>{children}</ScreenLayout>;
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    maxWidth: authLayout.contentMax,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.section,
    gap: 0,
  },
});
