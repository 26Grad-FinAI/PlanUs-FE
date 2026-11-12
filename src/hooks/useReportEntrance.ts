import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Animated, Easing, Platform } from 'react-native';
import type { LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

type ReportSection = 'summary' | 'categories' | 'budget' | 'budgetFill' | 'trend' | 'peers';

interface ReportEntranceOptions {
  month: Date;
  isFocused: boolean;
  motionEnabled: boolean;
  reportReady: boolean;
  peersReady: boolean;
}

export function useReportEntrance({
  month,
  isFocused,
  motionEnabled,
  reportReady,
  peersReady,
}: ReportEntranceOptions) {
  const enabled = isFocused && motionEnabled;
  const [progress] = useState(() => ({
    summary: new Animated.Value(0),
    categories: new Animated.Value(0),
    budget: new Animated.Value(0),
    budgetFill: new Animated.Value(0),
    trend: new Animated.Value(0),
    peers: new Animated.Value(0),
  }));
  const layouts = useRef(new Map<ReportSection, { y: number; height: number }>());
  const budgetLayout = useRef<{ y?: number; firstCardHeight?: number }>({});
  const played = useRef(new Set<ReportSection>());
  const viewport = useRef({ top: 0, height: 0 });
  const resetViewportOffset = useCallback(() => {
    viewport.current.top = 0;
  }, []);

  useLayoutEffect(() => {
    played.current.clear();
    for (const value of Object.values(progress)) value.setValue(0);
  }, [isFocused, month, progress]);

  const playVisibleSections = useCallback(() => {
    if (!enabled || !reportReady) return;
    const { top, height } = viewport.current;
    if (height <= 0) return;

    for (const [section, layout] of layouts.current) {
      if (played.current.has(section) || (section === 'peers' && !peersReady)) continue;

      const visibleHeight =
        Math.min(top + height, layout.y + layout.height) - Math.max(top, layout.y);
      const sectionThreshold =
        section === 'budgetFill'
          ? layout.height
          : Math.min(layout.height * 0.65, section === 'budget' ? 88 : 180);
      const requiredHeight = Math.min(sectionThreshold, height * 0.6);
      if (layout.height <= 0 || visibleHeight < requiredHeight) continue;

      played.current.add(section);
      Animated.timing(progress[section], {
        toValue: 1,
        duration: 520,
        easing: Easing.out(Easing.quad),
        useNativeDriver: Platform.OS !== 'web',
        isInteraction: false,
      }).start();
    }
  }, [enabled, reportReady, peersReady, progress]);

  useEffect(() => {
    if (!reportReady) {
      layouts.current.clear();
      budgetLayout.current = {};
    }
    playVisibleSections();
  }, [month, reportReady, playVisibleSections]);

  useEffect(() => {
    if (!enabled) return;

    const started = played.current;
    return () => {
      for (const section of started) {
        progress[section].stopAnimation();
        progress[section].setValue(1);
      }
    };
  }, [enabled, progress]);

  function onViewportLayout(event: LayoutChangeEvent) {
    viewport.current.height = event.nativeEvent.layout.height;
    playVisibleSections();
  }

  function onScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const { contentOffset, layoutMeasurement } = event.nativeEvent;
    viewport.current = { top: Math.max(0, contentOffset.y), height: layoutMeasurement.height };
    playVisibleSections();
  }

  function onSectionLayout(section: ReportSection, event: LayoutChangeEvent) {
    const { y, height } = event.nativeEvent.layout;
    layouts.current.set(section, { y, height });
    if (section === 'budget') updateBudgetFillLayout();
    playVisibleSections();
  }

  function updateBudgetFillLayout() {
    const section = layouts.current.get('budget');
    const { y, firstCardHeight } = budgetLayout.current;
    if (!section || y == null || firstCardHeight == null) return;

    // 첫 카드 하단까지 스크롤했을 때 막대 채우기 시작
    const height = Math.min(32, firstCardHeight);
    layouts.current.set('budgetFill', {
      y: section.y + y + firstCardHeight - height,
      height,
    });
  }

  function onBudgetContentLayout(event: LayoutChangeEvent) {
    budgetLayout.current.y = event.nativeEvent.layout.y;
    updateBudgetFillLayout();
    playVisibleSections();
  }

  function onBudgetSummaryLayout(event: LayoutChangeEvent) {
    budgetLayout.current.firstCardHeight = event.nativeEvent.layout.height;
    updateBudgetFillLayout();
    playVisibleSections();
  }

  return {
    progress: enabled ? progress : undefined,
    onViewportLayout,
    onScroll,
    onSectionLayout,
    onBudgetContentLayout,
    onBudgetSummaryLayout,
    resetViewportOffset,
  };
}
