import { colors } from "../theme";
import { View, StyleSheet } from 'react-native'

interface ProgressBarCustomProps {
    percentage: number;
    index: number
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

export function ProgressBar({ percentage, index }: ProgressBarCustomProps) {
    return (
        <View style={styles.barBackground}>
            <View
                style={[styles.barFill, {
                    width: `${Math.min(percentage, 100)}%`,
                    backgroundColor: BAR_COLORS[index % BAR_COLORS.length],
                }]}
            >
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
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
