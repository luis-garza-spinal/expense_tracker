import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Text, Snackbar } from 'react-native-paper';
import { useAuth } from '../../../app/providers/AuthProvider';
import { createExpenseService } from '../services/expenseService';
import { ExpenseForm } from '../components/ExpenseForm';
import { CreateExpenseInput } from '../types/expense';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { useAppGlobalStore } from '../../../shared/stores/useAppGlobalStore';

const expenseService = createExpenseService();

interface AddExpenseScreenProps {
  onSuccess: () => void;
}

export function AddExpenseScreen({ onSuccess }: AddExpenseScreenProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState('');
  const { setRefetchData } = useAppGlobalStore();
 
  const handleSubmit = async (input: CreateExpenseInput) => {
    if (!user) return;
    setLoading(true);
    const result = await expenseService.addExpense(user.id, input);
    setLoading(false);

    if (result.ok) {
      setSnackbar('Expense added!');
      setRefetchData();
      setTimeout(onSuccess, 500);
    } else {
      switch (result.error) {
        case 'INVALID_AMOUNT':
          setSnackbar('Invalid amount.');
          break;
        case 'MISSING_FIELDS':
          setSnackbar('Please fill in all required fields.');
          break;
        default:
          setSnackbar('Failed to add expense.');
      }
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text variant="headlineSmall" style={styles.heading}>
        Add Expense
      </Text>
      <ExpenseForm onSubmit={handleSubmit} loading={loading} />
      <Snackbar visible={!!snackbar} onDismiss={() => setSnackbar('')} duration={3000}>
        {snackbar}
      </Snackbar>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingVertical: spacing.lg,
  },
  heading: {
    textAlign: 'center',
    color: colors.text,
    marginBottom: spacing.md,
    fontWeight: '600',
  },
});
