// eslint-disable-next-line import/no-named-as-default
import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: #f7f7f7;
`;

export const ContentContainer = styled.View`
  padding: 16px;
  padding-bottom: 46px;
`;

export const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const EmptyStateContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 60px 24px;
`;

export const EmptyStateIcon = styled.View`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  background-color: #f3e8ff;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
`;

export const EmptyStateText = styled.Text`
  font-size: 16px;
  color: #666;
  text-align: center;
  line-height: 24px;
`;

export const SummaryRow = styled.View`
  gap: 10px;
  margin-bottom: 16px;
`;

export const SummaryCard = styled.View`
  flex-direction: row;
  gap: 12px;
  justify-content: center;
  flex: 1;
  background-color: #fff;
  border-radius: 12px;
  padding: 14px 12px;
  align-items: center;
  border: 1px solid #e8e8e8;
  elevation: 1;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.06;
  shadow-radius: 2px;
`;

export const SummaryLabel = styled.Text`
  font-size: 11px;
  color: #888;
  text-align: center;
  margin-top: 4px;
`;

export const SummaryValue = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
  margin-top: 2px;
`;

export const SectionHeader = styled.Text`
  font-size: 13px;
  font-weight: 600;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 8px;
  margin-bottom: 8px;
  padding-horizontal: 4px;
`;

export const ExpenseCard = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: #fff;
  border-radius: 14px;
  padding: 14px 16px;
  margin-bottom: 8px;
  border: 1px solid #e8e8e8;
  elevation: 1;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.06;
  shadow-radius: 2px;
`;

export const ExpenseIconContainer = styled.View`
  width: 44px;
  height: 44px;
  border-radius: 22px;
  background-color: #f3e8ff;
  justify-content: center;
  align-items: center;
  margin-right: 12px;
`;

export const ExpenseInfo = styled.View`
  flex: 1;
`;

export const ExpenseDescription = styled.Text`
  font-size: 15px;
  font-weight: 600;
  color: #1a1a1a;
`;

export const ExpenseMeta = styled.Text`
  font-size: 12px;
  color: #888;
  margin-top: 2px;
`;

export const ExpenseAmountContainer = styled.View`
  align-items: flex-end;
`;

export const ExpenseAmount = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: #c43edf;
`;

export const ExpenseDate = styled.Text`
  font-size: 11px;
  color: #aaa;
  margin-top: 2px;
`;

interface TypeBadgeProps {
  expenseType: string;
}

const typeColors: Record<string, { bg: string; text: string }> = {
  fixed: { bg: '#e8f5e9', text: '#2e7d32' },
  variable: { bg: '#fff3e0', text: '#e65100' },
  occasional: { bg: '#e3f2fd', text: '#1565c0' },
};

export const TypeBadge = styled.View<TypeBadgeProps>`
  padding: 2px 8px;
  border-radius: 10px;
  background-color: ${({ expenseType }: TypeBadgeProps) =>
    typeColors[expenseType]?.bg || '#f5f5f5'};
  margin-top: 4px;
  align-self: flex-start;
`;

export const TypeBadgeText = styled.Text<TypeBadgeProps>`
  font-size: 11px;
  font-weight: 500;
  color: ${({ expenseType }: TypeBadgeProps) =>
    typeColors[expenseType]?.text || '#666'};
`;

export const MonthFilterBar = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  padding: 10px 20px;
  border-bottom-width: 1px;
  border-bottom-color: #e8e8e8;
`;

export const MonthFilterLabel = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
`;

export const MonthFilterButton = styled.TouchableOpacity`
  padding: 6px;
`;
