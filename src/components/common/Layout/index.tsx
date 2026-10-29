/** 스크롤/키보드/안전 영역과 하단 고정 액션을 일관되게 배치한다. */
import React, { PropsWithChildren, ReactNode, Ref } from 'react';
import {
  View,
  ScrollView,
  ScrollViewInstance,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { metrics, spacing } from '@/constants/layout';
interface ScreenLayoutProps extends PropsWithChildren {
  header?: ReactNode;
  footer?: ReactNode;
  scroll?: boolean;
  scrollRef?: Ref<ScrollViewInstance>;
  contentStyle?: StyleProp<ViewStyle>;
}
export function ScreenLayout({
  header,
  footer,
  scroll = true,
  scrollRef,
  contentStyle,
  children,
}: ScreenLayoutProps) {
  return (
    <SafeAreaView
      style={styles.root}
      edges={footer ? ['top', 'left', 'right'] : ['top', 'bottom', 'left', 'right']}
    >
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {header}
        {scroll ? (
          <ScrollView
            ref={scrollRef}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={[styles.content, contentStyle]}
          >
            {children}
          </ScrollView>
        ) : (
          <View style={[styles.content, styles.flex, contentStyle]}>{children}</View>
        )}
      </KeyboardAvoidingView>
      {footer}
    </SafeAreaView>
  );
}
export function BottomActionBar({ children }: PropsWithChildren) {
  const { bottom } = useSafeAreaInsets();
  return (
    <View style={[styles.footer, { paddingBottom: Math.max(bottom, spacing.lg) }]}>
      <View style={styles.footerContent}>{children}</View>
    </View>
  );
}
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  content: {
    width: '100%',
    maxWidth: metrics.contentMax,
    alignSelf: 'center',
    padding: spacing.page,
    gap: spacing.xxl,
  },
  footer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  footerContent: { width: '100%', maxWidth: metrics.contentMax, alignSelf: 'center' },
});
