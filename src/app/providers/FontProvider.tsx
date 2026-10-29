/** 폰트가 준비된 뒤 앱을 표시하고 다운로드 실패는 재시도할 수 있게 한다. */
import React, { PropsWithChildren, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFonts } from 'expo-font';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/layout';

const fonts = {
  'Pretendard-Regular': require('../../../assets/fonts/Pretendard-Regular.ttf'),
  'Pretendard-Medium': require('../../../assets/fonts/Pretendard-Medium.ttf'),
  'Pretendard-SemiBold': require('../../../assets/fonts/Pretendard-SemiBold.ttf'),
  'Pretendard-Bold': require('../../../assets/fonts/Pretendard-Bold.ttf'),
};

export function FontProvider({ children }: PropsWithChildren) {
  const [attempt, setAttempt] = useState(0);
  return (
    <FontAttempt key={attempt} onRetry={() => setAttempt((value) => value + 1)}>
      {children}
    </FontAttempt>
  );
}
function FontAttempt({ children, onRetry }: PropsWithChildren<{ onRetry: () => void }>) {
  const [loaded, error] = useFonts(fonts);
  if (loaded) return <>{children}</>;
  return (
    <View style={styles.center}>
      {error ? (
        <>
          <Text style={styles.message}>글꼴을 불러오지 못했어요.</Text>
          <Pressable accessibilityRole="button" onPress={onRetry} style={styles.retry}>
            <Text style={styles.action}>다시 시도</Text>
          </Pressable>
        </>
      ) : (
        <ActivityIndicator accessibilityLabel="글꼴 불러오는 중" color={colors.primary} />
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    gap: spacing.lg,
  },
  message: { color: colors.textPrimary },
  retry: { padding: spacing.lg },
  action: { color: colors.primaryDark },
});
