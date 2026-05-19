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
import {
    createSubCategory,
    deleteSubCategory,
    getCategoryById,
    updateCategory,
} from '@/src/services/categories.service';
import { Category, SubCategory } from '@/src/types/categories.types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
    AddSubCategoryButton,
    Chip,
    ChipRemoveButton,
    ChipText,
    ChipsContainer,
    FormContainer,
    LoadingContainer,
    SectionTitle,
    SubCategoryInputRow,
    SubCategoryInputWrapper,
} from './styleEditCategory';

export default function EditCategoryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { success, error } = useNotification();

  const [category, setCategory] = useState<Category | null>(null);
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const [existingSubCategories, setExistingSubCategories] = useState<SubCategory[]>([]);
  const [deletedSubCategoryIds, setDeletedSubCategoryIds] = useState<string[]>([]);
  const [newSubCategoryNames, setNewSubCategoryNames] = useState<string[]>([]);
  const [subCategoryInput, setSubCategoryInput] = useState<string>('');

  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const loadCategory = async () => {
      try {
        const categoryId = params.id as string;

        if (!categoryId) {
          throw new Error('ID da categoria não fornecido');
        }

        const data = await getCategoryById(categoryId);
        setCategory(data);
        setName(data.name);
        setDescription(data.description || '');
        setExistingSubCategories(data.sub_categories || []);
      } catch (err: any) {
        console.error('Erro ao carregar categoria:', err);
        error('Erro', err.message || 'Não foi possível carregar a categoria.');
        router.back();
      } finally {
        setInitialLoading(false);
      }
    };

    loadCategory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    const allNames = [
      ...existingSubCategories.map(s => s.name),
      ...newSubCategoryNames,
    ];
    if (allNames.includes(trimmed)) {
      error('Erro', 'Essa subcategoria já existe');
      return;
    }
    setNewSubCategoryNames(prev => [...prev, trimmed]);
    setSubCategoryInput('');
  };

  const handleRemoveExisting = (id: string) => {
    setDeletedSubCategoryIds(prev => [...prev, id]);
    setExistingSubCategories(prev => prev.filter(s => s.id !== id));
  };

  const handleRemoveNew = (index: number) => {
    setNewSubCategoryNames(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (loading || !category) return;

    if (name.trim().length < 2) {
      error('Erro', 'Nome deve ter pelo menos 2 caracteres');
      return;
    }

    setLoading(true);

    try {
      await updateCategory({
        id: category.id,
        name: name.trim(),
        description: description.trim() || undefined,
      });

      await Promise.all(deletedSubCategoryIds.map(id => deleteSubCategory(id)));

      await Promise.all(
        newSubCategoryNames.map(subName =>
          createSubCategory({
            name: subName,
            category_id: category.id,
            category_name: name.trim(),
            company_id: category.company_id,
          })
        )
      );

      success(
        'Sucesso',
        'Categoria atualizada com sucesso!',
        () => router.back()
      );
    } catch (err: any) {
      console.error('Erro ao atualizar categoria:', err);
      error(
        'Erro',
        err.message || 'Não foi possível atualizar a categoria. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (initialLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <HeaderSecundary />
        <LoadingContainer>
          <ActivityIndicator size="large" color="#c43edf" />
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
        <PageTitle>Editar Categoria</PageTitle>

        <InfoBox>
          Atualize as informações da categoria e gerencie suas subcategorias.
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

          {(existingSubCategories.length > 0 || newSubCategoryNames.length > 0) && (
            <ChipsContainer>
              {existingSubCategories.map((sub) => (
                <Chip key={sub.id}>
                  <ChipText>{sub.name}</ChipText>
                  <ChipRemoveButton onPress={() => handleRemoveExisting(sub.id)}>
                    <MaterialCommunityIcons name="close" size={14} color="#7b1fa2" />
                  </ChipRemoveButton>
                </Chip>
              ))}
              {newSubCategoryNames.map((subName, index) => (
                <Chip key={`new-${index}`}>
                  <ChipText>{subName}</ChipText>
                  <ChipRemoveButton onPress={() => handleRemoveNew(index)}>
                    <MaterialCommunityIcons name="close" size={14} color="#7b1fa2" />
                  </ChipRemoveButton>
                </Chip>
              ))}
            </ChipsContainer>
          )}
        </FormContainer>
      </KeyboardAwareScrollView>

      <ButtonFooter>
        <SecondaryButton
          title="Cancelar"
          onPress={handleCancel}
        />
        <PrimaryButton
          title="Salvar"
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
