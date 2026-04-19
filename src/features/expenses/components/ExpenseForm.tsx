import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, HelperText } from 'react-native-paper';
import { CreateExpenseInput } from '../types/expense';
import { spacing } from '../../../shared/theme/spacing';

interface ExpenseFormProps {
  onSubmit: (input: CreateExpenseInput) => Promise<void>;
  loading?: boolean;
}

export function ExpenseForm({ onSubmit, loading }: ExpenseFormProps) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    const parsed = parseFloat(amount);

    if (!amount.trim() || isNaN(parsed)) {
      newErrors.amount = 'Please enter a valid number.';
    } else if (parsed <= 0) {
      newErrors.amount = 'Amount must be greater than zero.';
    }

    if (!category.trim()) {
      newErrors.category = 'Category is required.';
    }

    if (!date.trim()) {
      newErrors.date = 'Date is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    await onSubmit({
      amount: parseFloat(amount),
      category: category.trim(),
      date: date.trim(),
      description: description.trim() || undefined,
    });

    // Reset form
    setAmount('');
    setCategory('');
    setDate(new Date().toISOString().split('T')[0]);
    setDescription('');
    setErrors({});
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="decimal-pad"
        mode="outlined"
        style={styles.input}
        testID="expense-amount-input"
        left={<TextInput.Affix text="$" />}
        error={!!errors.amount}
      />
      {errors.amount ? (
        <HelperText type="error" visible testID="amount-error">
          {errors.amount}
        </HelperText>
      ) : null}

      <TextInput
        label="Category"
        value={category}
        onChangeText={setCategory}
        mode="outlined"
        style={styles.input}
        testID="expense-category-input"
        error={!!errors.category}
      />
      {errors.category ? (
        <HelperText type="error" visible testID="category-error">
          {errors.category}
        </HelperText>
      ) : null}

      <TextInput
        label="Date (YYYY-MM-DD)"
        value={date}
        onChangeText={setDate}
        mode="outlined"
        style={styles.input}
        testID="expense-date-input"
        error={!!errors.date}
      />
      {errors.date ? (
        <HelperText type="error" visible testID="date-error">
          {errors.date}
        </HelperText>
      ) : null}

      <TextInput
        label="Description (optional)"
        value={description}
        onChangeText={setDescription}
        mode="outlined"
        style={styles.input}
        testID="expense-description-input"
        multiline
      />

      <Button
        mode="contained"
        onPress={handleSubmit}
        loading={loading}
        disabled={loading}
        style={styles.button}
        testID="add-expense-button"
      >
        Add Expense
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
  },
  input: {
    marginBottom: spacing.xs,
  },
  button: {
    marginTop: spacing.md,
  },
});
