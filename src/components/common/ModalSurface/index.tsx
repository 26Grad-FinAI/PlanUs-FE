/** 플랫폼 Modal의 포커스 관리 위에 닫기 배경과 공통 표면을 조합한다. */
import React, { PropsWithChildren, useEffect, useState } from 'react';
import {
  Animated,
  Easing,
  Modal,
  Platform,
  View,
  Pressable,
  ScrollView,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { spacing, radius, metrics, shadows } from '@/constants/layout';
interface ModalSurfaceProps extends PropsWithChildren {
  visible: boolean;
  onClose: () => void;
  placement?: 'center' | 'topRight';
  contentStyle?: StyleProp<ViewStyle>;
  dim?: boolean;
  animationType?: 'none' | 'fade' | 'slide';
  overlayStyle?: StyleProp<ViewStyle>;
  slideFromTop?: boolean;
}
export function ModalSurface({
  visible,
  onClose,
  placement = 'center',
  contentStyle,
  dim = true,
  animationType = 'fade',
  overlayStyle,
  slideFromTop = false,
  children,
}: ModalSurfaceProps) {
  const insets = useSafeAreaInsets();
  const [translateY] = useState(() => new Animated.Value(-spacing.lg));
  useEffect(() => {
    // 배경이나 상세 화면은 흐려지지 않고 메뉴 표면만 위에서 제자리로 내려온다.
    translateY.setValue(-spacing.lg);
    if (!visible || !slideFromTop) return;
    const motion = Animated.timing(translateY, {
      toValue: 0,
      duration: 180,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: Platform.OS !== 'web',
    });
    motion.start();
    return () => motion.stop();
  }, [visible, slideFromTop, translateY]);
  return (
    <Modal visible={visible} transparent animationType={animationType} onRequestClose={onClose}>
      <View
        style={[
          styles.overlay,
          !dim && styles.clear,
          { paddingTop: insets.top + spacing.xl, paddingBottom: insets.bottom + spacing.xl },
          placement === 'topRight' && {
            justifyContent: 'flex-start',
            alignItems: 'flex-end',
            paddingTop: insets.top + metrics.header,
          },
          overlayStyle,
        ]}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="팝업 닫기"
          onPress={onClose}
          style={StyleSheet.absoluteFill}
        />
        <Animated.View
          accessibilityViewIsModal
          style={[
            styles.surface,
            placement === 'topRight' && styles.menu,
            contentStyle,
            slideFromTop && { transform: [{ translateY }] },
          ]}
        >
          <ScrollView bounces={false} keyboardShouldPersistTaps="handled">
            {children}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  clear: { backgroundColor: colors.transparent },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xxl,
    backgroundColor: colors.overlay,
  },
  surface: {
    width: '100%',
    maxWidth: metrics.modalMax,
    maxHeight: '100%',
    backgroundColor: colors.background,
    borderRadius: radius.large,
    overflow: 'hidden',
    ...shadows.menu,
  },
  menu: { maxWidth: 160, borderRadius: radius.button },
});
