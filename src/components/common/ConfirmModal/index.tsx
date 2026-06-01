/**
 * 공통 확인 모달 컴포넌트
 *
 * 아이콘 + 제목 + 설명 + 2개 버튼(취소 | 확인) 구조의 중앙 정렬 모달
 *
 * @param visible         - 모달 표시 여부
 * @param iconName        - Ionicons 아이콘 이름
 * @param iconColor       - 아이콘 색상 (기본: error)
 * @param iconBg          - 아이콘 원형 배경 색상 (기본: errorBg)
 * @param title           - 모달 제목
 * @param description     - 부가 설명 (선택)
 * @param cancelLabel     - 취소 버튼 라벨 (기본: "취소")
 * @param confirmLabel    - 확인 버튼 라벨
 * @param confirmVariant  - 확인 버튼 스타일 ("primary" | "destructive")
 * @param onCancel        - 취소/오버레이 탭 시 콜백
 * @param onConfirm       - 확인 버튼 탭 시 콜백
 */

import React from 'react';
import { View, Text, Modal, StyleSheet, Pressable, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import { fontSize, fontWeight } from '@/constants/typography';

type ConfirmVariant = 'primary' | 'destructive';

interface ConfirmModalProps {
  visible: boolean;
  iconName: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  iconBg?: string;
  title: string;
  description?: string;
  cancelLabel?: string;
  confirmLabel: string;
  confirmVariant?: ConfirmVariant;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmModal({
  visible,
  iconName,
  iconColor = colors.error,
  iconBg = colors.errorBg,
  title,
  description,
  cancelLabel = '취소',
  confirmLabel,
  confirmVariant = 'destructive',
  onCancel,
  onConfirm,
}: ConfirmModalProps) {
  const confirmTextColor = confirmVariant === 'destructive' ? colors.expense : colors.primary;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      {/* 반투명 오버레이 — 탭 시 모달 닫힘 */}
      <Pressable style={styles.overlay} onPress={onCancel}>
        {/* 카드 영역 — 이벤트 전파 차단 */}
        <Pressable style={styles.card} onPress={() => {}}>
          {/* 아이콘 원형 */}
          <View style={[styles.iconCircle, { backgroundColor: iconBg }]}>
            <Ionicons name={iconName} size={30} color={iconColor} />
          </View>

          <Text style={styles.title}>{title}</Text>
          {!!description && <Text style={styles.description}>{description}</Text>}

          {/* 버튼 구분선 */}
          <View style={styles.divider} />

          {/* 버튼 행 */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.buttonHalf} onPress={onCancel} activeOpacity={0.7}>
              <Text style={styles.cancelText}>{cancelLabel}</Text>
            </TouchableOpacity>

            {/* 버튼 간 세로 구분선 */}
            <View style={styles.buttonDivider} />

            <TouchableOpacity style={styles.buttonHalf} onPress={onConfirm} activeOpacity={0.7}>
              <Text style={[styles.confirmText, { color: confirmTextColor }]}>{confirmLabel}</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  card: {
    width: '100%',
    backgroundColor: colors.background,
    borderRadius: 20,
    alignItems: 'center',
    paddingTop: 32,
    overflow: 'hidden',
  },

  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },

  title: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
    paddingHorizontal: 24,
  },
  description: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 24,
    marginBottom: 28,
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
    alignSelf: 'stretch',
  },

  // 취소 | 확인 버튼 행
  buttonRow: {
    flexDirection: 'row',
    height: 52,
  },
  buttonHalf: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDivider: {
    width: 1,
    backgroundColor: colors.border,
  },

  cancelText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    color: colors.textTertiary,
  },
  confirmText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
  },
});
