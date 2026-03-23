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
import { createCategory } from '@/src/services/categories.service';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { FormContainer } from './styleCreateCategory';

export default function CreateCategoryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { success, error } = useNotification();
  const { profile } = useProfile();

  // Estados do formulário
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Validações
  const isFormValid = (): boolean => {
    if (!name.trim() || name.trim().length < 2) return false;
    return true;
  };

  const handleSave = async () => {
    if (loading) return;

    // Validações extras antes de salvar
    if (name.trim().length < 2) {
      error('Erro', 'Nome deve ter pelo menos 2 caracteres');
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

      await createCategory({
        name: name.trim(),
        description: description.trim() || undefined,
        company_id: companyId,
      });

      success(
        'Sucesso',
        'Categoria criada com sucesso!',
        () => router.back()
      );
    } catch (err: any) {
      console.error('Erro ao criar categoria:', err);
      error(
        'Erro',
        err.message || 'Não foi possível criar a categoria. Tente novamente.'
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
        <PageTitle>Nova Categoria</PageTitle>

        <InfoBox>
          Crie uma categoria para organizar suas despesas. Você poderá adicionar subcategorias depois.
        </InfoBox>

        <FormContainer>
          <InputField
            label="Nome da Categoria *"
            placeholder="Ex: Alimentação, Transporte, Saúde"
            placeholderTextColor="#999"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            required
          />

          <InputField
            label="Descrição (Opcional)"
            placeholder="Digite uma breve descrição da categoria"
            placeholderTextColor="#999"
            value={description}
            onChangeText={setDescription}
            autoCapitalize="sentences"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </FormContainer>
      </KeyboardAwareScrollView>
      
      <ButtonFooter>
        <SecondaryButton 
          title="Cancelar"
          onPress={handleCancel}
        />
        <PrimaryButton
          title="Criar Categoria"
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
