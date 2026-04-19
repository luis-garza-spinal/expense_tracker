import { create, } from "zustand"
import { ReportPeriod } from "../types/report";

interface DashboardFiltersType {
    period: ReportPeriod,
    range: { startDate: Date | null, endDate: Date | null },
    state: 'INITIAL' | 'SET'
}

interface SummaryDetailsFilters {
    startDate: Date | null;
    endDate: Date | null;
}

export interface DashboardFiltersStore {
    filters: DashboardFiltersType
    summaryFilters: SummaryDetailsFilters
    setPeriod: (period: ReportPeriod) => void
    setRange: (startDate: Date, endDate: Date) => void
    setSummaryFilters: (startDate: Date, endDate: Date) => void
}

export const useDashboardFilters = create<DashboardFiltersStore>((set) => (
    {
        filters: {
            period: 'not-selected',
            range: { startDate: null, endDate: null },
            state: 'INITIAL'
        },
        summaryFilters: {
            startDate: null,
            endDate: null
        },
        setSummaryFilters: (startDate, endDate) => (
            set((state) => ({
                ...state,
                summaryFilters: {
                    startDate, endDate
                }
            }))
        ),
        setPeriod: (newPeriod: ReportPeriod) => (set((state) =>
        ({
            filters:
            {
                ...state.filters,
                period: newPeriod,
                range: { startDate: null, endDate: null },
                state: 'SET'
            }
        }))),
        setRange: (startDate: Date, endDate: Date) => (set((state) => ({
            filters: {
                ...state.filters,
                period: 'not-selected',
                range: {
                    startDate, endDate
                },
                state: 'SET'
            }
        })))
    }
));
