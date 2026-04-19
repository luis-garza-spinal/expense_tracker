// import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { CategoryBreakdown } from '../types/report';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';

interface CategoryChartProps {
  breakdown: CategoryBreakdown[];
}

const BAR_COLORS = [
  colors.primary,
  colors.secondary,
  colors.warning,
  colors.success,
  colors.error,
  colors.primaryLight,
  colors.secondaryLight,
];

export function CategoryChart({ breakdown }: CategoryChartProps) {
  if (breakdown.length === 0) return null;

  return (
    <Card style={styles.card} testID="category-chart">
      <Card.Content>
        <Text variant="titleMedium" style={styles.title}>
          By Category
        </Text>
        {breakdown.map((item, index) => (
          <View key={item.category} style={styles.row} testID={`category-row-${item.category}`}>
            <View style={styles.labelRow}>
              <Text variant="bodyMedium" style={styles.category}>
                {item.category}
              </Text>
              <Text variant="bodySmall" style={styles.amount}>
                ${item.total.toFixed(2)} ({item.percentage.toFixed(1)}%)
              </Text>
            </View>
            <View style={styles.barBackground}>
              <View
                style={[
                  styles.barFill,
                  {
                    width: `${Math.min(item.percentage, 100)}%`,
                    backgroundColor: BAR_COLORS[index % BAR_COLORS.length],
                  },
                ]}
              />
            </View>
          </View>
        ))}
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
  title: {
    marginBottom: spacing.sm,
    fontWeight: '600',
  },
  row: {
    marginBottom: spacing.sm,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  category: {
    color: colors.text,
  },
  amount: {
    color: colors.textSecondary,
  },
  barBackground: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.surfaceVariant,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
});
