/**
 * Interface para Categoria
 */
export interface Category {
  id: string;
  name: string;
  description: string;
  company_id: string;
  created_at: string;
  sub_categories?: SubCategory[];
}

/**
 * Interface para Subcategoria
 */
export interface SubCategory {
  id: string;
  name: string;
  category_id: string;
  category_name: string;
  company_id: string;
  created_at: string;
  updated_at: string;
}

/**
 * Input para criar uma nova categoria
 */
export interface CreateCategoryInput {
  name: string;
  description?: string;
  company_id: string;
}

/**
 * Input para atualizar uma categoria
 */
export interface UpdateCategoryInput {
  id: string;
  name?: string;
  description?: string;
}

/**
 * Input para criar uma nova subcategoria
 */
export interface CreateSubCategoryInput {
  name: string;
  category_id: string;
  category_name: string;
  company_id: string;
}

/**
 * Input para atualizar uma subcategoria
 */
export interface UpdateSubCategoryInput {
  id: string;
  name?: string;
  category_id?: string;
  category_name?: string;
}
