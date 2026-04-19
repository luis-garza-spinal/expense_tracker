import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text, Chip, Portal, Modal, Button } from 'react-native-paper';
import { Expense } from '../types/expense';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';

interface ExpenseItemProps {
  expense: Expense;
  deleteExpense: (expenseId: string) => void;
}

export function ExpenseItem({ expense, deleteExpense }: ExpenseItemProps) {
  const [showModal, setShowModal] = useState(false);

  const handleDeleteExpense = () => {
    setShowModal(false)
    deleteExpense(expense.id)
  }

  return (
    <Card style={styles.card} testID={`expense-item-${expense.id}`}>
      <Card.Content style={styles.content}>
        <View style={styles.titleContainer}>
          {expense.description ? (
            <Text variant="bodyMedium" style={styles.description} testID="expense-description">
              {expense.description}
            </Text>
          ) : <></>}

          <View style={styles.actions}>
            <Chip style={styles.chip} textStyle={styles.chipText} testID="expense-category">
              {expense.category}
            </Chip>

            <Chip textStyle={{ color: 'white' }} style={styles.chipDelete} rippleColor="rgba(0, 0, 0, .32)" onPress={() => setShowModal(true)}>Delete</Chip>
          </View>
        </View>

        <View style={styles.titleContainer}>
          <Text variant="titleMedium" style={styles.amount} testID="expense-amount">
            -${expense.amount.toFixed(2)}
          </Text>

          <Text variant="bodySmall" style={styles.date} testID="expense-date">
            {expense.date}
          </Text>
        </View>

        <Portal>
          <Modal visible={showModal} onDismiss={() => setShowModal(false)} contentContainerStyle={styles.modal}>
            <Text>Do you really want to delete this expense ({expense.description})?</Text>

            <View style={styles.modalButtons}>
              <Button mode="contained" onPress={handleDeleteExpense} rippleColor="rgba(0, 0, 0, .32)" style={{ backgroundColor: colors.warning }}>Yes</Button>
              <Button mode="contained" onPress={() => setShowModal(false)} rippleColor="rgba(0, 0, 0, .32)" style={{ backgroundColor: colors.primary }}>No</Button>
            </View>
          </Modal>
        </Portal>

      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.surface,
  },
  content: {
    flexDirection: 'column',
  },
  amount: {
    color: colors.error,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  chip: {
    alignSelf: 'flex-start',
    backgroundColor: colors.secondaryLight,
    marginBottom: spacing.xs
  },
  chipDelete: {
    alignSelf: 'flex-start',
    backgroundColor: colors.error,
    marginBottom: spacing.xs,
    marginLeft: spacing.xs,
    color: '#FFF'
  },
  chipText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: 500
  },
  date: {
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  description: {
    color: colors.text,
    fontWeight: 600
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  modal: {
    backgroundColor: 'white', padding: spacing.xxl,
    margin: spacing.lg
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 5,
    justifyContent: 'flex-end'
  }
});
