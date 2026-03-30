// eslint-disable-next-line import/no-named-as-default
import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: #fff;
`;

export const ContentContainer = styled.View`
  padding: 24px;
  padding-bottom: 46px;
`;

export const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 40px;
`;

export const EmptyStateContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 40px 24px;
`;

export const EmptyStateIcon = styled.View`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  background-color: #f5f5f5;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
`;

export const EmptyStateText = styled.Text`
  font-size: 16px;
  color: #666;
  text-align: center;
  margin-top: 16px;
`;

export const SummaryCard = styled.View`
  background-color: #f9f9f9;
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 20px;
  border: 1px solid #e0e0e0;
  flex-direction: row;
  flex-wrap: wrap;
`;

export const SummaryItem = styled.View`
  width: 48%;
  min-width: 140px;
  background-color: #fff;
  border-radius: 8px;
  padding: 12px;
  margin: 4px 1%;
  align-items: center;
  justify-content: center;
  border: 1px solid #e8e8e8;
`;

export const SummaryLabel = styled.Text`
  font-size: 12px;
  color: #666;
  text-align: center;
  margin-top: 6px;
`;

export const SummaryValue = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #333;
`;

export const PurposeCard = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 10px;
  border: 1px solid #e8e8e8;
  elevation: 1;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.08;
  shadow-radius: 2px;
`;

export const PurposeIconContainer = styled.View`
  width: 44px;
  height: 44px;
  border-radius: 22px;
  background-color: #f3e8ff;
  justify-content: center;
  align-items: center;
  margin-right: 14px;
`;

export const PurposeInfo = styled.View`
  flex: 1;
`;

export const PurposeName = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
`;

interface ActiveProps {
  active: boolean;
}

export const PurposeBadge = styled.View<ActiveProps>`
  padding: 4px 10px;
  border-radius: 12px;
  background-color: ${({ active }: ActiveProps) => (active ? '#e8f5e9' : '#fce4ec')};
`;

export const PurposeBadgeText = styled.Text<ActiveProps>`
  font-size: 12px;
  font-weight: 500;
  color: ${({ active }: ActiveProps) => (active ? '#2e7d32' : '#c62828')};
`;
