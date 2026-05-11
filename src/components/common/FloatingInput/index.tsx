/**
 * 공통 FloatingInput 컴포넌트
 *
 * @param label - 입력 필드 이름 (floating label로 표시)
 * @param error - 에러 메시지 (존재 시 border / label 색상 변경 + 하단 표시)
 * @param suffix - 입력값 뒤에 표시되는 단위 (예: 원, kg 등)
 * @param value - 현재 입력값
 * @param onChangeText - 입력값 변경 핸들러
 *
 * 동작:
 * - focus 상태이거나 value가 존재하면 label이 위로 이동
 * - blur 상태이고 value가 없으면 label이 중앙으로 복귀
 *
 * 특징:
 * - Pressable로 input 영역 전체 클릭 시 focus 가능
 * - Animated API로 label 위치 애니메이션 처리
 * - TextInputProps 상속으로 기본 input 속성 그대로 사용 가능
 */

import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  TextInput,
  TextInputProps,
  StyleSheet,
  Text,
  Animated,
  Pressable,
} from 'react-native';
import { colors } from '@/constants/colors';
import { fontSize, fontWeight } from '@/constants/typography';

interface FloatingInputProps extends TextInputProps {
  label?: string;
  error?: string;
  suffix?: string;
}

export function FloatingInput({
  label,
  error,
  suffix,
  style,
  value,
  onChangeText,
  ...rest
}: FloatingInputProps) {
  const inputRef = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);

  // 포커스 중이거나 입력값이 있으면 라벨을 위로 올린 상태 유지
  const isFloated = isFocused || !!value;

  const animValue = useRef(new Animated.Value(isFloated ? 1 : 0)).current;

  // 애니메이션 실행
  useEffect(() => {
    Animated.timing(animValue, {
      toValue: isFloated ? 1 : 0,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }, [isFloated, animValue]);

  // 위치 변환
  const translateY = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -13],
  });

  const labelColor = error ? colors.error : isFocused ? colors.primary : colors.textDisabled;
  const borderColor = error ? colors.error : isFocused ? colors.primary : colors.borderInput;
  const borderWidth = isFocused || !!error ? 2 : 1;

  return (
    <View>
      <Pressable onPress={() => inputRef.current?.focus()}>
        <View style={[styles.container, { borderColor, borderWidth }]}>
          {label && (
            <Animated.View
              style={[styles.labelWrapper, { transform: [{ translateY }], pointerEvents: 'none' }]}
            >
              <Animated.Text
                style={[styles.label, isFloated && styles.labelFloated, { color: labelColor }]}
                numberOfLines={1}
              >
                {label}
              </Animated.Text>
            </Animated.View>
          )}

          <TextInput
            ref={inputRef}
            style={[
              styles.input,
              label && isFloated && styles.inputWithLabel,
              suffix && styles.inputWithSuffix,
              style,
            ]}
            value={value}
            onChangeText={onChangeText}
            placeholderTextColor="transparent"
            onFocus={(e) => {
              setIsFocused(true);
              rest.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              rest.onBlur?.(e);
            }}
            {...rest}
          />

          {suffix && <Text style={styles.suffix}>{suffix}</Text>}
        </View>
      </Pressable>

      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.borderInput,
    justifyContent: 'center',
  },
  labelWrapper: {
    ...StyleSheet.absoluteFillObject,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  label: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.regular,
  },
  labelFloated: {
    fontSize: fontSize.xs,
  },

  input: {
    fontSize: fontSize.base,
    color: colors.textPrimary,
    padding: 0,
  },
  inputWithLabel: {
    paddingTop: 16,
  },

  inputWithSuffix: {
    paddingRight: 32,
  },

  suffix: {
    position: 'absolute',
    right: 16,
    bottom: 12,
    fontSize: fontSize.base,
    color: colors.textTertiary,
  },

  errorText: {
    marginTop: 4,
    fontSize: fontSize.xs,
    color: colors.error,
  },
});
