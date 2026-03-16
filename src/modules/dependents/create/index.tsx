import { useProfile } from '@/hooks/use-profile';
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
import { createDependent } from '@/src/services/dependents.service';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { FormContainer } from './styleCreateDependent';

export default function CreateDependentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { success, error } = useNotification();
  const { profile } = useProfile();

  // Estados do formulário
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Validações
  const isFormValid = (): boolean => {
    if (!name.trim() || name.trim().length < 2) return false;
    if (!email.trim() || !email.includes('@')) return false;
    if (!password || password.length < 6) return false;
    if (password !== confirmPassword) return false;
    return true;
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSave = async () => {
    if (loading) return;

    // Validações extras antes de salvar
    if (name.trim().length < 2) {
      error('Erro', 'Nome deve ter pelo menos 2 caracteres');
      return;
    }

    if (!validateEmail(email.trim())) {
      error('Erro', 'Email inválido');
      return;
    }

    if (password.length < 6) {
      error('Erro', 'Senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      error('Erro', 'As senhas não coincidem');
      return;
    }

    setLoading(true);

    try {
      const companyId = (params.companyId as string) || profile?.company_id;
      
      if (!companyId) {
        throw new Error('ID da empresa não fornecido');
      }

      if (!profile?.id) {
        throw new Error('Usuário não autenticado. Faça login novamente.');
      }

      await createDependent({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password,
        company_id: companyId,
      });

      success(
        'Sucesso',
        'Dependente criado com sucesso! Um email de confirmação foi enviado.',
        () => router.back()
      );
    } catch (err: any) {
      console.error('Erro ao criar dependente:', err);
      error(
        'Erro',
        err.message || 'Não foi possível criar o dependente. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

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
        <PageTitle>Novo Dependente</PageTitle>

        <InfoBox>
          O dependente poderá acessar o aplicativo com as credenciais cadastradas.
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

          <InputField
            label="Senha *"
            placeholder="Digite a senha"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            required
          />

          <InputField
            label="Confirmar Senha *"
            placeholder="Digite a senha novamente"
            placeholderTextColor="#999"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            required
          />
          {confirmPassword.length > 0 && password !== confirmPassword && (
            <Text style={styles.errorText}>
              As senhas não coincidem
            </Text>
          )}
        </FormContainer>
      </KeyboardAwareScrollView>
      
      <ButtonFooter>
        <SecondaryButton 
          title="Cancelar"
          onPress={handleCancel}
        />
        <PrimaryButton
          title="Criar Dependente"
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
  passwordStrength: {
    fontSize: 12,
    color: '#666',
    marginTop: -12,
    marginLeft: 4,
  },
  errorText: {
    fontSize: 12,
    color: '#e53935',
    marginTop: -12,
    marginLeft: 4,
  },
});
