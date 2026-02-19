import { AddButton, HeaderSecundary, PageTitle, PaymentMethodCard } from '@/src/components';
import { useNotification } from '@/src/contexts/NotificationContext';
import { getAllPaymentMethods } from '@/src/services/payment-methods.service';
import { PaymentMethod } from '@/src/types/payment-methods.types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, SafeAreaView, ScrollView } from 'react-native';
import {
  Container,
  ContentContainer,
  EmptyStateContainer,
  EmptyStateIcon,
  EmptyStateText,
  LoadingContainer,
} from './stylePaymentMethodsList';

export default function PaymentMethodsListScreen() {
  const { error } = useNotification();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const loadPaymentMethods = useCallback(async () => {
    try {
      // TODO: Substituir por company_id do usuário logado quando disponível
      const mockCompanyId = '00000000-0000-0000-0000-000000000000';
      const data = await getAllPaymentMethods(mockCompanyId);
      setPaymentMethods(data);
    } catch (err: any) {
      console.error('Erro ao carregar métodos de pagamento:', err);
      error('Erro', err.message || 'Não foi possível carregar os métodos de pagamento');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [error]);

  useEffect(() => {
    loadPaymentMethods();
  }, [loadPaymentMethods]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadPaymentMethods();
  }, [loadPaymentMethods]);

  const handleCardPress = (method: PaymentMethod) => {
    // TODO: Navegar para tela de detalhes/edição
    console.log('Card pressionado:', method);
  };

  const handleAddPress = () => {
    // TODO: Navegar para tela de criação
    console.log('Adicionar novo método de pagamento');
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
            <PageTitle>Contas</PageTitle>
            {paymentMethods.length === 0 ? (
              <EmptyStateContainer>
                <EmptyStateIcon>
                  <MaterialCommunityIcons name="wallet-outline" size={40} color="#c43edf" />
                </EmptyStateIcon>
                <EmptyStateText>
                  Nenhum método de pagamento cadastrado.{'\n'}
                  Toque no botão + para adicionar.
                </EmptyStateText>
              </EmptyStateContainer>
            ) : (
              paymentMethods.map((method) => (
                <PaymentMethodCard 
                  key={method.id} 
                  paymentMethod={method}
                  onPress={() => handleCardPress(method)}
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
