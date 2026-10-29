/** 플랫폼 Modal의 포커스 관리 위에 닫기 배경과 공통 표면을 조합한다. */
import React, { PropsWithChildren } from 'react';
import { Modal, View, Pressable, ScrollView, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { spacing, radius, metrics, shadows } from '@/constants/layout';
interface ModalSurfaceProps extends PropsWithChildren {
  visible: boolean;
  onClose: () => void;
  placement?: 'center' | 'topRight';
  contentStyle?: StyleProp<ViewStyle>;
  dim?: boolean;
}
export function ModalSurface({
  visible,
  onClose,
  placement = 'center',
  contentStyle,
  dim = true,
  children,
}: ModalSurfaceProps) {
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
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
        ]}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="팝업 닫기"
          onPress={onClose}
          style={StyleSheet.absoluteFill}
        />
        <View
          accessibilityViewIsModal
          style={[styles.surface, placement === 'topRight' && styles.menu, contentStyle]}
        >
          <ScrollView bounces={false} keyboardShouldPersistTaps="handled">
            {children}
          </ScrollView>
        </View>
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
