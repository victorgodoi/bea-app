import type { SignInInput, SignUpInput, UpdateUserProfileInput } from "../types/auth.types";
import { supabase } from "./supabase";

export async function signUpUser({
  name,
  email,
  password,
}: SignUpInput) {
  // Validações
  if (!name || name.trim().length < 2) {
    throw new Error('Nome deve ter pelo menos 2 caracteres');
  }

  if (!email || !email.includes('@')) {
    throw new Error('Email inválido');
  }

  if (!password || password.length < 6) {
    throw new Error('Senha deve ter pelo menos 6 caracteres');
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name, // 🔑 usado pelo trigger handle_new_user
        },
      },
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error: any) {
    // Traduz erros comuns do Supabase
    if (error.message?.includes('already registered')) {
      throw new Error('Este email já está cadastrado');
    }
    throw error;
  }
}

export async function signInUser({ email, password }: SignInInput) {
  // Validações
  if (!email || !email.includes('@')) {
    throw new Error('Email inválido');
  }

  if (!password) {
    throw new Error('Senha é obrigatória');
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error: any) {
    // Traduz erros comuns do Supabase
    if (error.message?.includes('Invalid login credentials')) {
      throw new Error('Email ou senha incorretos');
    }
    throw error;
  }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    throw error;
  }
}

export async function getUserProfile(email: string) {
  try {
    const { data, error } = await supabase
      .from('users_profile')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error: any) {
    console.error('Erro ao buscar perfil do usuário:', error);
    throw error;
  }
}

export async function getUserProfileById(id: string) {
  try {
    const { data, error } = await supabase
      .from('users_profile')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error: any) {
    console.error('Erro ao buscar perfil do usuário por ID:', error);
    throw error;
  }
}

export async function updateUserProfile({
  id,
  name,
  email,
  role,
}: UpdateUserProfileInput) {
  // Validações
  if (!id) {
    throw new Error('ID do usuário é obrigatório');
  }

  if (name !== undefined && name.trim().length < 2) {
    throw new Error('Nome deve ter pelo menos 2 caracteres');
  }

  if (email !== undefined && !email.includes('@')) {
    throw new Error('Email inválido');
  }

  if (role !== undefined && !['owner', 'dependent'].includes(role)) {
    throw new Error('Role inválido. Deve ser "owner" ou "dependent"');
  }

  try {
    // Prepara os dados para atualização
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (name !== undefined) {
      updateData.name = name.trim();
    }

    if (email !== undefined) {
      updateData.email = email.trim().toLowerCase();
    }

    if (role !== undefined) {
      updateData.role = role;
    }

    // Atualiza o perfil no Supabase
    const { data, error } = await supabase
      .from('users_profile')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Se o email foi alterado, também atualiza no auth
    if (email !== undefined) {
      const { error: authError } = await supabase.auth.updateUser({
        email: email.trim().toLowerCase(),
      });

      if (authError) {
        console.warn('Aviso: Email atualizado no perfil, mas houve um problema ao atualizar no auth:', authError.message);
      }
    }

    return data;
  } catch (error: any) {
    // Traduz erros comuns do Supabase
    if (error.message?.includes('duplicate key')) {
      throw new Error('Este email já está em uso');
    }
    if (error.message?.includes('violates foreign key constraint')) {
      throw new Error('Erro ao atualizar perfil: referência inválida');
    }
    console.error('Erro ao atualizar perfil:', error);
    throw error;
  }
}
