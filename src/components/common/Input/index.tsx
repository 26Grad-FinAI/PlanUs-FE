/**
 * 공통 Input 컴포넌트
 *
 * 상태별 테두리:
 * - 기본      : 회색 테두리 (borderInput)
 * - 포커스    : 파란 테두리 (primary)
 * - 에러      : 빨간 테두리 (error) - 포커스보다 우선
 *
 * 하단 텍스트:
 * - hint  : 안내 텍스트 — error가 없을 때만 표시
 * - error : 에러 메시지 — hint보다 우선
 *
 * @param label         - 인풋 상단 라벨
 * @param required      - true면 라벨 옆에 * 표시
 * @param error         - 에러 메시지
 * @param hint          - 안내 텍스트
 * @param suffix        - 인풋 우측 단위 텍스트 (예: "원", "%")
 * @param suffixStyle   - suffix 텍스트에 추가 스타일 적용
 * @param containerStyle - 컨테이너(테두리 박스)에 추가 스타일 적용
 */

import React, { useState } from 'react';
import {
  View,
  TextInput,
  TextInputProps,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { colors } from '@/constants/colors';
import { fontSize, fontWeight } from '@/constants/typography';

interface InputProps extends TextInputProps {
  label?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  suffix?: string;
  suffixStyle?: StyleProp<TextStyle>;
  containerStyle?: ViewStyle;
}

export function Input({
  label,
  required,
  error,
  hint,
  suffix,
  suffixStyle,
  style,
  containerStyle,
  onFocus: externalOnFocus,
  onBlur: externalOnBlur,
  ...rest
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const borderColor = error ? colors.error : isFocused ? colors.primary : colors.borderInput;

  return (
    <View>
      {label && (
        <View style={styles.labelRow}>
          <Text style={styles.label}>{label}</Text>
          {required && <Text style={styles.required}> *</Text>}
        </View>
      )}

      <View style={[styles.container, { borderColor }, containerStyle]}>
        <TextInput
          style={[styles.input, suffix ? styles.inputWithSuffix : undefined, style]}
          placeholderTextColor={colors.textDisabled}
          onFocus={(e) => {
            setIsFocused(true);
            externalOnFocus?.(e); // 외부에서 onFocus를 넘겼을 때 같이 실행
          }}
          onBlur={(e) => {
            setIsFocused(false);
            externalOnBlur?.(e); // 외부에서 onBlur를 넘겼을 때 같이 실행
          }}
          {...rest}
        />
        {suffix && <Text style={[styles.suffix, suffixStyle]}>{suffix}</Text>}
      </View>

      {!!hint && !error && <Text style={styles.hint}>{hint}</Text>}
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  labelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.textSecondary,
  },
  required: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.error,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.borderInput,
  },
  input: {
    flex: 1,
    fontSize: fontSize.base,
    color: colors.textPrimary,
    padding: 0,
  },
  inputWithSuffix: {
    textAlign: 'right',
    paddingRight: 8,
  },
  suffix: {
    fontSize: fontSize.base,
    color: colors.textTertiary,
  },

  hint: { marginTop: 4, fontSize: fontSize.xs, color: colors.textTertiary },
  errorText: { marginTop: 4, fontSize: fontSize.xs, color: colors.error },
});
