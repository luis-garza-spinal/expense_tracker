import { Card } from "react-native-paper";
import { ExpenseSummary } from "../types/report";
import { StyleSheet, Text, View } from 'react-native'
import { colors, spacing } from "../../../shared/theme";
import { ProgressBar } from "../../../shared/components/ProgressBar";

interface SummaryDetailsCardProps {
    category: string;
    categoryPercentage: number
    categoryTotal: number
    expenses: ExpenseSummary[]
    index: number
}

export function SummaryDetailsCard({ category, expenses, categoryPercentage, categoryTotal, index }: SummaryDetailsCardProps) {
    return (
        <Card style={styles.card}>
            <Card.Content>

                <View style={styles.titleContainer}>
                    <Text variant="titleMedium" style={styles.title}>{category}</Text>
                    <Text variant="titleMedium" style={styles.textSecondary}>${categoryTotal} ({categoryPercentage.toFixed(2)}%)</Text>
                </View>

                {
                    expenses.map((item) => (
                        <View key={item.id} style={styles.row}>
                            <Text style={styles.subtitle}>{
                                (item.description?.length ?? 0) > 15 ? `${item.description?.substring(0, 15)}...` : item.description
                            }</Text>
                            <Text style={styles.subtitle}>{item.date}</Text>
                            <Text style={styles.subtitle}>${item.amount} ({item.percentage.toFixed(2)}%)</Text>
                        </View>
                    ))
                }

                <ProgressBar percentage={categoryPercentage} index={index} />
            </Card.Content>
        </Card>
    )
}

const styles = StyleSheet.create({
    chartContainer: {
        marginBottom: spacing.sm
    },
    card: {
        marginVertical: spacing.sm,
        backgroundColor: colors.surface,
    },
    title: {
        marginBottom: spacing.sm,
        fontSize: 18,
        fontWeight: '600',
    },
    subtitle: {
        fontWeight: '450'
    },
    row: {
        marginBottom: spacing.sm,
        flexDirection: 'row',
        justifyContent: 'space-evenly'

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
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    textSecondary: {
        color: colors.textSecondary
    }
});
