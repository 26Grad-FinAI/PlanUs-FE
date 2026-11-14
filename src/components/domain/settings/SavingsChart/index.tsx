import React, { useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import type { ScrollViewInstance } from 'react-native';
import { Text } from '@/components/common/Text';
import { colors } from '@/constants/colors';
import { radius, spacing } from '@/constants/layout';
import type { MonthlySavingsRecord } from '@/services/api/savingsStatusApi';
import { formatFullAmount } from '@/utils/formatCurrency';

const chartHeight = 120;
const sixMonthMinWidth = 360;

export function SavingsChart({ records }: { records: MonthlySavingsRecord[] }) {
  const scrollRef = useRef<ScrollViewInstance>(null);
  const lastPositionedLayout = useRef('');
  const [viewportWidth, setViewportWidth] = useState(0);
  const visibleMonths = viewportWidth >= sixMonthMinWidth ? 6 : 5;
  const columnWidth = viewportWidth / Math.max(1, Math.min(records.length, visibleMonths));
  const contentWidth = columnWidth * records.length;
  const latestMonth = records.at(-1)?.yearMonth;
  const layoutKey = `${viewportWidth}/${contentWidth}/${latestMonth ?? ''}`;
  const savedMax = Math.max(0, ...records.map(({ savings }) => savings));
  const shortfallMax = Math.max(0, ...records.map(({ savings }) => -savings));
  const scale = chartHeight / (savedMax + shortfallMax || 1);
  const savedHeight = Math.max(2, savedMax + shortfallMax === 0 ? chartHeight : savedMax * scale);
  const shortfallHeight = Math.max(2, shortfallMax * scale);
  const spansYears = records[0]?.yearMonth.slice(0, 4) !== latestMonth?.slice(0, 4);

  function showLatestMonth(measuredWidth: number) {
    const scroll = scrollRef.current;
    if (!scroll || lastPositionedLayout.current === layoutKey) return;
    if (Math.abs(measuredWidth - contentWidth) > 1) return;

    lastPositionedLayout.current = layoutKey;
    scroll.scrollToEnd({ animated: false });
  }

  return (
    <View>
      <View
        style={styles.axis}
        onLayout={({ nativeEvent }) => setViewportWidth(nativeEvent.layout.width)}
      >
        {viewportWidth > 0 && (
          <ScrollView
            ref={scrollRef}
            horizontal
            scrollEnabled={records.length > visibleMonths}
            onContentSizeChange={showLatestMonth}
            contentContainerStyle={styles.columns}
          >
            {records.map(({ yearMonth, savings }) => {
              const [year, month] = yearMonth.split('-');
              const barHeight = Math.max(2, Math.abs(savings) * scale);

              return (
                <View
                  key={yearMonth}
                  accessible
                  accessibilityLabel={`${year}년 ${Number(month)}월 ${formatFullAmount(savings)}`}
                  style={[styles.column, { width: columnWidth }]}
                >
                  <View style={[styles.savedSpace, { height: savedHeight }]}>
                    {savings > 0 && (
                      <View style={[styles.savedBar, styles.savedColor, { height: barHeight }]} />
                    )}
                  </View>
                  <View style={[styles.shortfallSpace, { height: shortfallHeight }]}>
                    {savings < 0 && (
                      <View
                        style={[styles.shortfallBar, styles.shortfallColor, { height: barHeight }]}
                      />
                    )}
                  </View>
                  <Text variant="caption" style={styles.month}>
                    {spansYears ? `${year.slice(-2)}.${month}` : `${Number(month)}월`}
                  </Text>
                </View>
              );
            })}
          </ScrollView>
        )}
      </View>
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendMarker, styles.savedColor]} />
          <Text variant="caption" style={styles.month}>
            남김
          </Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendMarker, styles.shortfallColor]} />
          <Text variant="caption" style={styles.month}>
            부족
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  axis: { borderBottomWidth: 1, borderBottomColor: colors.border },
  columns: { paddingBottom: spacing.xs },
  column: { alignItems: 'center' },
  savedSpace: { justifyContent: 'flex-end' },
  shortfallSpace: { justifyContent: 'flex-start' },
  savedBar: {
    width: 24,
    borderTopLeftRadius: radius.input,
    borderTopRightRadius: radius.input,
  },
  shortfallBar: {
    width: 24,
    borderBottomLeftRadius: radius.input,
    borderBottomRightRadius: radius.input,
  },
  month: { color: colors.textTertiary, marginTop: spacing.xs },
  legend: { flexDirection: 'row', justifyContent: 'flex-end', gap: spacing.md },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  legendMarker: { width: 8, height: 8, borderRadius: 2, marginTop: spacing.xs },
  savedColor: { backgroundColor: colors.savingsChartSaved },
  shortfallColor: { backgroundColor: colors.savingsChartShortfall },
});
