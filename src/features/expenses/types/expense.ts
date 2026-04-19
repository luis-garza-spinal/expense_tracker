export interface Expense {
  id: string;
  userId: string;
  amount: number;
  category: string;
  date: string; // ISO 8601 date string
  description?: string;
  createdAt: string;
}

export interface CreateExpenseInput {
  amount: number;
  category: string;
  date: string;
  description?: string;
}
