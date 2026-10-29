/** 앱 실행마다 한 번 표시하는 브랜드 화면. 백그라운드 복귀에는 재생하지 않는다. */
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import { Button } from '@/components/common/Button';
import { Text } from '@/components/common/Text';
import { hideNativeSplash } from '@/app/startup/nativeSplash';
import { authLayout, brandImages } from '@/constants/auth';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/layout';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const frameWidth = Math.min(width, authLayout.contentMax);
  const illustrationSize = frameWidth * 0.86;
  const illustrationTop = height * 0.47;
  const illustrationRight = -frameWidth * 0.18;
  const [imageReady, setImageReady] = useState(false);
  const [layoutReady, setLayoutReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (failed) {
      void hideNativeSplash();
      return;
    }
    if (!imageReady || !layoutReady) return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    // 네이티브 화면 뒤에 가려진 로딩 시간은 최소 표시 시간에 포함하지 않는다.
    void hideNativeSplash().then(() => {
      if (!cancelled) timer = setTimeout(onComplete, authLayout.splashMinimumMs);
    });
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [failed, imageReady, layoutReady, onComplete]);

  return (
    <View style={styles.root} aria-busy={!imageReady} onLayout={() => setLayoutReady(true)}>
      <View style={[styles.frame, { width: frameWidth }]}>
        <View
          style={[styles.copy, { paddingTop: Math.max(insets.top + spacing.huge, height * 0.175) }]}
        >
          <Text variant="splashHeadline">{'공공데이터 기반\n소비 플래너,'}</Text>
          <Text variant="splashWordmark" style={styles.wordmark}>
            planus
          </Text>
        </View>
        <Svg
          accessible={false}
          pointerEvents="none"
          width={illustrationSize * 1.5}
          height={illustrationSize * 1.65}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={[
            styles.glow,
            {
              top: illustrationTop - illustrationSize * 0.25,
              right: illustrationRight - illustrationSize * 0.25,
            },
          ]}
        >
          <Defs>
            <RadialGradient id="splash-logo-glow" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor={colors.primary} stopOpacity={0.14} />
              <Stop offset="45%" stopColor={colors.primary} stopOpacity={0.09} />
              <Stop offset="75%" stopColor={colors.primary} stopOpacity={0.035} />
              <Stop offset="100%" stopColor={colors.primary} stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Rect width="100" height="100" fill="url(#splash-logo-glow)" />
        </Svg>
        <Image
          key={attempt}
          source={brandImages.logo}
          accessible={false}
          resizeMode="contain"
          onLoad={() => setImageReady(true)}
          onError={() => setFailed(true)}
          style={[
            styles.illustration,
            {
              width: illustrationSize,
              height: illustrationSize,
              right: illustrationRight,
              top: illustrationTop,
            },
          ]}
        />
        {failed && (
          <View style={[styles.retry, { paddingBottom: insets.bottom + spacing.xxl }]}>
            <Text style={styles.error}>이미지를 불러오지 못했어요.</Text>
            <Button
              label="다시 시도"
              variant="secondary"
              onPress={() => {
                setImageReady(false);
                setFailed(false);
                setAttempt((value) => value + 1);
              }}
            />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background, alignItems: 'center' },
  frame: { flex: 1, overflow: 'hidden' },
  copy: { paddingHorizontal: spacing.section, gap: spacing.xxs, zIndex: 1 },
  wordmark: { color: colors.primary },
  glow: { position: 'absolute' },
  illustration: { position: 'absolute', transform: [{ rotate: '-8deg' }] },
  retry: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.xxl,
    gap: spacing.md,
    backgroundColor: colors.background,
  },
  error: { color: colors.error, textAlign: 'center' },
});
