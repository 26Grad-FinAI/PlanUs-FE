/** 인증 스택과 분리해 로그아웃이나 화면 이동이 스플래시를 재실행하지 않게 한다. */
import React, { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { SplashScreen } from '@/screens/auth/SplashScreen';
import { useAuthStore } from '@/store/useAuthStore';

export function StartupGate({ children }: PropsWithChildren) {
  const [started, setStarted] = useState(false);
  const [sessionReady, setSessionReady] = useState(() => useAuthStore.persist.hasHydrated());
  const complete = useCallback(() => setStarted(true), []);

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

  return started && sessionReady ? children : <SplashScreen onComplete={complete} />;
}
