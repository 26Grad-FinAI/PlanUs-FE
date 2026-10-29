/** 날짜 선택은 임시 값으로 편집하고 확인할 때만 부모에 반영한다. */
import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Text } from '@/components/common/Text';
import { FormField, FieldProps } from '@/components/common/FormField';
import { ModalSurface } from '@/components/common/ModalSurface';
import { Button } from '@/components/common/Button';
import { colors } from '@/constants/colors';
import { fontFamily } from '@/constants/typography';
import { spacing, radius, metrics } from '@/constants/layout';
import { toISODate } from '@/utils/formatDate';
LocaleConfig.locales.ko = {
  monthNames: Array.from({ length: 12 }, (_, index) => `${index + 1}월`),
  monthNamesShort: Array.from({ length: 12 }, (_, index) => `${index + 1}월`),
  dayNames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  today: '오늘',
};
LocaleConfig.defaultLocale = 'ko';
interface DateFieldProps extends FieldProps {
  value: Date;
  onChange: (date: Date) => void;
  disabled?: boolean;
}
export function DateField({
  value,
  onChange,
  disabled,
  label = '날짜',
  required,
  hint,
  error,
}: DateFieldProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value);
  const valid = Number.isFinite(value.getTime());
  const display = valid
    ? `${value.getFullYear()}년 ${String(value.getMonth() + 1).padStart(2, '0')}월 ${String(value.getDate()).padStart(2, '0')}일`
    : '날짜를 선택하세요';
  return (
    <>
      <FormField label={label} required={required} hint={hint} error={error}>
        <TouchableOpacity
          accessibilityRole="button"
          aria-expanded={open}
          aria-disabled={!!disabled}
          accessibilityLabel={`${label}: ${display}`}
          accessibilityState={{ disabled: !!disabled, expanded: open }}
          disabled={disabled}
          onPress={() => {
            setDraft(valid ? new Date(value) : new Date());
            setOpen(true);
          }}
          style={[styles.field, error && styles.error, disabled && styles.disabled]}
        >
          <Text style={styles.date}>{display}</Text>
          <Ionicons
            accessible={false}
            aria-hidden={true}
            name="calendar-outline"
            size={metrics.icon}
            color={colors.textTertiary}
          />
        </TouchableOpacity>
      </FormField>
      <ModalSurface visible={open} onClose={() => setOpen(false)}>
        <View style={styles.content}>
          <Text variant="section">날짜 선택</Text>
          <Calendar
            current={toISODate(draft)}
            monthFormat="yyyy년 M월"
            onDayPress={({ year, month, day }) => setDraft(new Date(year, month - 1, day))}
            markedDates={{
              [toISODate(draft)]: {
                selected: true,
                selectedColor: colors.primary,
                selectedTextColor: colors.background,
              },
            }}
            theme={{
              calendarBackground: colors.background,
              dayTextColor: colors.textPrimary,
              todayTextColor: colors.primaryDark,
              arrowColor: colors.primaryDark,
              textDisabledColor: colors.textDisabled,
              textDayFontFamily: fontFamily.regular,
              textMonthFontFamily: fontFamily.semibold,
              textDayHeaderFontFamily: fontFamily.medium,
              textDayFontWeight: 'normal',
              textMonthFontWeight: 'normal',
            }}
          />
          <View style={styles.buttons}>
            <Button
              label="취소"
              variant="secondary"
              size="md"
              onPress={() => setOpen(false)}
              style={styles.half}
            />
            <Button
              label="확인"
              size="md"
              onPress={() => {
                onChange(draft);
                setOpen(false);
              }}
              style={styles.half}
            />
          </View>
        </View>
      </ModalSurface>
    </>
  );
}
const styles = StyleSheet.create({
  field: {
    minHeight: metrics.input,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderInput,
    borderRadius: radius.input,
  },
  date: { flex: 1 },
  error: { borderColor: colors.error },
  disabled: { opacity: 0.5 },
  content: { padding: spacing.lg, gap: spacing.lg },
  buttons: { flexDirection: 'row', gap: spacing.sm },
  half: { flex: 1 },
});
