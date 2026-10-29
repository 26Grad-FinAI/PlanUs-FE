/** 인증 스택과 분리해 로그아웃이나 화면 이동이 스플래시를 재실행하지 않게 한다. */
import React, { PropsWithChildren, useCallback, useState } from 'react';
import { SplashScreen } from '@/screens/auth/SplashScreen';

export function StartupGate({ children }: PropsWithChildren) {
  const [started, setStarted] = useState(false);
  const complete = useCallback(() => setStarted(true), []);
  return started ? children : <SplashScreen onComplete={complete} />;
}
