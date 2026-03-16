import { AddButton, DependentCard, HeaderSecundary, PageTitle } from '@/src/components';
import { useNotification } from '@/src/contexts/NotificationContext';
import { getAllDependents } from '@/src/services/dependents.service';
import { Dependent } from '@/src/types/dependents.types';
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
} from './styleDependentsList';

export default function DependentsListScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { error } = useNotification();
  const [dependents, setDependents] = useState<Dependent[]>([]);
  const [companyId, setCompanyId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const loadDependents = useCallback(async () => {
    const currentCompanyId = (params?.companyId as string) || companyId;

    if (!currentCompanyId) {
      setLoading(false);
      setRefreshing(false);
      return;
    }

    if (params?.companyId) setCompanyId(params.companyId as string);
    
    try {
      const data = await getAllDependents(currentCompanyId);
      setDependents(data);
    } catch (err: any) {
      console.error('Erro ao carregar dependentes:', err);
      error('Erro', err.message || 'Não foi possível carregar os dependentes');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [error, companyId, params?.companyId]);

  // Recarrega a lista sempre que a tela ganhar foco
  useFocusEffect(
    useCallback(() => {
      loadDependents();
    }, [loadDependents])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadDependents();
  }, [loadDependents]);

  const handleCardPress = (id: string) => {
    router.push({
      pathname: '/dependents/edit',
      params: { id }
    });
  };

  const handleAddPress = () => {
    router.push({
      pathname: '/dependents/create',
      params: { 
        companyId: companyId || '',
      }
    });
  };

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
            <PageTitle>Dependentes</PageTitle>
            {dependents.length === 0 ? (
              <EmptyStateContainer>
                <EmptyStateIcon>
                  <MaterialCommunityIcons name="account-multiple-outline" size={40} color="#c43edf" />
                </EmptyStateIcon>
                <EmptyStateText>
                  Nenhum dependente cadastrado.{'\n'}
                  Toque no botão + para adicionar.
                </EmptyStateText>
              </EmptyStateContainer>
            ) : (
              dependents.map((dependent) => (
                <DependentCard 
                  key={dependent.id} 
                  dependent={dependent}
                  onPress={() => handleCardPress(dependent.id)}
                />
              ))
            )}
          </ContentContainer>
        </ScrollView>
        <AddButton onPress={handleAddPress} />
      </Container>
    </SafeAreaView>
  );
}
