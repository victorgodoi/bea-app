export type ExpenseType = 'fixed' | 'variable' | 'occasional';
export type PaymentTerm = 'single' | 'installment';

export interface Expense {
  id: string;
  description: string;
  expense_type: ExpenseType;
  payment_term: PaymentTerm;
  currency: string;
  amount: number;
  expense_date: string;
  due_date: string | null;
  user_id: string;
  company_id: string;
  category_id: string | null;
  category_name: string | null;
  sub_category_id: string | null;
  sub_category_name: string | null;
  purpose_id: string | null;
  purpose_name: string | null;
  payment_method_id: string | null;
  nfce: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateExpenseInput {
  description: string;
  expense_type: ExpenseType;
  payment_term: PaymentTerm;
  currency: string;
  amount: number;
  expense_date: string;
  due_date?: string | null;
  company_id: string;
  category_id?: string | null;
  category_name?: string | null;
  sub_category_id?: string | null;
  sub_category_name?: string | null;
  purpose_id?: string | null;
  purpose_name?: string | null;
  payment_method_id?: string | null;
  nfce?: string | null;
}

export interface UpdateExpenseInput {
  id: string;
  description?: string;
  expense_type?: ExpenseType;
  payment_term?: PaymentTerm;
  currency?: string;
  amount?: number;
  expense_date?: string;
  due_date?: string | null;
  category_id?: string | null;
  category_name?: string | null;
  sub_category_id?: string | null;
  sub_category_name?: string | null;
  purpose_id?: string | null;
  purpose_name?: string | null;
  payment_method_id?: string | null;
  nfce?: string | null;
}
