import { View, Text, StyleSheet } from 'react-native'
import { colors, spacing } from '../../../shared/theme';
import { Card } from 'react-native-paper';

interface SummaryDetailsOverviewProps {
    overview: SummaryDetailsOverviewState
}


interface SummaryDetailsOverviewState {
    range: {
        start: Date | null, end: Date | null
    };
    total: number;
    mostExpensiveCategory: {
        name: string,
        amount: number
    }
    mostExpensiveItem: {
        name: string,
        amount: number
    }
}


export function SummaryDetailsOverview({ overview }: SummaryDetailsOverviewProps) {
    return (
        <View style={styles.overviewContainer}>
            <Card style={styles.card}>
                <Card.Content>

                    <View style={styles.emptyContainer}>
                        <Text style={styles.title}>Period Details Summary</Text>
                    </View>


                    {/* Dates  */}
                    <View style={styles.textContainer}>
                        <Text style={styles.secondaryLabel}>Dates</Text>
                        <Text style={styles.value}>{overview.range.start?.toISOString().split('T')[0]} - {overview.range.end?.toISOString().split('T')[0]}</Text>
                    </View>

                    {/* Total Expenses */}
                    <View style={styles.textContainer}>
                        <Text style={styles.primaryLabel}>Total Expense</Text>
                        <Text style={styles.value}>${overview.total}</Text>
                    </View>


                    {/* Most expensive Category */}
                    <View style={styles.textContainer}>
                        <Text style={styles.secondaryLabel}>Most Expensive Category: {overview.mostExpensiveCategory.name}</Text>
                        <Text style={styles.value}>${overview.mostExpensiveCategory.amount}</Text>
                    </View>

                    {/* Most expensive Item */}
                    <View style={styles.textContainer}>
                        <Text style={styles.primaryLabel}>Most Expensive Item: {overview.mostExpensiveItem.name}</Text>
                        <Text style={styles.value}>${overview.mostExpensiveItem.amount}</Text>
                    </View>
                </Card.Content>
            </Card>
        </View>
    )
} 

const styles = StyleSheet.create({
    emptyContainer: {
        alignItems: 'center',
        justifyItems: 'center',
        marginBottom: spacing.sm
    },
    card: {
        backgroundColor: colors.surface
    },
    title: {
        color: colors.text,
        fontWeight: 600,
        fontSize: 20
    },
    textContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    primaryLabel: {
        color: colors.text,
        fontWeight: 'medium'
    },
    secondaryLabel: {
        color: colors.textLight,
        fontWeight: 'medium'
    },
    value: {
        fontWeight: 'bold'
    }
})