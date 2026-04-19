import React from "react";
import { ReportSummary } from "../types/report";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../../shared/theme";

interface NoReportFoundProps {    
    report: ReportSummary | null
}

export function NoReportFound({ report }: NoReportFoundProps) {    

    return (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyText} testID="empty-state">
                {
                    report && report?.expenses?.length > 0 ?
                    'No expenses for this period.'
                    : 'Select a period'
                }
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
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
