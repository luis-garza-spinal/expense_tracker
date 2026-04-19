import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';

interface BalanceCardProps {
  balance: number;
  loading?: boolean;
}

export function BalanceCard({ balance, loading }: BalanceCardProps) {
  return (
    <Card style={styles.card} testID="balance-card">
      <Card.Content style={styles.content}>
        <Text variant="titleMedium" style={styles.label}>
          Current Balance
        </Text>
        <Text variant="displaySmall" style={styles.amount} testID="balance-amount">
          {loading ? '...' : `$${balance.toFixed(2)}`}
        </Text>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.md,
    marginVertical: spacing.md,
    backgroundColor: colors.primaryLight,
    borderRadius: 16,
  },
  content: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  label: {
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  amount: {
    color: colors.text,
    fontWeight: '700',
  },
});
