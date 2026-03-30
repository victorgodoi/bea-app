import { useProfile } from '@/hooks/use-profile';
import { AddButton, HeaderSecundary, PageTitle } from '@/src/components';
import { useNotification } from '@/src/contexts/NotificationContext';
import { getAllPurposes } from '@/src/services/purposes.service';
import { Purpose } from '@/src/types/purposes.types';
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
  PurposeBadge,
  PurposeBadgeText,
  PurposeCard,
  PurposeIconContainer,
  PurposeInfo,
  PurposeName,
  SummaryCard,
  SummaryItem,
  SummaryLabel,
  SummaryValue,
} from './stylePurposesList';

export default function PurposesListScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { error } = useNotification();
  const { profile } = useProfile();
  const [purposes, setPurposes] = useState<Purpose[]>([]);
  const [companyId, setCompanyId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const loadPurposes = useCallback(async () => {
    const currentCompanyId = (params?.companyId as string) || companyId || profile?.company_id;

    if (!currentCompanyId) {
      setLoading(false);
      setRefreshing(false);
      return;
    }

    if (params?.companyId) setCompanyId(params.companyId as string);

    try {
      const data = await getAllPurposes(currentCompanyId);
      setPurposes(data);
    } catch (err: any) {
      console.error('Erro ao carregar tags:', err);
      error('Erro', err.message || 'Não foi possível carregar as tags');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [error, companyId, params?.companyId, profile?.company_id]);

  useFocusEffect(
    useCallback(() => {
      loadPurposes();
    }, [loadPurposes])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadPurposes();
  }, [loadPurposes]);

  const handleCardPress = (id: string) => {
    router.push({
      pathname: '/purposes/edit' as any,
      params: { id },
    });
  };

  const handleAddPress = () => {
    router.push({
      pathname: '/purposes/create' as any,
      params: {
        companyId: companyId || profile?.company_id || '',
      },
    });
  };

  const totalActive = purposes.filter(p => p.is_active).length;
  const totalInactive = purposes.length - totalActive;

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
            <PageTitle>Tags</PageTitle>

            {purposes.length === 0 ? (
              <EmptyStateContainer>
                <EmptyStateIcon>
                  <MaterialCommunityIcons name="tag-outline" size={40} color="#c43edf" />
                </EmptyStateIcon>
                <EmptyStateText>
                  Nenhuma tag cadastrada.{'\n'}
                  Toque no botão + para adicionar.
                </EmptyStateText>
              </EmptyStateContainer>
            ) : (
              <>
                <SummaryCard>
                  <SummaryItem>
                    <MaterialCommunityIcons name="tag-multiple" size={24} color="#7c3aed" />
                    <SummaryLabel>Total de Tags</SummaryLabel>
                    <SummaryValue>{purposes.length}</SummaryValue>
                  </SummaryItem>

                  <SummaryItem>
                    <MaterialCommunityIcons name="check-circle" size={24} color="#2e7d32" />
                    <SummaryLabel>Ativas</SummaryLabel>
                    <SummaryValue>{totalActive}</SummaryValue>
                  </SummaryItem>

                  <SummaryItem>
                    <MaterialCommunityIcons name="close-circle-outline" size={24} color="#c62828" />
                    <SummaryLabel>Inativas</SummaryLabel>
                    <SummaryValue>{totalInactive}</SummaryValue>
                  </SummaryItem>
                </SummaryCard>

                {purposes.map((purpose) => (
                  <PurposeCard key={purpose.id} onPress={() => handleCardPress(purpose.id)}>
                    <PurposeIconContainer>
                      <MaterialCommunityIcons name="tag" size={22} color="#7c3aed" />
                    </PurposeIconContainer>
                    <PurposeInfo>
                      <PurposeName>{purpose.name}</PurposeName>
                    </PurposeInfo>
                    <PurposeBadge active={purpose.is_active}>
                      <PurposeBadgeText active={purpose.is_active}>
                        {purpose.is_active ? 'Ativa' : 'Inativa'}
                      </PurposeBadgeText>
                    </PurposeBadge>
                  </PurposeCard>
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
