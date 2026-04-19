import React, { useState } from "react";
import { Button } from "react-native-paper";
import { View, StyleSheet } from "react-native";
import { DatePickerModal } from "react-native-paper-dates";
import { spacing } from "../../../shared/theme";
import { useDashboardFilters } from "../stores/useDashboardFilters";

export function PeriodSelectorDateRange() {

    const { setRange, filters } = useDashboardFilters();
    const [visible, setVisible] = useState(false);

    const onConfirm = ({ startDate, endDate }: { startDate: Date | undefined; endDate: Date | undefined }) => {
        if (startDate && endDate) setRange(startDate!, endDate!);
        setVisible(false);
    };

    return (
        <View style={styles.container}>
            <Button
                mode="contained"
                onPress={() => setVisible(true)}>
                {filters.range.startDate && filters.range.endDate
                    ? `Expenses on: ${filters.range.startDate.toLocaleDateString()} - ${filters.range.endDate.toLocaleDateString()}`
                    : "Select date range"}
            </Button>

            <DatePickerModal
                animationType="slide"
                locale="en"
                mode="range"
                visible={visible}
                startWeekOnMonday={true}
                calendarIcon={'calendar'}
                onDismiss={() => setVisible(false)}
                startDate={filters.range.startDate!}
                endDate={filters.range.endDate!}
                onConfirm={onConfirm}
            />
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
    }
});

