import { useProfile } from '@/hooks/use-profile';
import { AddButton, CategoryCard, HeaderSecundary, PageTitle } from '@/src/components';
import { useNotification } from '@/src/contexts/NotificationContext';
import { getAllCategories } from '@/src/services/categories.service';
import { Category } from '@/src/types/categories.types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, RefreshControl, SafeAreaView, ScrollView } from 'react-native';
import {
  Container,
  ContentContainer,
  EmptyStateContainer,
  EmptyStateIcon,
  EmptyStateText,
  LoadingContainer,
  SummaryCard,
  SummaryItem,
  SummaryLabel,
  SummaryValue,
} from './styleCategoriesList';

export default function CategoriesListScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { error } = useNotification();
  const { profile } = useProfile();
  const [categories, setCategories] = useState<Category[]>([]);
  const [companyId, setCompanyId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const loadCategories = useCallback(async () => {
    const currentCompanyId = (params?.companyId as string) || companyId || profile?.company_id;

    if (!currentCompanyId) {
      setLoading(false);
      setRefreshing(false);
      return;
    }

    if (params?.companyId) setCompanyId(params.companyId as string);
    
    try {
      const data = await getAllCategories(currentCompanyId);
      setCategories(data);
    } catch (err: any) {
      console.error('Erro ao carregar categorias:', err);
      error('Erro', err.message || 'Não foi possível carregar as categorias');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [error, companyId, params?.companyId, profile?.company_id]);

  // Recarrega a lista sempre que a tela ganhar foco
  useFocusEffect(
    useCallback(() => {
      loadCategories();
    }, [loadCategories])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadCategories();
  }, [loadCategories]);

  const handleCardPress = (id: string) => {
    // TODO: Implementar tela de edição
    console.log('Editar categoria:', id);
    // router.push({
    //   pathname: '/categories/edit',
    //   params: { id }
    // });
  };

  const handleAddPress = () => {
    router.push({
      pathname: '/categories/create',
      params: { 
        companyId: companyId || profile?.company_id || '',
      }
    });
  };

  // Cálculo de estatísticas
  const totalCategories = categories.length;
  const totalSubCategories = categories.reduce(
    (acc, cat) => acc + (cat.sub_categories?.length || 0), 
    0
  );
  const categoriesWithSubCategories = categories.filter(
    cat => (cat.sub_categories?.length || 0) > 0
  ).length;
  const categoriesWithoutSubCategories = totalCategories - categoriesWithSubCategories;

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <HeaderSecundary />
        <LoadingContainer>
          <ActivityIndicator size="large" color="#c43edf" />
        </LoadingContainer>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <HeaderSecundary />
      <Container>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#c43edf']} />
          }
        >
          <ContentContainer>
            <PageTitle>Categorias</PageTitle>
            
            {categories.length === 0 ? (
              <EmptyStateContainer>
                <EmptyStateIcon>
                  <MaterialCommunityIcons name="tag-multiple-outline" size={40} color="#c43edf" />
                </EmptyStateIcon>
                <EmptyStateText>
                  Nenhuma categoria cadastrada.{'\n'}
                  Toque no botão + para adicionar.
                </EmptyStateText>
              </EmptyStateContainer>
            ) : (
              <>
                {/* Card de Resumo */}
                <SummaryCard>
                  <SummaryItem>
                    <MaterialCommunityIcons name="tag-multiple" size={24} color="#c43edf" />
                    <SummaryLabel>Total de Categorias</SummaryLabel>
                    <SummaryValue>{totalCategories}</SummaryValue>
                  </SummaryItem>
                  
                  <SummaryItem>
                    <MaterialCommunityIcons name="tag" size={24} color="#7c3aed" />
                    <SummaryLabel>Total de Subcategorias</SummaryLabel>
                    <SummaryValue>{totalSubCategories}</SummaryValue>
                  </SummaryItem>
                  
                  <SummaryItem>
                    <MaterialCommunityIcons name="check-circle" size={24} color="#2e7d32" />
                    <SummaryLabel>Com Subcategorias</SummaryLabel>
                    <SummaryValue>{categoriesWithSubCategories}</SummaryValue>
                  </SummaryItem>
                  
                  <SummaryItem>
                    <MaterialCommunityIcons name="alert-circle-outline" size={24} color="#c62828" />
                    <SummaryLabel>Sem Subcategorias</SummaryLabel>
                    <SummaryValue>{categoriesWithoutSubCategories}</SummaryValue>
                  </SummaryItem>
                </SummaryCard>

                {/* Lista de Categorias */}
                {categories.map((category) => (
                  <CategoryCard 
                    key={category.id} 
                    category={category}
                    onPress={() => handleCardPress(category.id)}
                  />
                ))}
              </>
            )}
          </ContentContainer>
        </ScrollView>
        <AddButton onPress={handleAddPress} />
      </Container>
    </SafeAreaView>
  );
}
