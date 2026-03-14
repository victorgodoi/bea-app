export type PaymentMethodType = 'credit' | 'debit' | 'prepaid' | 'cash' | 'pix' | 'bank_transfer' | 'card' | undefined;
export type CardType = 'credit' | 'debit' | 'prepaid';
export type FlagType = 'visa' | 'mastercard' | 'elo' | 'american_express' | 'other';

export interface PaymentMethod {
  id: string;
  description: string;
  type: PaymentMethodType;
  flag: FlagType | undefined;
  bank_name: string | null;
  card_type: CardType | null;
  owner_card: string | null;
  company_id: string;
  created_by: string;
  due_day: number | null;
  closing_day: number | null;
  expiration_date: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreatePaymentMethodInput {
  description: string;
  type: PaymentMethodType;
  flag?: FlagType | undefined;
  bank_name?: string;
  card_type?: CardType | undefined;
  owner_card?: string;
  company_id: string;
  created_by: string;
  due_day?: number;
  closing_day?: number;
  expiration_date?: string;
  is_active?: boolean;
}

export interface UpdatePaymentMethodInput {
  id: string;
  description?: string;
  type?: PaymentMethodType;
  flag?: FlagType | undefined;
  bank_name?: string;
  card_type?: CardType | undefined;
  owner_card?: string;
  due_day?: number;
  closing_day?: number;
  expiration_date?: string;
  is_active?: boolean;
}
