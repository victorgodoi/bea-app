import { useProfile } from '@/hooks/use-profile';
import { AddButton, Header } from '@/src/components';
import { useNotification } from '@/src/contexts/NotificationContext';
import { getExpenses } from '@/src/services/expenses.service';
import { Expense } from '@/src/types/expenses.types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  View,
} from 'react-native';
import {
  Container,
  ContentContainer,
  EmptyStateContainer,
  EmptyStateIcon,
  EmptyStateText,
  ExpenseAmount,
  ExpenseAmountContainer,
  ExpenseCard,
  ExpenseDate,
  ExpenseDescription,
  ExpenseIconContainer,
  ExpenseInfo,
  ExpenseMeta,
  LoadingContainer,
  SectionHeader,
  SummaryCard,
  SummaryLabel,
  SummaryRow,
  SummaryValue,
  TypeBadge,
  TypeBadgeText,
} from './styleExpensesList';

const EXPENSE_TYPE_LABELS: Record<string, string> = {
  fixed: 'Fixo',
  variable: 'Variável',
  occasional: 'Eventual',
};

const EXPENSE_TYPE_ICONS: Record<string, string> = {
  fixed: 'sync',
  variable: 'trending-up',
  occasional: 'lightning-bolt-outline',
};

function formatCurrency(amount: number, currency = 'BRL') {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(amount);
}

function formatDate(dateStr: string) {
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

function groupByDate(expenses: Expense[]): Record<string, Expense[]> {
  return expenses.reduce<Record<string, Expense[]>>((acc, expense) => {
    const key = expense.expense_date;
    if (!acc[key]) acc[key] = [];
    acc[key].push(expense);
    return acc;
  }, {});
}

export default function ExpensesListScreen() {
  const router = useRouter();
  const { error } = useNotification();
  const { profile } = useProfile();

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const loadExpenses = useCallback(async () => {
    if (!profile?.company_id) {
      setLoading(false);
      setRefreshing(false);
      return;
    }

    try {
      const data = await getExpenses(profile.company_id);
      setExpenses(data);
    } catch (err: any) {
      console.error('Erro ao carregar despesas:', err);
      error('Erro', err.message || 'Não foi possível carregar as despesas');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [error, profile?.company_id]);

  useFocusEffect(
    useCallback(() => {
      loadExpenses();
    }, [loadExpenses])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadExpenses();
  }, [loadExpenses]);

  const handleCardPress = (id: string) => {
    router.push({ pathname: '/expenses/edit' as any, params: { id } });
  };

  const handleAddPress = () => {
    router.push({
      pathname: '/expenses/create' as any,
      params: { companyId: profile?.company_id || '' },
    });
  };

  const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
  const fixedTotal = expenses.filter(e => e.expense_type === 'fixed').reduce((sum, e) => sum + e.amount, 0);
  const variableTotal = expenses.filter(e => e.expense_type === 'variable').reduce((sum, e) => sum + e.amount, 0);

  const grouped = groupByDate(expenses);
  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#c43edf' }}>
        <Header />
        <LoadingContainer>
          <ActivityIndicator size="large" color="#c43edf" />
        </LoadingContainer>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#c43edf' }}>
      <Header />

      <Container>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#c43edf']} />
          }
        >
          <ContentContainer>
            {expenses.length === 0 ? (
              <EmptyStateContainer>
                <EmptyStateIcon>
                  <MaterialCommunityIcons name="receipt-text-outline" size={40} color="#c43edf" />
                </EmptyStateIcon>
                <EmptyStateText>
                  Nenhuma despesa registrada.{'\n'}
                  Toque no botão + para adicionar.
                </EmptyStateText>
              </EmptyStateContainer>
            ) : (
              <>
                <SummaryRow>
                  <SummaryCard>
                    <MaterialCommunityIcons name="cash-multiple" size={22} color="#c43edf" />
                    <SummaryValue>{formatCurrency(totalAmount)}</SummaryValue>
                    <SummaryLabel>Total</SummaryLabel>
                  </SummaryCard>
                  <SummaryCard>
                    <MaterialCommunityIcons name="sync" size={22} color="#2e7d32" />
                    <SummaryValue style={{ color: '#2e7d32' }}>{formatCurrency(fixedTotal)}</SummaryValue>
                    <SummaryLabel>Fixas</SummaryLabel>
                  </SummaryCard>
                  <SummaryCard>
                    <MaterialCommunityIcons name="trending-up" size={22} color="#e65100" />
                    <SummaryValue style={{ color: '#e65100' }}>{formatCurrency(variableTotal)}</SummaryValue>
                    <SummaryLabel>Variáveis</SummaryLabel>
                  </SummaryCard>
                </SummaryRow>

                {sortedDates.map(date => (
                  <View key={date}>
                    <SectionHeader>{formatDate(date)}</SectionHeader>
                    {grouped[date].map(expense => (
                      <ExpenseCard key={expense.id} onPress={() => handleCardPress(expense.id)}>
                        <ExpenseIconContainer>
                          <MaterialCommunityIcons
                            name={EXPENSE_TYPE_ICONS[expense.expense_type] as any}
                            size={22}
                            color="#7c3aed"
                          />
                        </ExpenseIconContainer>
                        <ExpenseInfo>
                          <ExpenseDescription numberOfLines={1}>{expense.description}</ExpenseDescription>
                          <ExpenseMeta numberOfLines={1}>
                            {expense.category_name || 'Sem categoria'}
                            {expense.sub_category_name ? ` · ${expense.sub_category_name}` : ''}
                          </ExpenseMeta>
                          <TypeBadge expenseType={expense.expense_type}>
                            <TypeBadgeText expenseType={expense.expense_type}>
                              {EXPENSE_TYPE_LABELS[expense.expense_type]}
                            </TypeBadgeText>
                          </TypeBadge>
                        </ExpenseInfo>
                        <ExpenseAmountContainer>
                          <ExpenseAmount>{formatCurrency(expense.amount, expense.currency)}</ExpenseAmount>
                          <ExpenseDate>{formatDate(expense.expense_date)}</ExpenseDate>
                        </ExpenseAmountContainer>
                      </ExpenseCard>
                    ))}
                  </View>
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


