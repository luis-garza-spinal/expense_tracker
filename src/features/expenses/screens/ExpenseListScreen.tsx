import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, FAB, Snackbar } from 'react-native-paper';
import { useAuth } from '../../../app/providers/AuthProvider';
import { createExpenseService } from '../services/expenseService';
import { ExpenseItem } from '../components/ExpenseItem';
import { Expense } from '../types/expense';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { useAppGlobalStore } from '../../../shared/stores/useAppGlobalStore';

const expenseService = createExpenseService();

interface ExpenseListScreenProps {
  onNavigateToAdd: () => void;
}

export function ExpenseListScreen({ onNavigateToAdd }: ExpenseListScreenProps) {
  const { user } = useAuth();
  const { setRefetchData, refetchData } = useAppGlobalStore()
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState('');

  const fetchExpenses = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const result = await expenseService.getExpenses(user.id);
    if (result.ok) {
      setExpenses(result.data);
    } else {
      setSnackbar('Failed to load expenses.');
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses, refetchData]);

  const deleteExpense = async (expenseId: string) => {
    if (!user?.id) return;
    setLoading(true);
    const result = await expenseService.deleteExpenseById(user.id, expenseId)

    if (result.ok) {
      setRefetchData();
    } else {
      setSnackbar('Failed deleting expense');
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={expenses}
        keyExtractor={(item: Expense) => item.id}
        renderItem={({ item }: { item: Expense }) => <ExpenseItem expense={item} deleteExpense={deleteExpense} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          !loading ? (
            <Text style={styles.empty} testID="empty-state">
              No expenses yet. Tap + to add one.
            </Text>
          ) : null
        }
        refreshing={loading}
        onRefresh={fetchExpenses}
      />
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={onNavigateToAdd}
        testID="add-expense-fab"
      />
      <Snackbar visible={!!snackbar} onDismiss={() => setSnackbar('')} duration={3000}>
        {snackbar}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg
  },
  list: {
    paddingVertical: spacing.md,
  },
  empty: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginTop: spacing.xxl,
  },
  fab: {
    position: 'absolute',
    right: spacing.md,
    bottom: spacing.md,
    backgroundColor: colors.primary,
  },
});
