export type UserRole = 'owner' | 'dependent';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  company_id: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}
