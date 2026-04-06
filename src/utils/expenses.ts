import { Expense } from '@/src/types/expenses.types';

export const EXPENSE_TYPE_LABELS: Record<string, string> = {
  fixed: 'Fixo',
  variable: 'Variável',
  occasional: 'Eventual',
};

export const EXPENSE_TYPE_ICONS: Record<string, string> = {
  fixed: 'sync',
  variable: 'trending-up',
  occasional: 'lightning-bolt-outline',
};

export function groupByDate(expenses: Expense[]): Record<string, Expense[]> {
  return expenses.reduce<Record<string, Expense[]>>((acc, expense) => {
    const key = expense.expense_date;
    if (!acc[key]) acc[key] = [];
    acc[key].push(expense);
    return acc;
  }, {});
}
