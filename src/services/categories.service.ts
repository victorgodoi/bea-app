import {
  Category,
  CreateCategoryInput,
  CreateSubCategoryInput,
  SubCategory,
  UpdateCategoryInput,
  UpdateSubCategoryInput,
} from '../types/categories.types';
import { supabase } from './supabase';

/**
 * Busca todas as categorias de uma empresa com suas subcategorias
 */
export async function getAllCategories(companyId: string): Promise<Category[]> {
  if (!companyId) {
    throw new Error('Company ID é obrigatório');
  }

  try {
    const { data, error } = await supabase
      .from('categories')
      .select(`
        *,
        sub_categories (*)
      `)
      .eq('company_id', companyId)
      .order('name', { ascending: true });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error: any) {
    console.error('Erro ao buscar categorias:', error);
    throw error;
  }
}

/**
 * Busca uma categoria por ID com suas subcategorias
 */
export async function getCategoryById(id: string): Promise<Category> {
  if (!id) {
    throw new Error('ID da categoria é obrigatório');
  }

  try {
    const { data, error } = await supabase
      .from('categories')
      .select(`
        *,
        sub_categories (*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('Categoria não encontrada');
    }

    return data;
  } catch (error: any) {
    console.error('Erro ao buscar categoria:', error);
    throw error;
  }
}

/**
 * Busca todas as subcategorias de uma categoria específica
 */
export async function getSubCategoriesByCategoryId(categoryId: string): Promise<SubCategory[]> {
  if (!categoryId) {
    throw new Error('Category ID é obrigatório');
  }

  try {
    const { data, error } = await supabase
      .from('sub_categories')
      .select('*')
      .eq('category_id', categoryId)
      .order('name', { ascending: true });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error: any) {
    console.error('Erro ao buscar subcategorias:', error);
    throw error;
  }
}

/**
 * Cria uma nova categoria
 */
export async function createCategory(input: CreateCategoryInput): Promise<Category> {
  // Validações
  if (!input.name || input.name.trim().length < 2) {
    throw new Error('Nome deve ter pelo menos 2 caracteres');
  }

  if (!input.description || input.description.trim().length < 5) {
    throw new Error('Descrição deve ter pelo menos 5 caracteres');
  }

  if (!input.company_id) {
    throw new Error('Company ID é obrigatório');
  }

  try {
    const { data, error } = await supabase
      .from('categories')
      .insert({
        name: input.name,
        description: input.description,
        company_id: input.company_id,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error: any) {
    console.error('Erro ao criar categoria:', error);
    throw error;
  }
}

/**
 * Atualiza uma categoria existente
 */
export async function updateCategory(input: UpdateCategoryInput): Promise<Category> {
  const { id, ...updateData } = input;

  if (!id) {
    throw new Error('ID da categoria é obrigatório');
  }

  try {
    const { data, error } = await supabase
      .from('categories')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error: any) {
    console.error('Erro ao atualizar categoria:', error);
    throw error;
  }
}

/**
 * Cria uma nova subcategoria
 */
export async function createSubCategory(input: CreateSubCategoryInput): Promise<SubCategory> {
  // Validações
  if (!input.name || input.name.trim().length < 2) {
    throw new Error('Nome deve ter pelo menos 2 caracteres');
  }

  if (!input.category_id) {
    throw new Error('Category ID é obrigatório');
  }

  if (!input.company_id) {
    throw new Error('Company ID é obrigatório');
  }

  try {
    const { data, error } = await supabase
      .from('sub_categories')
      .insert({
        name: input.name,
        category_id: input.category_id,
        category_name: input.category_name,
        company_id: input.company_id,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error: any) {
    console.error('Erro ao criar subcategoria:', error);
    throw error;
  }
}

/**
 * Atualiza uma subcategoria existente
 */
export async function updateSubCategory(input: UpdateSubCategoryInput): Promise<SubCategory> {
  const { id, ...updateData } = input;

  if (!id) {
    throw new Error('ID da subcategoria é obrigatório');
  }

  try {
    const { data, error } = await supabase
      .from('sub_categories')
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error: any) {
    console.error('Erro ao atualizar subcategoria:', error);
    throw error;
  }
}
