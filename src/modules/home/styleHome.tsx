// eslint-disable-next-line import/no-named-as-default
import styled from 'styled-components/native';

// ── Layout ──────────────────────────────────────────────────────────────────

export const Container = styled.View`
  flex: 1;
  background-color: #f7f7f7;
`;

export const ScrollContent = styled.ScrollView`
  flex: 1;
`;

export const ContentPadding = styled.View`
  padding: 16px 16px 48px;
  gap: 16px;
`;

// ── Section Title ────────────────────────────────────────────────────────────

export const SectionTitle = styled.Text`
  font-size: 12px;
  font-weight: 700;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 8px;
  padding-horizontal: 2px;
`;

// ── KPI Cards ────────────────────────────────────────────────────────────────

export const KpiGrid = styled.View`
  gap: 10px;
`;

export const KpiRow = styled.View`
  flex-direction: row;
  gap: 10px;
`;

export const KpiCard = styled.View<{ accent?: string }>`
  flex: 1;
  background-color: #fff;
  border-radius: 14px;
  padding: 14px 12px;
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.06;
  shadow-radius: 4px;
  border-left-width: 3px;
  border-left-color: ${({ accent }) => accent ?? '#c43edf'};
`;

export const KpiCardWide = styled(KpiCard)`
  flex-direction: row;
  align-items: center;
  gap: 12px;
`;

export const KpiIconBox = styled.View<{ bg?: string }>`
  width: 44px;
  height: 44px;
  border-radius: 22px;
  background-color: ${({ bg }) => bg ?? '#f3e8ff'};
  justify-content: center;
  align-items: center;
`;

export const KpiInfo = styled.View`
  flex: 1;
`;

export const KpiLabel = styled.Text`
  font-size: 11px;
  color: #999;
  margin-bottom: 2px;
`;

export const KpiValue = styled.Text`
  font-size: 18px;
  font-weight: 800;
  color: #1a1a1a;
  letter-spacing: -0.3px;
`;

export const KpiSubValue = styled.Text<{ positive?: boolean }>`
  font-size: 11px;
  color: ${({ positive }) => (positive ? '#10b981' : '#ef4444')};
  font-weight: 600;
  margin-top: 2px;
`;

export const KpiSmallLabel = styled.Text`
  font-size: 10px;
  color: #bbb;
  margin-top: 2px;
`;

// ── Expense Type Distribution Band ───────────────────────────────────────────

export const DistributionCard = styled.View`
  background-color: #fff;
  border-radius: 14px;
  padding: 16px;
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.06;
  shadow-radius: 4px;
`;

export const DistributionTitle = styled.Text`
  font-size: 13px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 12px;
`;

export const DistributionBar = styled.View`
  flex-direction: row;
  height: 10px;
  border-radius: 8px;
  overflow: hidden;
  background-color: #f0f0f5;
  margin-bottom: 12px;
`;

export const DistributionSegment = styled.View<{ flex: number; color: string }>`
  flex: ${({ flex }) => flex};
  background-color: ${({ color }) => color};
`;

export const DistributionLegend = styled.View`
  flex-direction: row;
  gap: 16px;
  flex-wrap: wrap;
`;

export const LegendItem = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 6px;
`;

export const LegendDot = styled.View<{ color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${({ color }) => color};
`;

export const LegendText = styled.Text`
  font-size: 11px;
  color: #666;
`;

export const LegendValue = styled.Text`
  font-size: 11px;
  font-weight: 700;
  color: #1a1a1a;
`;

// ── Category Bars ────────────────────────────────────────────────────────────

export const CategoryCard = styled.View`
  background-color: #fff;
  border-radius: 14px;
  padding: 16px;
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.06;
  shadow-radius: 4px;
`;

export const CategoryCardTitle = styled.Text`
  font-size: 13px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 14px;
`;

export const CategoryRow = styled.View`
  margin-bottom: 12px;
`;

export const CategoryRowHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
`;

export const CategoryName = styled.Text`
  font-size: 12px;
  color: #444;
  font-weight: 500;
  flex: 1;
`;

export const CategoryAmount = styled.Text`
  font-size: 12px;
  font-weight: 700;
  color: #1a1a1a;
`;

export const CategoryPercent = styled.Text`
  font-size: 10px;
  color: #aaa;
  margin-left: 6px;
  min-width: 34px;
  text-align: right;
`;

export const BarTrack = styled.View`
  height: 6px;
  border-radius: 4px;
  background-color: #f0f0f5;
  overflow: hidden;
`;

export const BarFill = styled.View<{ width: string; color: string }>`
  height: 6px;
  border-radius: 4px;
  width: ${({ width }) => width};
  background-color: ${({ color }) => color};
`;

export const EmptyCategoryText = styled.Text`
  font-size: 13px;
  color: #bbb;
  text-align: center;
  padding-vertical: 12px;
`;

// ── Recent Expenses ───────────────────────────────────────────────────────────

export const RecentCard = styled.View`
  background-color: #fff;
  border-radius: 14px;
  padding: 16px;
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.06;
  shadow-radius: 4px;
`;

export const RecentCardHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

export const RecentCardTitle = styled.Text`
  font-size: 13px;
  font-weight: 700;
  color: #1a1a1a;
`;

export const SeeAllButton = styled.TouchableOpacity``;

export const SeeAllText = styled.Text`
  font-size: 12px;
  color: #c43edf;
  font-weight: 600;
`;

export const ExpenseItem = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding-vertical: 10px;
  border-bottom-width: 1px;
  border-bottom-color: #f4f4f4;
`;

export const ExpenseItemLast = styled(ExpenseItem)`
  border-bottom-width: 0px;
`;

export const ExpenseIconWrap = styled.View<{ bg?: string }>`
  width: 38px;
  height: 38px;
  border-radius: 19px;
  background-color: ${({ bg }) => bg ?? '#f3e8ff'};
  justify-content: center;
  align-items: center;
  margin-right: 10px;
`;

export const ExpenseItemInfo = styled.View`
  flex: 1;
`;

export const ExpenseItemName = styled.Text`
  font-size: 13px;
  font-weight: 600;
  color: #1a1a1a;
`;

export const ExpenseItemMeta = styled.Text`
  font-size: 11px;
  color: #aaa;
  margin-top: 1px;
`;

export const ExpenseItemRight = styled.View`
  align-items: flex-end;
`;

export const ExpenseItemAmount = styled.Text`
  font-size: 13px;
  font-weight: 700;
  color: #1a1a1a;
`;

export const TypeBadge = styled.View<{ bg?: string }>`
  background-color: ${({ bg }) => bg ?? '#f3e8ff'};
  border-radius: 6px;
  padding: 2px 6px;
  margin-top: 2px;
`;

export const TypeBadgeText = styled.Text<{ color?: string }>`
  font-size: 9px;
  font-weight: 700;
  color: ${({ color }) => color ?? '#c43edf'};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const EmptyExpenseText = styled.Text`
  font-size: 13px;
  color: #bbb;
  text-align: center;
  padding-vertical: 16px;
`;

// ── Loading ───────────────────────────────────────────────────────────────────

export const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
