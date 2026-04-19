import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import { ReportPeriod } from '../types/report';
import { spacing } from '../../../shared/theme/spacing';
import { useDashboardFilters } from '../stores/useDashboardFilters';
import { colors } from '../../../shared/theme';

const PERIOD_OPTIONS = [
  { value: 'daily', label: 'Day', labelStyle: { color: 'white' } },
  { value: 'weekly', label: 'Week', labelStyle: { color: 'white' } },
  { value: 'bi-weekly', label: '2 Weeks', labelStyle: { color: 'white' } },
  { value: 'monthly', label: 'Month', labelStyle: { color: 'white' } },
];

export function PeriodSelector() {
  const { setPeriod, filters } = useDashboardFilters();

  const onChange = (value: string) => {
    setPeriod(value as ReportPeriod)
  }

  return (
    <View style={styles.container} testID="period-selector">
      <SegmentedButtons
      theme={{
        colors: {
          outline: '#FFF',
          color: '#FFF'
        }
      }}
        style={styles.buttons}
        value={filters.period}
        onValueChange={onChange}
        buttons={PERIOD_OPTIONS}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  buttons: {
    backgroundColor: colors.primary,
    color: '#FFFFFF',
    borderRadius: 10,
  }
});

