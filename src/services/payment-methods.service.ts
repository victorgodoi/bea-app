import {
    CreatePaymentMethodInput,
    PaymentMethod,
    UpdatePaymentMethodInput
} from '../types/payment-methods.types';
import { supabase } from './supabase';

/**
 * Busca todos os métodos de pagamento ativos de uma empresa
 */
export async function getPaymentMethods(companyId: string): Promise<PaymentMethod[]> {
  const { data, error } = await supabase
    .from('payment_methods')
    .select('*')
    .eq('company_id', companyId)
    .eq('is_active', true)
    .order('description', { ascending: true });

  if (error) {
    console.error('Erro ao buscar métodos de pagamento:', error);
    throw new Error(error.message || 'Erro ao buscar métodos de pagamento');
  }

  return data || [];
}

/**
 * Busca todos os métodos de pagamento (incluindo inativos) de uma empresa
 */
export async function getAllPaymentMethods(companyId: string): Promise<PaymentMethod[]> {
  const { data, error } = await supabase
    .from('payment_methods')
    .select('*')
    .eq('company_id', companyId)
    .order('description', { ascending: true });

  if (error) {
    console.error('Erro ao buscar métodos de pagamento:', error);
    throw new Error(error.message || 'Erro ao buscar métodos de pagamento');
  }

  return data || [];
}

/**
 * Busca um método de pagamento específico por ID
 */
export async function getPaymentMethodById(id: string): Promise<PaymentMethod> {
  const { data, error } = await supabase
    .from('payment_methods')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Erro ao buscar método de pagamento:', error);
    throw new Error(error.message || 'Método de pagamento não encontrado');
  }

  return data;
}

/**
 * Cria um novo método de pagamento
 */
export async function createPaymentMethod(
  input: CreatePaymentMethodInput
): Promise<PaymentMethod> {
  const { data, error } = await supabase
    .from('payment_methods')
    .insert({
      ...input,
      is_active: input.is_active ?? true,
    })
    .select()
    .single();

  if (error) {
    console.error('Erro ao criar método de pagamento:', error);
    throw new Error(error.message || 'Erro ao criar método de pagamento');
  }

  return data;
}

/**
 * Atualiza um método de pagamento existente
 */
export async function updatePaymentMethod(
  input: UpdatePaymentMethodInput
): Promise<PaymentMethod> {
  const { id, ...updateData } = input;

  const { data, error } = await supabase
    .from('payment_methods')
    .update({
      ...updateData,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Erro ao atualizar método de pagamento:', error);
    throw new Error(error.message || 'Erro ao atualizar método de pagamento');
  }

  return data;
}

/**
 * Desativa um método de pagamento (soft delete)
 */
export async function deactivatePaymentMethod(id: string): Promise<void> {
  const { error } = await supabase
    .from('payment_methods')
    .update({ 
      is_active: false,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    console.error('Erro ao desativar método de pagamento:', error);
    throw new Error(error.message || 'Erro ao desativar método de pagamento');
  }
}

/**
 * Deleta permanentemente um método de pagamento
 */
export async function deletePaymentMethod(id: string): Promise<void> {
  const { error } = await supabase
    .from('payment_methods')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Erro ao deletar método de pagamento:', error);
    throw new Error(error.message || 'Erro ao deletar método de pagamento');
  }
}
