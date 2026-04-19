import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, Snackbar } from 'react-native-paper';
import { useAuth } from '../providers/AuthProvider';
import { createPdfExportService } from '../../features/export/services/pdfExportService';
import { createExcelExportService } from '../../features/export/services/excelExportService';
import { createReportService } from '../../features/dashboard/services/reportService';
import { colors } from '../../shared/theme/colors';
import { spacing } from '../../shared/theme/spacing';
import { DatePickerModal } from 'react-native-paper-dates';

const reportService = createReportService();
const pdfExportService = createPdfExportService();
const excelExportService = createExcelExportService();

export function ProfileScreen() {
  const { user, signOut } = useAuth();
  const [snackbar, setSnackbar] = useState('');
  const [exporting, setExporting] = useState(false);

  const [visible, setVisible] = useState(false);
  const [range, setRange] = useState<{
    startDate: Date | undefined, endDate: Date | undefined
  }>({ startDate: undefined, endDate: undefined })

  const handleSignOut = async () => {
    await signOut();
  };

  const handleExportPdf = async () => {
    if (!user) return;
    
    if(!range.startDate || !range.endDate){
      setSnackbar('Must select a range of dates');
      return
    }

    setExporting(true);
    const reportResult = await reportService.generateReport(user.id, 'monthly', range.startDate!, range.endDate!);

    setRange({ startDate: undefined, endDate: undefined })

    if (reportResult.ok) {
      const result = await pdfExportService.generatePdf(reportResult.data);
      setSnackbar(result.ok ? 'PDF exported.' : 'PDF export failed.');
    } else {
      setSnackbar('Could not generate report.');
    }
    setExporting(false);
  };

  const handleExportExcel = async () => {
    // if (!user) return;
    // setExporting(true);
    // const reportResult = await reportService.generateReport(user.id, 'monthly');
    // if (reportResult.ok) {
    //   const result = await excelExportService.generateXlsx(reportResult.data);
    //   setSnackbar(result.ok ? 'Excel exported.' : 'Excel export failed.');
    // } else {
    //   setSnackbar('Could not generate report.');
    // }
    // setExporting(false);
  };

  const handleRangeChanged = ({ startDate, endDate }: { startDate: Date | undefined, endDate: Date | undefined }) => {
    setRange({ startDate, endDate })
    setVisible(false)
  }

  return (
    <View style={styles.container}>
      <Text variant="headlineSmall" style={styles.heading}>Profile</Text>
      <Text variant="bodyMedium" style={styles.email}>{user?.email ?? ''}</Text>

      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>Export Reports</Text>

        <View style={styles.section}>
          <Button
          mode='contained'
            onPress={() => setVisible(true)}
          >Select Dates Range</Button>
          <DatePickerModal
            visible={visible}
            locale='en'
            mode='range'
            animationType='fade'
            startWeekOnMonday={true}
            calendarIcon='calendar'
            startDate={range.startDate}
            endDate={range.endDate}
            onDismiss={() => setVisible(false)}
            onConfirm={handleRangeChanged}
          />


          <Text style={styles.datesRange}>{
            range.startDate && range.endDate ? `Selected Range: ${range.startDate.toISOString().split('T')[0]} - ${range.endDate.toISOString().split('T')[0]}`
              : 'No dates selected'
          }</Text>

        </View>

        <Button
          mode="contained"
          onPress={handleExportPdf}
          loading={exporting}
          disabled={exporting}
          style={styles.button}
          testID="export-pdf-button"
        >
          Export as PDF
        </Button>
        <Button
          mode="contained"
          onPress={handleExportExcel}
          loading={exporting}
          disabled={exporting}
          style={styles.button}
          testID="export-excel-button"
        >
          Export as Excel
        </Button>
      </View>

      <Button
        mode="contained"
        onPress={handleSignOut}
        style={styles.signOutButton}
        buttonColor={colors.error}
        testID="sign-out-button"
      >
        Sign Out
      </Button>

      <Snackbar visible={!!snackbar} onDismiss={() => setSnackbar('')} duration={3000}>
        {snackbar}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  heading: {
    textAlign: 'center',
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  email: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  button: {
    marginBottom: spacing.sm,
  },
  signOutButton: {
    marginTop: 'auto' as unknown as number,
  },
  datesRange: {
    textAlign: 'center',
    color: colors.text,
    fontWeight: '600',
  }
});
