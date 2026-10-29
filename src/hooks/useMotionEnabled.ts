/** 백그라운드와 모션 감소 설정에서는 반복 애니메이션을 멈춘다. */
import { useEffect, useState } from 'react';
import { AccessibilityInfo, AppState } from 'react-native';
export function useMotionEnabled() {
  const [reduceMotion, setReduceMotion] = useState(true);
  const [active, setActive] = useState(AppState.currentState !== 'background');
  useEffect(() => {
    let cancelled = false;
    let receivedChange = false;
    const motion = AccessibilityInfo.addEventListener('reduceMotionChanged', (value) => {
      receivedChange = true;
      setReduceMotion(value);
    });
    AccessibilityInfo.isReduceMotionEnabled()
      .then((value) => {
        if (!cancelled && !receivedChange) setReduceMotion(value);
      })
      .catch(() => {});
    const app = AppState.addEventListener('change', (state) => setActive(state === 'active'));
    return () => {
      cancelled = true;
      motion.remove();
      app.remove();
    };
  }, []);
  return !reduceMotion && active;
}
