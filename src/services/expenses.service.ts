import { CreateExpenseInput, Expense, UpdateExpenseInput } from '../types/expenses.types';
import { supabase } from './supabase';

export async function getExpenses(companyId: string): Promise<Expense[]> {
  if (!companyId) throw new Error('Company ID é obrigatório');

  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('company_id', companyId)
    .order('expense_date', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getExpenseById(id: string): Promise<Expense> {
  if (!id) throw new Error('ID da despesa é obrigatório');

  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function createExpense(input: CreateExpenseInput): Promise<Expense> {
  const { data, error } = await supabase
    .from('expenses')
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateExpense(input: UpdateExpenseInput): Promise<Expense> {
  const { id, ...rest } = input;

  const { data, error } = await supabase
    .from('expenses')
    .update({ ...rest, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteExpense(id: string): Promise<void> {
  if (!id) throw new Error('ID da despesa é obrigatório');

  const { error } = await supabase.from('expenses').delete().eq('id', id);
  if (error) throw error;
}
