/**
 * 공통 TextArea 컴포넌트
 *
 * 회색 배경 + 테두리 없음 스타일의 멀티라인 입력 필드
 * 메모, 자유 입력 등 긴 텍스트를 입력받는 곳에 사용
 *
 * @param label     - 입력란 상단 라벨
 * @param minHeight - 입력 박스 최소 높이 (기본값 120)
 */

import React, { useState } from 'react';
import { View, TextInput, TextInputProps, StyleSheet, Text } from 'react-native';
import { colors } from '@/constants/colors';
import { fontSize, fontWeight } from '@/constants/typography';

interface TextAreaProps extends TextInputProps {
  label?: string;
  minHeight?: number;
}

export function TextArea({
  label,
  minHeight = 120,
  style,
  onFocus: externalOnFocus,
  onBlur: externalOnBlur,
  ...rest
}: TextAreaProps) {
  const [isFocused, setIsFocused] = useState(false);
  const borderColor = isFocused ? colors.border : 'transparent';

  return (
    <View>
      {label && <Text style={styles.label}>{label}</Text>}

      <TextInput
        multiline
        textAlignVertical="top"
        placeholderTextColor={colors.textDisabled}
        style={[styles.input, { minHeight, borderColor }, style]}
        onFocus={(e) => {
          setIsFocused(true);
          externalOnFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          externalOnBlur?.(e);
        }}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  input: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: fontSize.base,
    color: colors.textPrimary,
    backgroundColor: colors.backgroundAlt,
    borderWidth: 1,
  },
});
