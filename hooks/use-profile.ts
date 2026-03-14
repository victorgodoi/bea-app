import { useAuth } from '@/src/contexts/AuthContext';
import { getUserProfile } from '@/src/services/auth.service';
import { useEffect, useState } from 'react';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  company_id: string;
  created_at: string;
  updated_at: string;
}

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadProfile() {
      if (user?.email) {
        setLoading(true);
        setError(null);
        try {
          const userProfile = await getUserProfile(user.email);
          setProfile(userProfile);
        } catch (err: any) {
          console.error('Erro ao carregar perfil:', err);
          setError(err);
        } finally {
          setLoading(false);
        }
      }
    }

    loadProfile();
  }, [user]);

  return { profile, setProfile, loading, error };
}
