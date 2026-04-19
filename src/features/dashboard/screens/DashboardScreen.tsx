import React, { useEffect, useState, useCallback } from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { ActivityIndicator, FAB, Snackbar } from 'react-native-paper';
import { useAuth } from '../../../app/providers/AuthProvider';
import { createReportService } from '../services/reportService';
import { ReportSummary } from '../types/report';
import { SummaryCard } from '../components/SummaryCard';
import { CategoryChart } from '../components/CategoryChart';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { NoReportFound } from '../components/DashboardNoReportFound';
import { RangeSelector } from '../components/RangeSelector';
import { useDashboardFilters } from '../stores/useDashboardFilters';
import { useAppGlobalStore } from '../../../shared/stores/useAppGlobalStore';

interface DashboardScreenProps {
  onNavigateToSummaryDetails: () => void;
}

const reportService = createReportService();

export function DashboardScreen({ onNavigateToSummaryDetails }: DashboardScreenProps) {
  const { user } = useAuth();
  const { filters, setSummaryFilters } = useDashboardFilters();
  const { refetchData } = useAppGlobalStore();
  const [report, setReport] = useState<ReportSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState('');

  const caculateDates = (): { start: Date, end: Date } => {
    // calcualte dates
    let start: Date = new Date();
    let end: Date = new Date();

    if (filters.period !== 'not-selected') {
      // calculate with service
      const newDates = reportService.getDateRange(filters.period);
      start = newDates.start;
      end = newDates.end;
    }
    else {
      start = filters.range.startDate!;
      end = filters.range.endDate!;
    }
    setSummaryFilters(start, end);

    return { start, end }
  }

  const fetchReport = useCallback(async () => {
    setLoading(true);

    // calcualte dates
    const { start, end } = caculateDates();
   
    const result = await reportService.generateReport(user!.id, filters.period, start, end);
    if (result.ok) {
      setReport(result.data);
    } else {
      setSnackbar('Failed to load report.');
    }
    setLoading(false);
  }, [user, filters]);

  useEffect(() => {
    if (!user || filters.state === 'INITIAL') return;
    fetchReport()
  }, [filters])

  useEffect(() => {
    if (!user || filters.state === 'INITIAL') return;
    fetchReport()
  },[refetchData])

  return (
    <View style={styles.container}>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>Track Expenses By Period</Text>
      </View>

      <RangeSelector />

      {loading ? (
        <ActivityIndicator style={styles.loader} size="large" color={colors.primary} />
      ) : report && report.expenses.length > 0 ? (
        <ScrollView contentContainerStyle={styles.scroll}>
          <SummaryCard report={report} />
          <CategoryChart breakdown={report.categoryBreakdown} />
        </ScrollView>
      ) : (
        <NoReportFound report={report} />
      )}

      <Snackbar visible={!!snackbar} onDismiss={() => setSnackbar('')} duration={3000}>
        {snackbar}
      </Snackbar>

      {
        report && report.expenses.length > 0 ?
          <FAB
            icon='chart-bar'
            style={styles.fab}
            onPress={() => onNavigateToSummaryDetails()}
          /> : <></>
      }
    </View> 
  );
} 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg
  },
  loader: {
    marginTop: spacing.xxl,
  },
  scroll: {
    paddingBottom: spacing.xxl,
  },
  emptyContainer: {
  
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textSecondary,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: spacing.md,
    bottom: spacing.md,
    backgroundColor: colors.primary,
  },
  title: {
    fontWeight: 600,
    fontSize: 20,
    color: colors.text
  },
  titleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  }
});
