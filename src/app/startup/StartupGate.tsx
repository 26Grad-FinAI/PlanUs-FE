/** 로그인 상태 복원을 마친 첫 화면이 준비되면 네이티브 시작 화면을 닫는다. */
import React, { PropsWithChildren, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { hideNativeSplash } from '@/app/startup/nativeSplash';
import { colors } from '@/constants/colors';
import { useAuthStore } from '@/store/useAuthStore';

export function StartupGate({ children }: PropsWithChildren) {
  const [sessionReady, setSessionReady] = useState(() => useAuthStore.persist.hasHydrated());

  useEffect(() => {
    let active = true;
    const finishRestoring = () => {
      if (active) setSessionReady(true);
    };
    void Promise.resolve(useAuthStore.persist.rehydrate()).then(finishRestoring, finishRestoring);
    return () => {
      active = false;
    };
  }, []);

  if (!sessionReady) {
    return (
      <View key="loading" style={styles.loading}>
        <ActivityIndicator accessibilityLabel="로그인 상태 불러오는 중" color={colors.primary} />
      </View>
    );
  }

  return (
    <View key="content" style={styles.content} onLayout={() => void hideNativeSplash()}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, backgroundColor: colors.background },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
});
