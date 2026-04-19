import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, HelperText } from 'react-native-paper';
import { spacing } from '../../../shared/theme/spacing';

interface AddBalanceFormProps {
  onSubmit: (amount: number) => Promise<void>;
  loading?: boolean;
}

export function AddBalanceForm({ onSubmit, loading }: AddBalanceFormProps) {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');
    const parsed = parseFloat(amount);

    if (!amount.trim() || isNaN(parsed)) {
      setError('Please enter a valid number.');
      return;
    }
    if (parsed <= 0) {
      setError('Amount must be greater than zero.');
      return;
    }

    await onSubmit(parsed);
    setAmount('');
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
        testID="balance-amount-input"
        left={<TextInput.Affix text="$" />}
      />

      {error ? (
        <HelperText type="error" visible testID="balance-error">
          {error}
        </HelperText>
      ) : null}

      <Button
        mode="contained"
        onPress={handleSubmit}
        loading={loading}
        disabled={loading}
        style={styles.button}
        testID="add-balance-button"
      >
        Add Balance
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
  },
  input: {
    marginBottom: spacing.sm,
  },
  button: {
    marginTop: spacing.sm,
  },
});
