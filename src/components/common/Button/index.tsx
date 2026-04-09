/**
 * 공통 Button 컴포넌트
 *
 * variant:
 * - primary     : 주요 액션 (로그인, 저장 등) — 파란 배경 + 흰 텍스트
 * - secondary   : 보조 액션 (취소, 뒤로가기 등) — 투명 배경 + 회색 테두리
 * - ghost       : 링크형 버튼 — 배경/테두리 없음 + 파란 텍스트
 * - destructive : 삭제/위험 액션 — 투명 배경 + 빨간 테두리 + 빨간 텍스트
 *
 * size:
 * - sm : height 36 / 인라인, 보조 버튼
 * - md : height 48 / 기본값, 일반 폼 버튼
 * - lg : height 56 / 하단 CTA 버튼
 *
 * @param label     - 버튼 텍스트
 * @param variant   - 버튼 스타일 종류
 * @param size      - 버튼 크기
 * @param loading   - true면 스피너 표시 + 클릭 비활성화
 * @param fullWidth - true면 부모 너비에 꽉 채움
 */

import React from "react";
import {
  TouchableOpacity,
  TouchableOpacityProps,
  StyleSheet,
  ActivityIndicator,
  Text,
  ViewStyle,
  TextStyle,
} from "react-native";
import { colors } from "../../../constants/colors";
import { fontSize, fontWeight } from "../../../constants/typography";

type Variant = "primary" | "secondary" | "ghost" | "destructive";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
}

export function Button({
  label,
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  disabled,
  style,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!isDisabled, busy: !!loading }}
      style={[
        styles.base,
        containerVariantMap[variant],
        containerSizeMap[size],
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === "primary" ? colors.background : colors.primary}
        />
      ) : (
        <Text
          style={[styles.label, labelVariantMap[variant], labelSizeMap[size]]}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  fullWidth: {
    alignSelf: "stretch",
  },
  disabled: {
    opacity: 0.5,
  },

  variant_primary: {
    backgroundColor: colors.primary,
  },
  variant_secondary: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: colors.borderInput,
  },
  variant_ghost: {
    backgroundColor: "transparent",
  },
  variant_destructive: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: colors.expense,
  },

  size_sm: { height: 36, paddingHorizontal: 12 },
  size_md: { height: 48, paddingHorizontal: 16 },
  size_lg: { height: 56, paddingHorizontal: 24 },

  label: {
    fontWeight: fontWeight.semibold,
  },
  labelVariant_primary: { color: colors.background },
  labelVariant_secondary: { color: colors.textSecondary },
  labelVariant_ghost: { color: colors.primary },
  labelVariant_destructive: { color: colors.expense },

  labelSize_sm: { fontSize: fontSize.sm },
  labelSize_md: { fontSize: fontSize.base },
  labelSize_lg: { fontSize: fontSize.lg },
});

const containerVariantMap: Record<Variant, ViewStyle> = {
  primary: styles.variant_primary,
  secondary: styles.variant_secondary,
  ghost: styles.variant_ghost,
  destructive: styles.variant_destructive,
};

const containerSizeMap: Record<Size, ViewStyle> = {
  sm: styles.size_sm,
  md: styles.size_md,
  lg: styles.size_lg,
};

const labelVariantMap: Record<Variant, TextStyle> = {
  primary: styles.labelVariant_primary,
  secondary: styles.labelVariant_secondary,
  ghost: styles.labelVariant_ghost,
  destructive: styles.labelVariant_destructive,
};

const labelSizeMap: Record<Size, TextStyle> = {
  sm: styles.labelSize_sm,
  md: styles.labelSize_md,
  lg: styles.labelSize_lg,
};
