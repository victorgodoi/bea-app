export interface UserSettings {
  id: string;
  user_id: string;
  company_id: string;
  language: string;
  currency: string;
  default_payment_method_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface UpdateUserSettingsInput {
  id: string;
  language?: string;
  currency?: string;
  default_payment_method_id?: string | null;
}
