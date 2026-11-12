import { useCallback } from 'react';
import type { RefObject } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import type { FlatList, ScrollViewInstance } from 'react-native';

type ScrollTarget = Pick<ScrollViewInstance, 'scrollTo'> | Pick<FlatList, 'scrollToOffset'>;

export function useScrollToTopOnFocus(
  scrollRef: RefObject<ScrollTarget | null>,
  onReset?: () => void,
) {
  useFocusEffect(
    useCallback(() => {
      onReset?.();
      const target = scrollRef.current;
      if (!target) return;

      if ('scrollToOffset' in target) {
        target.scrollToOffset({ offset: 0, animated: false });
      } else {
        target.scrollTo({ y: 0, animated: false });
      }
    }, [scrollRef, onReset]),
  );
}
