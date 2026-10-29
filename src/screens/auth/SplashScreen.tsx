/** 앱 실행마다 한 번 표시하는 브랜드 화면. 백그라운드 복귀에는 재생하지 않는다. */
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/common/Button';
import { Text } from '@/components/common/Text';
import { hideNativeSplash } from '@/app/startup/nativeSplash';
import { authLayout, brandImages } from '@/constants/auth';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/layout';
import { fontSize } from '@/constants/typography';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const frameWidth = Math.min(width, authLayout.contentMax);
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
    <View style={styles.root} onLayout={() => setLayoutReady(true)}>
      <View style={[styles.frame, { width: frameWidth }]}>
        <View
          style={[styles.copy, { paddingTop: Math.max(insets.top + spacing.huge, height * 0.18) }]}
        >
          <Text weight="bold" style={styles.headline}>
            {'공공데이터 기반\n소비 플래너,'}
          </Text>
          <Text weight="bold" style={styles.wordmark}>
            planus
          </Text>
        </View>
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
              width: frameWidth * 1.1,
              height: frameWidth * 1.1,
              right: -frameWidth * 0.34,
              top: height * 0.45,
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
  copy: { paddingHorizontal: spacing.section, gap: spacing.sm, zIndex: 1 },
  headline: { fontSize: fontSize['4xl'], lineHeight: 50 },
  wordmark: { color: colors.primary, fontSize: fontSize['5xl'], lineHeight: 60 },
  illustration: { position: 'absolute' },
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
