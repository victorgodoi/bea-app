import { UpdateUserSettingsInput, UserSettings } from '../types/user-settings.types';
import { supabase } from './supabase';

export async function getUserSettingsByUserId(userId: string): Promise<UserSettings | null> {
  if (!userId) throw new Error('User ID é obrigatório');

  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // not found
    throw error;
  }

  return data;
}

export async function updateUserSettings(input: UpdateUserSettingsInput): Promise<UserSettings> {
  const { id, ...rest } = input;

  const { data, error } = await supabase
    .from('user_settings')
    .update({ ...rest, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
