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

export const EmptyStateContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 40px 24px;
`;

export const EmptyStateText = styled.Text`
  font-size: 16px;
  color: #666;
  text-align: center;
  margin-top: 16px;
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

export const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 40px;
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
