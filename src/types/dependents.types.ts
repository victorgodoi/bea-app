export interface Dependent {
  id: string;
  name: string;
  email: string;
  company_id: string;
  role: 'dependent'; 
  created_at: string;
  updated_at: string;
}

export interface CreateDependentInput {
  name: string;
  email: string;
  password: string;
  company_id: string;
}

export interface UpdateDependentInput {
  id: string;
  name?: string;
  email?: string;
}
