import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Snackbar, Text } from 'react-native-paper';
import { useAuth } from '../../../app/providers/AuthProvider';
import { createBalanceService } from '../services/balanceService';
import { BalanceCard } from '../components/BalanceCard';
import { AddBalanceForm } from '../components/AddBalanceForm';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';

const balanceService = createBalanceService();

export function BalanceScreen() {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState('');

  const fetchBalance = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const result = await balanceService.getBalance(user.id);
    if (result.ok) {
      setBalance(result.data);
    } else {
      setSnackbar('Failed to load balance.');
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  const handleAddBalance = async (amount: number) => {
    if (!user) return;
    setSubmitting(true);
    const result = await balanceService.addBalance(user.id, amount);
    setSubmitting(false);

    if (result.ok) {
      setBalance(result.data);
      setSnackbar('Balance updated!');
    } else if (result.error === 'INVALID_AMOUNT') {
      setSnackbar('Invalid amount.');
    } else {
      setSnackbar('Failed to update balance.');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* <Text variant="headlineSmall" style={styles.heading}>
          My Balance
        </Text> */}
        <BalanceCard balance={balance} loading={loading} />
        <AddBalanceForm onSubmit={handleAddBalance} loading={submitting} />        
      </ScrollView>
      <Snackbar
        visible={!!snackbar}
        onDismiss={() => setSnackbar('')}
        duration={3000}
      >
        {snackbar}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    paddingVertical: spacing.lg,
  },
  heading: {
    textAlign: 'center',
    color: colors.text,
    marginBottom: spacing.sm,
    fontWeight: '600',
  },
});
