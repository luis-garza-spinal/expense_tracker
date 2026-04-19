import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { ReportSummary } from '../types/report';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';

interface SummaryCardProps {
  report: ReportSummary;
}

export function SummaryCard({ report }: SummaryCardProps) {
  return (
    <Card style={styles.card} testID="summary-card">
      <Card.Content>
        <Text variant="bodySmall" style={styles.period}>
          {report.startDate} — {report.endDate}
        </Text>
        <Text variant="headlineMedium" style={styles.total} testID="total-expenses">
          ${report.totalExpenses.toFixed(2)}
        </Text>
        <Text variant="bodySmall" style={styles.label}>
          Total Expenses
        </Text>
        <Text variant="bodySmall" style={styles.count}>
          {report.expenses.length} transaction{report.expenses.length !== 1 ? 's' : ''}
        </Text>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
    backgroundColor: colors.surface,
  },
  period: {
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  total: {
    color: colors.primaryDark,
    fontWeight: '700',
  },
  label: {
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  count: {
    color: colors.textLight,
  },
});
