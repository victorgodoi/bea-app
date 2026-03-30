export interface Purpose {
  id: string;
  name: string;
  company_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreatePurposeInput {
  name: string;
  company_id: string;
}

export interface UpdatePurposeInput {
  id: string;
  name?: string;
  is_active?: boolean;
}
