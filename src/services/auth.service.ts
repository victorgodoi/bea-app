import { supabase } from "./supabase";

type SignUpInput = {
  name: string;
  email: string;
  password: string;
};

type SignInInput = {
  email: string;
  password: string;
};

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
