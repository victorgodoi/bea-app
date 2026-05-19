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
import { createCategory, createSubCategory } from '@/src/services/categories.service';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  AddSubCategoryButton,
  Chip,
  ChipRemoveButton,
  ChipText,
  ChipsContainer,
  FormContainer,
  SectionTitle,
  SubCategoryInputRow,
  SubCategoryInputWrapper,
} from './styleCreateCategory';

export default function CreateCategoryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { success, error } = useNotification();
  const { profile } = useProfile();

  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [subCategoryInput, setSubCategoryInput] = useState<string>('');
  const [subCategoryNames, setSubCategoryNames] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const isFormValid = (): boolean => {
    if (!name.trim() || name.trim().length < 2) return false;
    return true;
  };

  const handleAddSubCategory = () => {
    const trimmed = subCategoryInput.trim();
    if (trimmed.length < 2) {
      error('Erro', 'Nome da subcategoria deve ter pelo menos 2 caracteres');
      return;
    }
    if (subCategoryNames.includes(trimmed)) {
      error('Erro', 'Essa subcategoria já foi adicionada');
      return;
    }
    setSubCategoryNames((prev) => [...prev, trimmed]);
    setSubCategoryInput('');
  };

  const handleRemoveSubCategory = (index: number) => {
    setSubCategoryNames((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (loading) return;

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

      const category = await createCategory({
        name: name.trim(),
        description: description.trim() || undefined,
        company_id: companyId,
      });

      await Promise.all(
        subCategoryNames.map((subName) =>
          createSubCategory({
            name: subName,
            category_id: category.id,
            category_name: category.name,
            company_id: companyId,
          }),
        ),
      );

      success('Sucesso', 'Categoria criada com sucesso!', () => router.back());
    } catch (err: any) {
      console.error('Erro ao criar categoria:', err);
      error('Erro', err.message || 'Não foi possível criar a categoria. Tente novamente.');
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
          Crie uma categoria para organizar suas despesas. Você já pode adicionar subcategorias
          abaixo.
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

          <SectionTitle>Subcategorias</SectionTitle>

          <SubCategoryInputRow>
            <SubCategoryInputWrapper>
              <InputField
                label="Nome da subcategoria"
                placeholder="Ex: Almoço, Uber, Farmácia"
                placeholderTextColor="#999"
                value={subCategoryInput}
                onChangeText={setSubCategoryInput}
                autoCapitalize="words"
                returnKeyType="done"
                onSubmitEditing={handleAddSubCategory}
              />
            </SubCategoryInputWrapper>
            <AddSubCategoryButton onPress={handleAddSubCategory}>
              <MaterialCommunityIcons name="plus" size={22} color="#fff" />
            </AddSubCategoryButton>
          </SubCategoryInputRow>

          {subCategoryNames.length > 0 && (
            <ChipsContainer>
              {subCategoryNames.map((subName, index) => (
                <Chip key={index}>
                  <ChipText>{subName}</ChipText>
                  <ChipRemoveButton onPress={() => handleRemoveSubCategory(index)}>
                    <MaterialCommunityIcons name="close" size={14} color="#7b1fa2" />
                  </ChipRemoveButton>
                </Chip>
              ))}
            </ChipsContainer>
          )}
        </FormContainer>
      </KeyboardAwareScrollView>

      <ButtonFooter>
        <SecondaryButton title="Cancelar" onPress={handleCancel} />
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
