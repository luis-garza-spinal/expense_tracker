import React, { View, StyleSheet, Text } from "react-native";
import { colors, spacing } from "../../../shared/theme";
import { PeriodSelector } from "./PeriodSelector";
import { PeriodSelectorDateRange } from "./PeriodSelectorDateRange";

export function RangeSelector() {

    return (
        <View>
            <PeriodSelector />

            <View stlye={styles.emptyContainer}>
                <Text style={styles.emptyText}>OR</Text>
            </View>

            <PeriodSelectorDateRange />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        color: colors.textSecondary,
        textAlign: 'center',
    },
});