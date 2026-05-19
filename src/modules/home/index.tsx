import { useProfile } from '@/hooks/use-profile';
import { Header, MonthSelector } from '@/src/components';
import { getExpenses } from '@/src/services/expenses.service';
import { Expense } from '@/src/types/expenses.types';
import {
  CATEGORY_COLORS,
  EXPENSE_TYPE_LABELS,
  TYPE_CONFIG,
  formatCurrency,
  formatDate,
} from '@/src/utils';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, RefreshControl, SafeAreaView } from 'react-native';
import {
  BarFill,
  BarTrack,
  CategoryAmount,
  CategoryCard,
  CategoryCardTitle,
  CategoryName,
  CategoryPercent,
  CategoryRow,
  CategoryRowHeader,
  Container,
  ContentPadding,
  DistributionBar,
  DistributionCard,
  DistributionLegend,
  DistributionSegment,
  DistributionTitle,
  EmptyCategoryText,
  EmptyExpenseText,
  ExpenseIconWrap,
  ExpenseItem,
  ExpenseItemAmount,
  ExpenseItemInfo,
  ExpenseItemLast,
  ExpenseItemMeta,
  ExpenseItemName,
  ExpenseItemRight,
  KpiCard,
  KpiCardWide,
  KpiGrid,
  KpiIconBox,
  KpiInfo,
  KpiLabel,
  KpiRow,
  KpiSmallLabel,
  KpiValue,
  LegendDot,
  LegendItem,
  LegendText,
  LegendValue,
  LoadingContainer,
  RecentCard,
  RecentCardHeader,
  RecentCardTitle,
  ScrollContent,
  SectionTitle,
  SeeAllButton,
  SeeAllText,
  TypeBadge,
  TypeBadgeText,
} from './styleHome';

export default function HomeScreen() {
  const router = useRouter();
  const { profile } = useProfile();

  const [expenses, setExpenses]   = useState<Expense[]>([]);
  const [loading, setLoading]     = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(() => new Date().getMonth() + 1);
  const [selectedYear,  setSelectedYear]  = useState(() => new Date().getFullYear());

  const loadExpenses = useCallback(async () => {
    if (!profile?.company_id) { setLoading(false); setRefreshing(false); return; }
    try {
      const data = await getExpenses(profile.company_id);
      setExpenses(data);
    } catch {
      // silent — real app would show a notification
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [profile?.company_id]);

  useFocusEffect(useCallback(() => { loadExpenses(); }, [loadExpenses]));

  const onRefresh = useCallback(() => { setRefreshing(true); loadExpenses(); }, [loadExpenses]);

  const handlePrevMonth = () => {
    if (selectedMonth === 1) { setSelectedMonth(12); setSelectedYear(y => y - 1); }
    else setSelectedMonth(m => m - 1);
  };

  const handleNextMonth = () => {
    if (selectedMonth === 12) { setSelectedMonth(1); setSelectedYear(y => y + 1); }
    else setSelectedMonth(m => m + 1);
  };

  const filtered = useMemo(() => {
    const mm = selectedMonth.toString().padStart(2, '0');
    return expenses.filter(e => e.expense_date.startsWith(`${selectedYear}-${mm}`));
  }, [expenses, selectedMonth, selectedYear]);

  const total    = useMemo(() => filtered.reduce((s, e) => s + e.amount, 0), [filtered]);
  const byType   = useMemo(() => ({
    fixed:      filtered.filter(e => e.expense_type === 'fixed').reduce((s, e) => s + e.amount, 0),
    variable:   filtered.filter(e => e.expense_type === 'variable').reduce((s, e) => s + e.amount, 0),
    occasional: filtered.filter(e => e.expense_type === 'occasional').reduce((s, e) => s + e.amount, 0),
  }), [filtered]);

  const byCategory = useMemo(() => {
    const map: Record<string, number> = {};
    filtered.forEach(e => {
      const key = e.category_name ?? 'Sem categoria';
      map[key] = (map[key] ?? 0) + e.amount;
    });
    return Object.entries(map)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 6);
  }, [filtered]);

  const recentExpenses = useMemo(() =>
    [...filtered].sort((a, b) => b.expense_date.localeCompare(a.expense_date)).slice(0, 5),
    [filtered]
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#c43edf' }}>
      <Header />

      <Container>
        {loading ? (
          <LoadingContainer>
            <ActivityIndicator size="large" color="#c43edf" />
          </LoadingContainer>
        ) : (
          <ScrollContent
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#c43edf']} />}
            showsVerticalScrollIndicator={false}
          >
            <ContentPadding>

              <MonthSelector
                month={selectedMonth}
                year={selectedYear}
                onPrevMonth={handlePrevMonth}
                onNextMonth={handleNextMonth}
              />

              <SectionTitle>Resumo</SectionTitle>
              <KpiGrid>
                <KpiCardWide accent="#c43edf">
                  <KpiIconBox bg="#f3e8ff">
                    <MaterialCommunityIcons name="wallet-outline" size={22} color="#c43edf" />
                  </KpiIconBox>
                  <KpiInfo>
                    <KpiLabel>Total de despesas</KpiLabel>
                    <KpiValue>{formatCurrency(total)}</KpiValue>
                    <KpiSmallLabel>{filtered.length} {filtered.length === 1 ? 'lançamento' : 'lançamentos'}</KpiSmallLabel>
                  </KpiInfo>
                </KpiCardWide>

                <KpiRow>
                  <KpiCard accent={TYPE_CONFIG.fixed.color}>
                    <KpiIconBox bg={TYPE_CONFIG.fixed.bg}>
                      <MaterialCommunityIcons name={TYPE_CONFIG.fixed.icon} size={18} color={TYPE_CONFIG.fixed.color} />
                    </KpiIconBox>
                    <KpiLabel style={{ marginTop: 8 }}>Fixas</KpiLabel>
                    <KpiValue style={{ fontSize: 15 }}>{formatCurrency(byType.fixed)}</KpiValue>
                  </KpiCard>
                  <KpiCard accent={TYPE_CONFIG.variable.color}>
                    <KpiIconBox bg={TYPE_CONFIG.variable.bg}>
                      <MaterialCommunityIcons name={TYPE_CONFIG.variable.icon} size={18} color={TYPE_CONFIG.variable.color} />
                    </KpiIconBox>
                    <KpiLabel style={{ marginTop: 8 }}>Variáveis</KpiLabel>
                    <KpiValue style={{ fontSize: 15 }}>{formatCurrency(byType.variable)}</KpiValue>
                  </KpiCard>
                  <KpiCard accent={TYPE_CONFIG.occasional.color}>
                    <KpiIconBox bg={TYPE_CONFIG.occasional.bg}>
                      <MaterialCommunityIcons name={TYPE_CONFIG.occasional.icon} size={18} color={TYPE_CONFIG.occasional.color} />
                    </KpiIconBox>
                    <KpiLabel style={{ marginTop: 8 }}>Eventuais</KpiLabel>
                    <KpiValue style={{ fontSize: 15 }}>{formatCurrency(byType.occasional)}</KpiValue>
                  </KpiCard>
                </KpiRow>
              </KpiGrid>

              <SectionTitle>Distribuição</SectionTitle>
              <DistributionCard>
                <DistributionTitle>Despesas por tipo</DistributionTitle>
                <DistributionBar>
                  {total > 0 ? (
                    <>
                      <DistributionSegment flex={byType.fixed / total}      color={TYPE_CONFIG.fixed.color} />
                      <DistributionSegment flex={byType.variable / total}   color={TYPE_CONFIG.variable.color} />
                      <DistributionSegment flex={byType.occasional / total} color={TYPE_CONFIG.occasional.color} />
                    </>
                  ) : (
                    <DistributionSegment flex={1} color="#e8e8e8" />
                  )}
                </DistributionBar>
                <DistributionLegend>
                  {(['fixed', 'variable', 'occasional'] as const).map(type => (
                    <LegendItem key={type}>
                      <LegendDot color={TYPE_CONFIG[type].color} />
                      <LegendText>{TYPE_CONFIG[type].label}: </LegendText>
                      <LegendValue>
                        {total > 0 ? `${Math.round((byType[type] / total) * 100)}%` : '—'}
                      </LegendValue>
                    </LegendItem>
                  ))}
                </DistributionLegend>
              </DistributionCard>

              <SectionTitle>Por categoria</SectionTitle>
              <CategoryCard>
                <CategoryCardTitle>Top categorias do mês</CategoryCardTitle>
                {byCategory.length === 0 ? (
                  <EmptyCategoryText>Sem dados para este mês</EmptyCategoryText>
                ) : (
                  byCategory.map(([name, amount], idx) => {
                    const pct = total > 0 ? amount / total : 0;
                    const color = CATEGORY_COLORS[idx % CATEGORY_COLORS.length];
                    return (
                      <CategoryRow key={name}>
                        <CategoryRowHeader>
                          <CategoryName numberOfLines={1}>{name}</CategoryName>
                          <CategoryAmount>{formatCurrency(amount)}</CategoryAmount>
                          <CategoryPercent>{Math.round(pct * 100)}%</CategoryPercent>
                        </CategoryRowHeader>
                        <BarTrack>
                          <BarFill width={`${Math.round(pct * 100)}%`} color={color} />
                        </BarTrack>
                      </CategoryRow>
                    );
                  })
                )}
              </CategoryCard>

              <SectionTitle>Últimas despesas</SectionTitle>
              <RecentCard>
                <RecentCardHeader>
                  <RecentCardTitle>Lançamentos recentes</RecentCardTitle>
                  <SeeAllButton onPress={() => router.push('/expenses' as any)}>
                    <SeeAllText>Ver todos</SeeAllText>
                  </SeeAllButton>
                </RecentCardHeader>

                {recentExpenses.length === 0 ? (
                  <EmptyExpenseText>Nenhuma despesa neste mês</EmptyExpenseText>
                ) : (
                  recentExpenses.map((expense, idx) => {
                    const type = expense.expense_type as keyof typeof TYPE_CONFIG;
                    const cfg = TYPE_CONFIG[type] ?? TYPE_CONFIG.fixed;
                    const isLast = idx === recentExpenses.length - 1;
                    const ItemComponent = isLast ? ExpenseItemLast : ExpenseItem;
                    return (
                      <ItemComponent
                        key={expense.id}
                        onPress={() => router.push({ pathname: '/expenses/edit' as any, params: { id: expense.id } })}
                      >
                        <ExpenseIconWrap bg={cfg.bg}>
                          <MaterialCommunityIcons name={cfg.icon} size={18} color={cfg.color} />
                        </ExpenseIconWrap>
                        <ExpenseItemInfo>
                          <ExpenseItemName numberOfLines={1}>{expense.description}</ExpenseItemName>
                          <ExpenseItemMeta>
                            {formatDate(expense.expense_date)}
                            {expense.category_name ? ` · ${expense.category_name}` : ''}
                          </ExpenseItemMeta>
                        </ExpenseItemInfo>
                        <ExpenseItemRight>
                          <ExpenseItemAmount>{formatCurrency(expense.amount)}</ExpenseItemAmount>
                          <TypeBadge bg={cfg.bg}>
                            <TypeBadgeText color={cfg.color}>
                              {EXPENSE_TYPE_LABELS[expense.expense_type]}
                            </TypeBadgeText>
                          </TypeBadge>
                        </ExpenseItemRight>
                      </ItemComponent>
                    );
                  })
                )}
              </RecentCard>

            </ContentPadding>
          </ScrollContent>
        )}
      </Container>
    </SafeAreaView>
  );
}

