import { CreatePurposeInput, Purpose, UpdatePurposeInput } from '../types/purposes.types';
import { supabase } from './supabase';

export async function getAllPurposes(companyId: string): Promise<Purpose[]> {
  if (!companyId) throw new Error('Company ID é obrigatório');

  const { data, error } = await supabase
    .from('purposes')
    .select('*')
    .eq('company_id', companyId)
    .order('name', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function getPurposeById(id: string): Promise<Purpose> {
  if (!id) throw new Error('ID da tag é obrigatório');

  const { data, error } = await supabase
    .from('purposes')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function createPurpose(input: CreatePurposeInput): Promise<Purpose> {
  const { data, error } = await supabase
    .from('purposes')
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updatePurpose(input: UpdatePurposeInput): Promise<Purpose> {
  const { id, ...rest } = input;

  const { data, error } = await supabase
    .from('purposes')
    .update({ ...rest, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deletePurpose(id: string): Promise<void> {
  if (!id) throw new Error('ID da tag é obrigatório');

  const { error } = await supabase
    .from('purposes')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
