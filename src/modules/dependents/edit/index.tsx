import {
    ButtonFooter,
    HeaderSecundary,
    InfoBox,
    InputField,
    PageTitle,
    PrimaryButton,
    SecondaryButton,
} from '@/src/components';
import { useNotification } from '@/src/contexts/NotificationContext';
import { getDependentById, updateDependent } from '@/src/services/dependents.service';
import { Dependent } from '@/src/types/dependents.types';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
    FormContainer,
    LoadingContainer,
} from './styleEditDependent';

export default function EditDependentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { success, error } = useNotification();
  
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [dependent, setDependent] = useState<Dependent | null>(null);

  // Estados do formulário
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Busca os dados do dependente
  useEffect(() => {
    const loadDependent = async () => {
      try {
        const dependentId = params.id as string;
        
        if (!dependentId) {
          throw new Error('ID do dependente não fornecido');
        }

        const data = await getDependentById(dependentId);
        setDependent(data);

        // Preenche o formulário com os dados
        setName(data.name || '');
        setEmail(data.email || '');
      } catch (err: any) {
        console.error('Erro ao carregar dependente:', err);
        error(
          'Erro',
          err.message || 'Não foi possível carregar os dados do dependente.'
        );
        router.back();
      } finally {
        setInitialLoading(false);
      }
    };

    loadDependent();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  // Validações
  const isFormValid = (): boolean => {
    if (!name.trim() || name.trim().length < 2) return false;
    if (!email.trim() || !email.includes('@')) return false;
    return true;
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSave = async () => {
    if (loading || !dependent) return;

    // Validações extras antes de salvar
    if (name.trim().length < 2) {
      error('Erro', 'Nome deve ter pelo menos 2 caracteres');
      return;
    }

    if (!validateEmail(email.trim())) {
      error('Erro', 'Email inválido');
      return;
    }

    setLoading(true);

    try {
      await updateDependent({
        id: dependent.id,
        name: name.trim(),
        email: email.trim().toLowerCase(),
      });

      success(
        'Sucesso',
        'Dependente atualizado com sucesso!',
        () => router.back()
      );
    } catch (err: any) {
      console.error('Erro ao atualizar dependente:', err);
      error(
        'Erro',
        err.message || 'Não foi possível atualizar o dependente. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  // Mostra loading enquanto carrega os dados
  if (initialLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <HeaderSecundary />
        <LoadingContainer>
          <ActivityIndicator size="large" color="#7C3AED" />
        </LoadingContainer>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <HeaderSecundary />
      <KeyboardAwareScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        extraScrollHeight={120}
        extraHeight={120}
        enableResetScrollToCoords={false}
        keyboardOpeningTime={250}
      >
        <PageTitle>Editar Dependente</PageTitle>

        <InfoBox variant="info">
          Altere os dados do dependente conforme necessário. A senha não pode ser alterada por aqui por questões de segurança.
        </InfoBox>

        <FormContainer>
          <InputField
            label="Nome Completo *"
            placeholder="Ex: João Silva"
            placeholderTextColor="#999"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            required
          />

          <InputField
            label="Email *"
            placeholder="exemplo@email.com"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoCorrect={false}
            required
          />
        </FormContainer>
      </KeyboardAwareScrollView>
      
      <ButtonFooter>
        <SecondaryButton 
          title="Cancelar"
          onPress={handleCancel}
        />
        <PrimaryButton
          title="Salvar Alterações"
          onPress={handleSave}
          loading={loading}
          disabled={!isFormValid() || loading}
        />
      </ButtonFooter>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 24,
  },
});
