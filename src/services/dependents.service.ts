import type { CreateDependentInput, Dependent, UpdateDependentInput } from '../types/dependents.types';
import { supabase } from './supabase';

/**
 * Busca todos os dependentes de uma empresa
 */
export async function getAllDependents(companyId: string): Promise<Dependent[]> {
  if (!companyId) {
    throw new Error('Company ID é obrigatório');
  }

  try {
    const { data, error } = await supabase
      .from('users_profile')
      .select('*')
      .eq('company_id', companyId)
      .eq('role', 'dependent')
      .order('name', { ascending: true });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error: any) {
    console.error('Erro ao buscar dependentes:', error);
    throw error;
  }
}

/**
 * Busca um dependente por ID
 */
export async function getDependentById(id: string): Promise<Dependent> {
  if (!id) {
    throw new Error('ID do dependente é obrigatório');
  }

  try {
    const { data, error } = await supabase
      .from('users_profile')
      .select('*')
      .eq('id', id)
      .eq('role', 'dependent')
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('Dependente não encontrado');
    }

    return data;
  } catch (error: any) {
    console.error('Erro ao buscar dependente:', error);
    throw error;
  }
}

/**
 * Cria um novo dependente
 * Nota: Isso requer criar um usuário no Supabase Auth primeiro
 */
export async function createDependent(input: CreateDependentInput): Promise<Dependent> {
  // Validações
  if (!input.name || input.name.trim().length < 2) {
    throw new Error('Nome deve ter pelo menos 2 caracteres');
  }

  if (!input.email || !input.email.includes('@')) {
    throw new Error('Email inválido');
  }

  if (!input.password || input.password.length < 6) {
    throw new Error('Senha deve ter pelo menos 6 caracteres');
  }

  if (!input.company_id) {
    throw new Error('Company ID é obrigatório');
  }

  try {
    // 1. Criar usuário no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        data: {
          name: input.name,
        },
      },
    });

    if (authError) {
      throw authError;
    }

    if (!authData.user) {
      throw new Error('Erro ao criar usuário');
    }

    // 2. Atualizar o perfil para incluir company_id e role
    const { data, error } = await supabase
      .from('users_profile')
      .update({
        company_id: input.company_id,
        role: 'dependent',
      })
      .eq('id', authData.user.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error: any) {
    if (error.message?.includes('already registered')) {
      throw new Error('Este email já está cadastrado');
    }
    console.error('Erro ao criar dependente:', error);
    throw error;
  }
}

/**
 * Atualiza um dependente existente
 */
export async function updateDependent(input: UpdateDependentInput): Promise<Dependent> {
  if (!input.id) {
    throw new Error('ID do dependente é obrigatório');
  }

  if (input.name !== undefined && input.name.trim().length < 2) {
    throw new Error('Nome deve ter pelo menos 2 caracteres');
  }

  if (input.email !== undefined && !input.email.includes('@')) {
    throw new Error('Email inválido');
  }

  try {
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (input.name !== undefined) {
      updateData.name = input.name.trim();
    }

    if (input.email !== undefined) {
      updateData.email = input.email.trim().toLowerCase();
    }

    const { data, error } = await supabase
      .from('users_profile')
      .update(updateData)
      .eq('id', input.id)
      .eq('role', 'dependent') // Garante que só atualiza dependentes
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error: any) {
    if (error.message?.includes('duplicate key')) {
      throw new Error('Este email já está em uso');
    }
    console.error('Erro ao atualizar dependente:', error);
    throw error;
  }
}

/**
 * Remove um dependente
 */
export async function deleteDependent(id: string): Promise<void> {
  if (!id) {
    throw new Error('ID do dependente é obrigatório');
  }

  try {
    const { error } = await supabase
      .from('users_profile')
      .delete()
      .eq('id', id)
      .eq('role', 'dependent'); // Garante que só deleta dependentes

    if (error) {
      throw error;
    }
  } catch (error: any) {
    console.error('Erro ao deletar dependente:', error);
    throw error;
  }
}
