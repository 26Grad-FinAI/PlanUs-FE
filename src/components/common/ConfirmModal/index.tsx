/** 제목/강조문/설명과 하단 두 버튼으로 구성된 공통 확인 모달. */
import React from 'react';
import { View, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { fontFamily } from '@/constants/typography';
import { Text } from '@/components/common/Text';
import { ModalSurface } from '@/components/common/ModalSurface';
import { colors } from '@/constants/colors';
import { spacing, metrics } from '@/constants/layout';
interface ConfirmModalProps {
  visible: boolean;
  title: string;
  emphasis?: string;
  description?: string;
  cancelLabel?: string;
  confirmLabel: string;
  confirmVariant?: 'primary' | 'destructive';
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}
export function ConfirmModal({
  visible,
  title,
  emphasis,
  description,
  cancelLabel = '취소',
  confirmLabel,
  confirmVariant = 'primary',
  loading,
  onCancel,
  onConfirm,
}: ConfirmModalProps) {
  const color = confirmVariant === 'destructive' ? colors.error : colors.primaryDark;
  return (
    <ModalSurface visible={visible} onClose={onCancel} contentStyle={styles.surface}>
      <View style={styles.copy}>
        <Text variant="section" accessibilityRole="header" style={styles.center}>
          {title}
        </Text>
        {emphasis && <Text style={styles.emphasis}>{emphasis}</Text>}
        {description && <Text style={styles.description}>{description}</Text>}
      </View>
      <View style={styles.buttons}>
        <TouchableOpacity
          accessibilityRole="button"
          onPress={onCancel}
          style={[styles.button, styles.cancel]}
        >
          <Text style={styles.cancelText}>{cancelLabel}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={confirmLabel}
          aria-busy={!!loading}
          aria-disabled={!!loading}
          accessibilityState={{ disabled: !!loading, busy: !!loading }}
          disabled={loading}
          onPress={onConfirm}
          style={styles.button}
        >
          {loading ? (
            <ActivityIndicator color={color} />
          ) : (
            <Text style={[styles.confirmText, { color }]}>{confirmLabel}</Text>
          )}
        </TouchableOpacity>
      </View>
    </ModalSurface>
  );
}
const styles = StyleSheet.create({
  surface: { maxWidth: metrics.dialogWidth },
  copy: {
    alignItems: 'center',
    padding: spacing.xxl,
    paddingVertical: spacing.section,
    gap: spacing.sm,
  },
  center: { textAlign: 'center' },
  emphasis: { fontFamily: fontFamily.semibold, textAlign: 'center' },
  description: { color: colors.textTertiary, textAlign: 'center', lineHeight: 24 },
  buttons: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: colors.border },
  button: {
    flex: 1,
    minHeight: metrics.header,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  cancel: {
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  cancelText: { color: colors.textTertiary, textAlign: 'center' },
  confirmText: { fontFamily: fontFamily.semibold, textAlign: 'center' },
});
