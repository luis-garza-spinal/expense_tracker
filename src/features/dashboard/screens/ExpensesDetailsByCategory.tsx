import { View, Text, StyleSheet } from "react-native";
import { useDashboardFilters } from "../stores/useDashboardFilters";
import { useCallback, useEffect, useState } from "react";
import { createReportService } from "../services/reportService";
import { useAuth } from "../../../app/providers/AuthProvider";
import { ExpenseSummary } from "../types/report";
import { SummaryDetailsCard } from "../components/SummaryDetailsCard";
import { colors, spacing } from "../../../shared/theme";
import { SummaryDetailsOverview } from "../components/SummaryDetailsOverview";
import { useAppGlobalStore } from "../../../shared/stores/useAppGlobalStore";

interface ExpensesDetailsByCategoryState {
    summary: SummaryState[]
    overview: OverviewState
}

interface OverviewState {
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

interface SummaryState {
    category: string;
    categoryTotal: number;
    percentage: number;
    expenses: ExpenseSummary[];
}

const reportService = createReportService();

export function ExpensesDetailsByCategory() {
    const [details, setDetails] = useState<ExpensesDetailsByCategoryState>({
        summary: [],
        overview: {
            mostExpensiveCategory: {
                name: '',
                amount: 0
            },
            range: { start: null, end: null },
            total: 0,
            mostExpensiveItem: {
                name: '',
                amount: 0
            }
        }
    });
    const { summaryFilters } = useDashboardFilters();
    const { user } = useAuth();
    const { refetchData } = useAppGlobalStore();

    const mapExpensesToSummaryState = (expensesCategories: string[], expensesSummary: ExpenseSummary[], total: number): SummaryState[] => {
        return expensesCategories.map((category: string) => {
            const expenses = expensesSummary.filter(x => x.category === category);
            const totalCategoryExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

            return {
                category, expenses,
                percentage: (totalCategoryExpenses * 100) / total,
                categoryTotal: totalCategoryExpenses
            }
        })
    }

    const mapDataForOverview = (expensesSummary: ExpenseSummary[], expensesCategories: Set<string>, total: number): OverviewState => {
        const mostExpensiveItem: { name: string, amount: number } = { name: '', amount: 0 }
        const mostExpensiveCategory: { name: string, amount: number } = { name: '', amount: 0 }

        expensesSummary.map((e: ExpenseSummary) => {
            if (e.amount > mostExpensiveItem.amount) {
                mostExpensiveItem.amount = e.amount;
                mostExpensiveItem.name = e.description ?? '';
            }
        });

        expensesCategories.forEach((category: string) => {
            const totalCategory = expensesSummary.filter(x => x.category === category).reduce((sum, e) => sum + e.amount, 0);

            if (totalCategory > mostExpensiveCategory.amount) {
                mostExpensiveCategory.name = category;
                mostExpensiveCategory.amount = totalCategory;
            }
        });

        return {
            mostExpensiveCategory,
            mostExpensiveItem,
            range: {
                start: summaryFilters.startDate,
                end: summaryFilters.endDate
            },
            total
        }
    }

    const processExpenses = (expensesSummary: ExpenseSummary[]) => {
        // get all categories to then map card with all categories
        const expensesCategories = new Set([...expensesSummary.map(x => x.category)]);
        const total = expensesSummary.reduce((sum, e) => sum + e.amount, 0);


        // summary state
        setDetails((prev) => ({
            ...prev,
            summary: mapExpensesToSummaryState([...expensesCategories], expensesSummary, total),
            overview: mapDataForOverview(expensesSummary, expensesCategories, total)
        }));
    }

    const fetchExpensesSummaryDetails = useCallback(async () => {
        if (!user?.id || !summaryFilters.startDate || !summaryFilters.endDate) return;

        const result = await reportService.getExpensesSummaryDetails(user?.id, summaryFilters.startDate, summaryFilters.endDate);

        // TODO: Show snackbar of error
        if (!result.ok) return;

        processExpenses(result.data)
    }, [summaryFilters])


    useEffect(() => {
        fetchExpensesSummaryDetails()
    }, [])

    useEffect(() => {
        fetchExpensesSummaryDetails()
    }, [refetchData])

    return (
        <View style={styles.container}>
            {/* INFOR OVERVIEW */}

            <View style={styles.cardsContainer}>
                <SummaryDetailsOverview overview={details.overview} />
            </View>

            <View style={styles.cardsContainer}>
                {
                    details.summary.length > 0 ?
                        details.summary.map((e: SummaryState, idx) => (
                            <SummaryDetailsCard key={e.category} categoryTotal={e.categoryTotal} category={e.category} index={idx} expenses={e.expenses} categoryPercentage={e.percentage} />
                        ))
                        : <></>
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    cardsContainer: {
        marginTop: spacing.md,
        marginHorizontal: spacing.md
    },

})